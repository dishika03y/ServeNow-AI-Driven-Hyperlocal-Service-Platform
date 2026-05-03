from bson import ObjectId
from app.database.db import worker_collection, user_collection


# Get workers by status
def get_workers_by_status(status: str):
    query = {}

    if status:
        query["status"] = status

    workers = worker_collection.find(query).to_list(length=None)

    result = []
    for w in workers:
        user = user_collection.find_one(

            {"_id": ObjectId(w["userId"])},
            {"fullName": 1, "phone": 1, "city": 1}
        )

        result.append({
            "worker_id": str(w["_id"]),
            "user_id": str(w["userId"]),
            "fullName": user.get("fullName") if user else None,
            "phone": user.get("phone") if user else None,
            "city": user.get("city") if user else None,
            "status": w.get("status"),
            "verificationStage": w.get("verificationStage"),
            "isLive": w.get("isLive", False)
        })

    return result


# Get single worker details
async def get_worker_details(worker_id: str):
    worker = await worker_collection.find_one({"_id": ObjectId(worker_id)},{
        "userId": 1,
        "fullName": 1,
        "phone": 1,
        "status": 1,
        "verificationStage": 1,
        "isLive": 1,
        "documents": 1
    })

    if not worker:
        return None

    user = await user_collection.find_one(
        {"_id": ObjectId(worker["userId"])},
        {"fullName": 1, "phone": 1, "email": 1, "city": 1}
    )

    return {
        "worker_id": str(worker["_id"]),
        "status": worker.get("status"),
        "verificationStage": worker.get("verificationStage"),
        "isLive": worker.get("isLive", False),

        "user": {
            "id": str(user["_id"]),
            "fullName": user.get("fullName"),
            "phone": user.get("phone"),
            "email": user.get("email"),
            "city": user.get("city")
        } if user else None
    }


# Approve worker
async def approve_worker(worker_id: str):
    result = await worker_collection.update_one(
        {"_id": ObjectId(worker_id)},
        {"$set": {"status": "approved", "isLive": True, "verificationStage": "APPROVED"}}
    )
    await user_collection.update_one(
        {"_id": ObjectId(worker_id)},{
            "$set": {"is_worker": True}
        }
    )

    return result.modified_count > 0


# Reject worker
async def reject_worker(worker_id: str):
    worker = await worker_collection.find_one({"_id": ObjectId(worker_id)})
    if not worker:
        return False
    result = await worker_collection.update_one(
        {"_id": ObjectId(worker_id)},
        {"$set": {"status": "rejected", "isLive": False, "verificationStage": "REJECTED"}}
    )
    await user_collection.update_one(
        {"_id": worker["userId"]},{  
            "$set": {"is_worker": False}
        }
    )

    return result.modified_count > 0


# Dashboard stats
def get_admin_dashboard():
    total_users =  user_collection.count_documents({})
    total_workers = worker_collection.count_documents({})
    pending_workers = worker_collection.count_documents({"status": "pending"})
    approved_workers =  worker_collection.count_documents({"status": "approved"})  

    return {
        "total_users": total_users,
        "total_workers": total_workers,
        "pending_workers": pending_workers,
        "approved_workers": approved_workers
    }