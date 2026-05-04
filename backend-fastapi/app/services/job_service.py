from bson import ObjectId
from datetime import datetime
from app.database.db import db, worker_collection


# ✅ FIND NEAREST WORKER
def find_nearest_worker(user_location, category):

    workers = list(
        worker_collection.find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": user_location
                    },
                    "$maxDistance": 5000
                }
            },
            "status": "approved",
            "isLive": True,
            "serviceCategory": category
        }).limit(1)
    )

    return workers


# ✅ CREATE JOB
def create_job(user_id, service_id, user_location):

    service = db.services.find_one(
        {"_id": ObjectId(service_id)}
    )

    if not service:
        return {"error": "Service not found"}

    workers = find_nearest_worker(
        user_location,
        service["category"]
    )

    if not workers:
        return {"error": "No workers nearby"}

    worker = workers[0]

    job = {
        "userId": ObjectId(user_id),
        "serviceId": ObjectId(service_id),
        "workerId": worker["_id"],
        "status": "ASSIGNED",
        "createdAt": datetime.utcnow()
    }

    result = db.jobs.insert_one(job)

    return {
        "message": "Worker assigned successfully",
        "jobId": str(result.inserted_id),
        "workerId": str(worker["_id"])
    }


# ✅ SERIALIZER
def serialize_job(job):
    job["_id"] = str(job["_id"])
    job["userId"] = str(job["userId"])
    job["workerId"] = str(job["workerId"])
    job["serviceId"] = str(job["serviceId"])
    return job


# ✅ GET USER JOBS
def get_user_jobs(user_id):

    jobs = list(
        db.jobs.find({
            "userId": ObjectId(user_id)
        })
    )

    return [serialize_job(j) for j in jobs]


# ✅ GET WORKER JOBS
def get_worker_jobs(worker_id):

    jobs = list(
        db.jobs.find({
            "workerId": ObjectId(worker_id)
        })
    )

    return [serialize_job(j) for j in jobs]


# ✅ UPDATE STATUS
def update_job_status(job_id, status):

    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": status}}
    )

    return {"message": "Job updated"}


# ✅ GET ALL JOBS
def get_all_jobs():

    jobs = list(db.jobs.find())

    return [serialize_job(j) for j in jobs]