from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from bson import ObjectId

from app.schemas.workers_schemas import WorkerApplySchema
from app.services.worker_service import create_worker_application
from app.routes.user_routes import get_current_user

from app.services.upload_service import upload_to_cloudinary
from app.database.db import worker_collection
from app.services.worker_service import update_worker_documents

from app.services.ocr_service import extract_text_from_image
from app.services.aadhar_parser import parse_aadhaar_text

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
    aadhaar: UploadFile = File(...),
    selfie: UploadFile = File(...),
    current_user=Depends(get_current_user)
):

    # Find worker application
    worker = worker_collection.find_one(
        {"userId": current_user["_id"]}
    )

    if not worker:
        raise HTTPException(
            status_code=404,
            detail="Worker application not found"
        )

    # Upload to Cloudinary
    aadhaar_url = upload_to_cloudinary(
        aadhaar,
        folder="workers/aadhaar"
    )

    selfie_url = upload_to_cloudinary(
        selfie,
        folder="workers/selfie"
    )

    documents = {
        "aadhaarImage": aadhaar_url,
        "selfieImage": selfie_url
    }

    # Update DB
    update_worker_documents(worker["_id"], documents)

    return {
        "message": "Documents uploaded successfully",
        "nextStage": "VERIFICATION",
        "documents": documents
    }

@router.post("/verify-aadhaar")
def verify_aadhaar(current_user=Depends(get_current_user)):

    worker = worker_collection.find_one(
        {"userId": current_user["_id"]}
    )

    if not worker or "documents" not in worker:
        raise HTTPException(
            status_code=400,
            detail="Documents not uploaded"
        )

    aadhaar_url = worker["documents"]["aadhaarImage"]

    # OCR
    text = extract_text_from_image(aadhaar_url)

    data = parse_aadhaar_text(text)

    worker_collection.update_one(
        {"_id": worker["_id"]},
        {
            "$set": {
                "aadhaarData": data,
                "verificationStage": "OCR_COMPLETED"
            }
        }
    )

    return {
        "message": "OCR verification completed",
        "extractedData": data
    }