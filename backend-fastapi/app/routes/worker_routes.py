
from app.schemas.workers_schemas import WorkerApplySchema
from app.services.worker_service import create_worker_application
from app.routes.user_routes import get_current_user

from app.services.upload_service import upload_to_cloudinary
from app.database.db import worker_collection
from app.services.worker_service import update_worker_documents

from app.services.ocr_service import extract_text_from_image
from app.services.aadhar_parser import parse_aadhaar_text

from app.services.face_service import compare_faces
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, File
from bson import ObjectId
from datetime import datetime

from fastapi import BackgroundTasks

from app.schemas.workers_schemas import WorkerProfileResponse

router = APIRouter(
    prefix="/workers",
    tags=["Workers"],
    redirect_slashes=False
)


@router.post("/apply")
def apply_as_worker(
    data: WorkerApplySchema, 
    current_user=Depends(get_current_user)
):
    if current_user["role"] != "USER":
        raise HTTPException(status_code=403, detail="Already a worker or admin")

    # 1. Convert Pydantic model to Dict
    worker_data = data.model_dump()

    # 2. Format for MongoDB Geo-Spatial indexing
    # We remove the flat lat/long and create the Point object
    worker_data["location"] = {
        "type": "Point",
        "coordinates": [data.longitude, data.latitude] # Longitude first for MongoDB
    }
    
    # 3. Add internal tracking fields
    worker_data["status"] = "PENDING"
    worker_data["verificationStage"] = "BASIC_DETAILS_SUBMITTED"
    worker_data["isLive"] = False
    worker_data["createdAt"] = datetime.now()

    # 4. Save to Database
    result = create_worker_application(current_user, worker_data)
    
    if not result:
        raise HTTPException(status_code=400, detail="Application already exists")

    return {
        "message": "Profile created successfully. Next step: Upload Documents.", 
        "status": "PENDING"
    }
@router.post("/upload-documents")
def upload_documents(
    aadhaar_front: UploadFile = File(...),
    aadhaar_back: UploadFile = File(...),
    selfie: UploadFile = File(...),
    portfolio_1: UploadFile = File(None), # Optional work photos
    portfolio_2: UploadFile = File(None),
    current_user=Depends(get_current_user)
):
    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1
    })
    if not worker:
        raise HTTPException(404, "Application not found")

    # Upload core IDs
    docs = {
        "aadhaarFront": upload_to_cloudinary(aadhaar_front, "workers/id"),
        "aadhaarBack": upload_to_cloudinary(aadhaar_back, "workers/id"),
        "selfieImage": upload_to_cloudinary(selfie, "workers/selfie"),
        "portfolio": []
    }

    # Upload Portfolio images if provided
    for p in [portfolio_1, portfolio_2]:
        if p:
            url = upload_to_cloudinary(p, "workers/portfolio")
            docs["portfolio"].append(url)

    worker_collection.update_one(
        {"_id": worker["_id"]},
        {"$set": {"documents": docs, "verificationStage": "DOCUMENTS_UPLOADED"}}
    )

    return {"message": "Documents and Portfolio uploaded successfully"}

@router.post("/verify-aadhaar")
def verify_aadhaar(current_user=Depends(get_current_user)):

    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1,
        "documents": 1
    })

    if not worker or "documents" not in worker:
        raise HTTPException(status_code=400, detail="Documents not uploaded")

    front_url = worker["documents"]["aadhaarFront"]
    back_url = worker["documents"]["aadhaarBack"]

    # OCR both
    front_text = extract_text_from_image(front_url)
    back_text = extract_text_from_image(back_url)

    # Parse
    front_data = parse_aadhaar_text(front_text)
    back_data = parse_aadhaar_text(back_text)

    # FINAL MERGE LOGIC
    final_data = {
        "name": front_data.get("name"),
        "dob": front_data.get("dob"),
        "aadhaarNumber": back_data.get("aadhaarNumber")
    }

    worker_collection.update_one(
        {"_id": worker["_id"]},
        {
            "$set": {
                "aadhaarData": final_data,
                "verificationStage": "OCR_COMPLETED"
            }
        }
    )

    return {
        "message": "Aadhaar verified",
        "data": final_data
    }

def run_face_verification(aadhaar_url, selfie_url, worker_id):
    result = compare_faces(aadhaar_url, selfie_url)

    worker_collection.update_one(
        {"_id": worker_id},
        {
            "$set": {
                "faceMatch": result,
                "verificationStage": "FACE_COMPLETED"
            }
        }
    )

@router.post("/verify-face")
def verify_face(background_tasks: BackgroundTasks, current_user=Depends(get_current_user)):
    # 1. Find the worker in DB
    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1,
        "documents": 1
    })

    if not worker or "documents" not in worker:
        raise HTTPException(status_code=400, detail="Documents not uploaded")

    # 2. Get the URLs
    aadhaar_url = worker["documents"]["aadhaarFront"]
    selfie_url = worker["documents"]["selfieImage"]

    try:
        print("Starting Face Match... please wait...")
        background_tasks.add_task(run_face_verification, aadhaar_url, selfie_url, worker["_id"])
        return {"message": "Processing in background"}

    except Exception as e:
        print(f"Face Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")
    
@router.get("/status")
def get_verification_status(current_user=Depends(get_current_user)):
    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1,
        "verificationStage": 1,
        "faceMatch": 1,
        "aadhaarData": 1,
        "status": 1
    })
    if not worker:
        raise HTTPException(status_code=404, detail="Worker application not found")
    
    return {
        "stage": worker.get("verificationStage", "NOT_STARTED"),
        "faceMatch": worker.get("faceMatch", None),
        "aadhaarData": worker.get("aadhaarData", None),
        "status": worker.get("status")
    }

@router.post("/final-verify")
def final_verify(current_user=Depends(get_current_user)):
    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1,
        "aadhaarData": 1,
        "faceMatch": 1
    })
    
    aadhaar_data = worker.get("aadhaarData")
    face_data = worker.get("faceMatch")

    if not aadhaar_data or not face_data:
        raise HTTPException(400, "Incomplete AI verification steps")

    # Logic: Robust verification
    num = str(aadhaar_data.get("aadhaarNumber", ""))
    is_aadhaar_pattern_valid = len(num) == 12 and num.isdigit()
    
    face_score = face_data.get("score", 0)

    # Threshold Logic
    if is_aadhaar_pattern_valid and face_score >= 0.8:
        internal_status = "HIGH_CONFIDENCE_MATCH"
    elif is_aadhaar_pattern_valid and face_score >= 0.5:
        internal_status = "MANUAL_CHECK_REQUIRED"
    else:
        internal_status = "POTENTIAL_FRAUD_FLAG"

    worker_collection.update_one(
        {"_id": worker["_id"]},
        {
            "$set": {
                "internalVerificationScore": internal_status,
                "status": "WAITING_FOR_ADMIN", # Worker cannot go live yet
                "verificationStage": "COMPLETED_AWAITING_REVIEW"
            }
        }
    )

    return {
        "message": "Verification submitted for final review",
        "internal_status": internal_status
    }

@router.delete("/reset-application")
def reset_application(current_user=Depends(get_current_user)):
    # Allow user to delete their pending application to try again
    result = worker_collection.delete_one({
        "userId": current_user["_id"], 
        "status": {"$ne": "APPROVED"} # Cannot delete if already approved
    })
    if result.deleted_count == 0:
        raise HTTPException(400, "Cannot reset application at this stage")
    return {"message": "Application reset. You can apply again."}

@router.get("/me", response_model=WorkerProfileResponse)
def get_worker_profile(current_user=Depends(get_current_user)):
    worker = worker_collection.find_one({"userId": current_user["_id"]},{
        "_id": 1,
        "userId": 1,
        "fullName": 1,
        "phone": 1,
        "serviceCategory": 1,   
        "experienceYears": 1,
         "isLive": 1,
         "status": 1
    })

    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    worker["_id"] = str(worker["_id"])
    worker["userId"] = str(worker["userId"])

    return {
        "id": worker["_id"],
        "fullName": worker.get("fullName"),
        "phone": worker.get("phone"),
        "serviceCategory": worker.get("serviceCategory"),
        "experienceYears": worker.get("experienceYears"),
        "isLive": worker.get("isLive", False),
        "status": worker.get("status", "PENDING")
    }

# Initialize a thread pool for synchronous functions
thread_pool = ThreadPoolExecutor(max_workers=3)

@router.post("/verify-all")
async def verify_all(current_user = Depends(get_current_user)):
    worker = worker_collection.find_one(
        {"userId": current_user["_id"]},
        {"_id": 1, "documents": 1}
    )

    if not worker or "documents" not in worker:
        raise HTTPException(status_code=400, detail="Documents not uploaded")

    loop = asyncio.get_running_loop()

    try:
        # Run synchronous service functions in a separate thread pool to prevent blocking the event loop
        front_text = await loop.run_in_executor(
            thread_pool, 
            extract_text_from_image, 
            worker["documents"]["aadhaarFront"]
        )
        back_text = await loop.run_in_executor(
            thread_pool, 
            extract_text_from_image, 
            worker["documents"]["aadhaarBack"]
        )
        
        aadhaar_data = await loop.run_in_executor(
            thread_pool, 
            parse_aadhaar_text, 
            front_text
        )

        face_result = await loop.run_in_executor(
            thread_pool, 
            compare_faces, 
            worker["documents"]["aadhaarFront"], 
            worker["documents"]["selfieImage"]
        )

        num = str(aadhaar_data.get("aadhaarNumber", ""))
        is_valid = len(num) == 12 and num.isdigit()
        face_score = face_result.get("score", 0)

        if is_valid and face_score >= 0.8:
            status = "HIGH_CONFIDENCE_MATCH"
            final_status = "APPROVED"
        elif is_valid and face_score >= 0.5:
            status = "MANUAL_CHECK_REQUIRED"
            final_status = "PENDING_REVIEW"
        else:
            status = "POTENTIAL_FRAUD_FLAG"
            final_status = "REJECTED"

        worker_collection.update_one(
            {"_id": worker["_id"]},
            {
                "$set": {
                    "aadhaarData": aadhaar_data,
                    "faceMatch": face_result,
                    "internalVerificationScore": status,
                    "status": final_status,
                    "verificationStage": "COMPLETED_AWAITING_REVIEW"
                }
            }
        )

        return {
            "message": "Verification completed",
            "status": final_status,
            "internal_status": status,
            "aadhaar": aadhaar_data,
            "face": face_result
        }

    except Exception as e:
        print("VERIFY-ALL ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Verification failed")