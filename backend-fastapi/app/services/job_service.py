from app.database.db import db
from bson import ObjectId
from datetime import datetime
from app.database.db import worker_collection

from datetime import datetime

async def find_nearest_worker(user_location, category):

    workers = await worker_collection.find({
        "location": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": user_location
                },
                "$maxDistance": 5000  # 5km radius
            }
        },
        "status": "approved",
        "isLive": True,
        "serviceCategory": category
    }).limit(1)

    return list(workers)

async def create_job(user_id, service_id, user_location):
    service = await db.services.find_one({"_id": ObjectId(service_id)})
    if not service:
        return {"error": "Service not found"}
    worker = await find_nearest_worker(user_location, service["category"])
    if not worker:
        return {"error": "No available workers nearby"}
    worker = worker[0]  # Get the nearest worker
    job = {
        "userId": user_id,
        "serviceId": service_id,
        "workerId": worker["_id"],   
        "status": "ASSIGNED",
        "createdAt": datetime.utcnow()
    }

    await db.jobs.insert_one(job)
    return {"message": "worker assigned successfully", "jobId": str(job["_id"]), "workerId": str(worker["_id"])}

async def assign_worker(job_id, worker_id):
    await db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"workerId": worker_id, "status": "ACCEPTED"}}
    )

    return {"message": "Worker assigned"}    

async def get_user_jobs(user_id):
    return list(await db.jobs.find({"userId": user_id}))   

async def update_job_status(job_id, status):
    await db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": status}}
    )
    return {"message": "Job updated"}     

async def get_all_jobs():
    return list(await db.jobs.find())   
    

async def get_worker_jobs(worker_id):
    return list(await db.jobs.find({"workerId": worker_id}))    