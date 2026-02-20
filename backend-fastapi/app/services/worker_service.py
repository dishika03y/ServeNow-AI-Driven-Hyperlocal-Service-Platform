from datetime import datetime
from bson import ObjectId
from app.database.db import worker_collection


def create_worker_application(user: dict, data: dict):

    # Check if already applied
    existing = worker_collection.find_one({"userId": user["_id"]})

    if existing:
        return None

    worker_data = {
        "userId": user["_id"],
        "fullName": user["fullName"],
        "phone": user["phone"],
        "serviceCategory": data["serviceCategory"],
        "experienceYears": data["experienceYears"],
        "status": "PENDING",
        "verificationStage": "NOT_STARTED",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    worker_collection.insert_one(worker_data)

    return worker_data

def update_worker_documents(worker_id, documents: dict):

    worker_collection.update_one(
        {"_id": worker_id},
        {
            "$set": {
                "documents": documents,
                "verificationStage": "DOCUMENTS_UPLOADED"
            }
        }
    )