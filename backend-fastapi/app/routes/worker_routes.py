from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, File
from bson import ObjectId

from app.schemas.workers_schemas import WorkerApplySchema
from app.services.worker_service import create_worker_application
from app.routes.user_routes import get_current_user

from app.services.upload_service import upload_to_cloudinary
from app.database.db import worker_collection
from app.services.worker_service import update_worker_documents

from app.services.ocr_service import extract_text_from_image
from app.services.aadhar_parser import parse_aadhaar_text

from app.services.face_service import compare_faces

router = APIRouter(
    prefix="/workers",
    tags=["Workers"]
)


@router.post("/apply")
def apply_as_worker(
    data: WorkerApplySchema,
    current_user=Depends(get_current_user)
):

    if current_user["role"] != "USER":
        raise HTTPException(status_code=403, detail="Not allowed")

    result = create_worker_application(current_user, data.model_dump())

    if not result:
        raise HTTPException(
            status_code=400,
            detail="You have already applied"
        )

    return {
        "message": "Worker application submitted",
        "status": "PENDING"
    }

@router.post("/upload-documents")
def upload_documents(
    aadhaar_front: UploadFile = File(...),
    aadhaar_back: UploadFile = File(...),
    selfie: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    worker = worker_collection.find_one({"userId": current_user["_id"]})

    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    # Upload images
    aadhaar_front_url = upload_to_cloudinary(aadhaar_front, "workers/aadhaar/front")
    aadhaar_back_url = upload_to_cloudinary(aadhaar_back, "workers/aadhaar/back")
    selfie_url = upload_to_cloudinary(selfie, "workers/selfie")

    documents = {
        "aadhaarFront": aadhaar_front_url,
        "aadhaarBack": aadhaar_back_url,
        "selfieImage": selfie_url
    }

    update_worker_documents(worker["_id"], documents)

    return {
        "message": "Documents uploaded",
        "documents": documents
    }

@router.post("/verify-aadhaar")
def verify_aadhaar(current_user=Depends(get_current_user)):

    worker = worker_collection.find_one({"userId": current_user["_id"]})

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

@router.post("/verify-face")
def verify_face(current_user=Depends(get_current_user)):
    # 1. Find the worker in DB
    worker = worker_collection.find_one({"userId": current_user["_id"]})

    if not worker or "documents" not in worker:
        raise HTTPException(status_code=400, detail="Documents not uploaded")

    # 2. Get the URLs
    aadhaar_url = worker["documents"]["aadhaarFront"]
    selfie_url = worker["documents"]["selfieImage"]

    # 3. RUN IT DIRECTLY (The API will wait here until it's done)
    try:
        print("Starting Face Match... please wait...")
        result = compare_faces(aadhaar_url, selfie_url)
        print(f"Match Result: {result}")

        # 4. Update the database immediately
        worker_collection.update_one(
            {"_id": worker["_id"]},
            {
                "$set": {
                    "faceMatch": result,
                    "verificationStage": "FACE_COMPLETED"
                }
            }
        )

        return {
            "message": "Face verification completed",
            "data": result
        }

    except Exception as e:
        print(f"Face Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")
    
@router.get("/status")
def get_verification_status(current_user=Depends(get_current_user)):
    worker = worker_collection.find_one({"userId": current_user["_id"]})
    if not worker:
        raise HTTPException(status_code=404, detail="Worker application not found")
    
    return {
        "stage": worker.get("verificationStage", "NOT_STARTED"),
        "faceMatch": worker.get("faceMatch"),
        "aadhaarData": worker.get("aadhaarData"),
        "status": worker.get("status")
    }

@router.post("/final-verify")
def final_verify(current_user=Depends(get_current_user)):

    worker = worker_collection.find_one(
        {"userId": current_user["_id"]}
    )

    if not worker:
        raise HTTPException(404, "Worker not found")

    aadhaar_data = worker.get("aadhaarData")
    face_data = worker.get("faceMatch")

    if not aadhaar_data or not face_data:
        raise HTTPException(400, "Complete previous steps first")

    aadhaar_valid = aadhaar_data.get("aadhaarNumber") is not None
    face_score = face_data.get("score", 0)

    if aadhaar_valid and face_score >= 0.6:
        status = "AUTO_APPROVED"
    else:
        status = "MANUAL_REVIEW"

    worker_collection.update_one(
        {"_id": worker["_id"]},
        {
            "$set": {
                "verificationStatus": status,
                "status": "PENDING_APPROVAL"
            }
        }
    )

    return {
        "verificationStatus": status,
        "faceScore": face_score,
        "aadhaarValid": aadhaar_valid
    }