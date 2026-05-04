from bson import ObjectId
from app.database.db import worker_collection, user_collection


# ---------------------------
# GET WORKERS BY STATUS
# ---------------------------
def get_workers_by_status(status: str):
    query = {}

    if status:
        query["status"] = status.lower()  # FIX: normalize

    workers = worker_collection.find(query)

    result = []

    for w in workers:
        user = None

        try:
            user_id = w.get("userId")

            if user_id:
                user = user_collection.find_one(
                    {"_id": ObjectId(user_id) if ObjectId.is_valid(str(user_id)) else user_id},
                    {"fullName": 1, "phone": 1, "city": 1}
                )
        except Exception:
            user = None

        result.append({
            "worker_id": str(w["_id"]),
            "user_id": str(w.get("userId")),
            "fullName": user.get("fullName") if user else None,
            "phone": user.get("phone") if user else None,
            "city": user.get("city") if user else None,
            "status": w.get("status"),
            "verificationStage": w.get("verificationStage"),
            "isLive": w.get("isLive", False)
        })

    return result


# ---------------------------
# GET WORKER DETAILS
# ---------------------------
async def get_worker_details(worker_id: str):

    worker = await worker_collection.find_one(
        {"_id": ObjectId(worker_id)},
        {
            "userId": 1,
            "status": 1,
            "verificationStage": 1,
            "isLive": 1,
            "documents": 1
        }
    )

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


# ---------------------------
# APPROVE WORKER
# ---------------------------
async def approve_worker(worker_id: str):

    worker = await worker_collection.find_one({"_id": ObjectId(worker_id)})
    if not worker:
        return False

    await worker_collection.update_one(
        {"_id": ObjectId(worker_id)},
        {
            "$set": {
                "status": "approved",
                "isLive": True,
                "verificationStage": "APPROVED"
            }
        }
    )

    # FIX: correct userId mapping (NOT worker_id)
    await user_collection.update_one(
        {"_id": ObjectId(worker["userId"])},
        {"$set": {"is_worker": True}}
    )

    return True


# ---------------------------
# REJECT WORKER
# ---------------------------
async def reject_worker(worker_id: str):

    worker = await worker_collection.find_one({"_id": ObjectId(worker_id)})
    if not worker:
        return False

    await worker_collection.update_one(
        {"_id": ObjectId(worker_id)},
        {
            "$set": {
                "status": "rejected",
                "isLive": False,
                "verificationStage": "REJECTED"
            }
        }
    )

    await user_collection.update_one(
        {"_id": ObjectId(worker["userId"])},
        {"$set": {"is_worker": False}}
    )

    return True


# ---------------------------
# DASHBOARD
# ---------------------------
def get_admin_dashboard():

    total_users = user_collection.count_documents({})

    total_workers = worker_collection.count_documents({})

    pending_workers = worker_collection.count_documents({
        "status": {"$in": ["pending", "PENDING_REVIEW", "MANUAL_CHECK_REQUIRED"]}
    })

    approved_workers = worker_collection.count_documents({
        "status": "approved"
    })

    return {
        "total_users": total_users,
        "total_workers": total_workers,
        "pending_workers": pending_workers,
        "approved_workers": approved_workers
    }