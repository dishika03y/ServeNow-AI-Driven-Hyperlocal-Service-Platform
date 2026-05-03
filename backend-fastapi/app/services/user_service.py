from bson import ObjectId

from app.database.db import user_collection, worker_collection

def update_user_profile(phone: str, data: dict):

    update_data = {}

    for key, value in data.items():
        if value is not None:
            update_data[key] = value

    if not update_data:
        return None

    result = user_collection.update_one(
        {"phone": phone},
        {"$set": update_data}
    )

    return result

async def get_user_profile(user_id: str):

    # ----------------------
    # USER DATA
    # ----------------------
    user = user_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"password": 0}
    )
    worker = worker_collection.find_one({"userId": ObjectId(user_id)}, {
        "_id": 1,
        "status": 1,
        "verificationStage": 1,
        "isLive": 1
    })

    if not user:
        return None

    # ----------------------
    # BASE RESPONSE
    # ----------------------
    profile = {
        "fullName": user.get("fullName"),
        "city": user.get("city"),
        "is_worker": user.get("is_worker", False),
        "workerStatus": worker.get("status") if worker else None,
    }

    # ----------------------
    # WORKER DATA (if exists)
    # ----------------------
    if user.get("is_worker"):
        worker = worker_collection.find_one(
            {"userId": ObjectId(user_id)}
        )

        if worker:
            profile["workerStatus"] = worker.get("status", "NONE")

    return profile