from datetime import datetime
from bson import ObjectId
from app.database.db import worker_collection


def create_worker_application(user: dict, data: dict):
    # 1. Check if the user has already applied
    existing = worker_collection.find_one({"userId": user["_id"]})
    if existing:
        return None

    # 2. Build the base document with User Identity
    worker_data = {
        "userId": user["_id"],
        "fullName": user["fullName"],
        "phone": user["phone"],
        "status": "PENDING",
        "verificationStage": "BASIC_DETAILS_SUBMITTED",
        "isLive": False,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }

    # 3. CRITICAL FIX: Merge the payload from Frontend
    # This automatically adds bankDetails, emergencyContact, shortBio, baseRate, etc.
    worker_data.update(data)

    # 4. Insert the complete document into MongoDB
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