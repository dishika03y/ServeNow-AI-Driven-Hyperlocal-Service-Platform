from app.database.db import db
from bson import ObjectId
from datetime import datetime

from datetime import datetime

def create_job(user_id, service_id):
    job = {
        "userId": user_id,
        "serviceId": service_id,
        "workerId": None,   
        "status": "PENDING",
        "createdAt": datetime.utcnow()
    }

    db.jobs.insert_one(job)
    return {"message": "Job created"}

def assign_worker(job_id, worker_id):
    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"workerId": worker_id, "status": "ACCEPTED"}}
    )

    return {"message": "Worker assigned"}    

def get_user_jobs(user_id):
    return list(db.jobs.find({"userId": user_id}))   

def update_job_status(job_id, status):
    db.jobs.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": status}}
    )
    return {"message": "Job updated"}     

def get_all_jobs():
    return list(db.jobs.find())   
    

def get_worker_jobs(worker_id):
    return list(db.jobs.find({"workerId": worker_id}))    