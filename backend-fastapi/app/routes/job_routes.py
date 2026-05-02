from fastapi import APIRouter, Depends, HTTPException
from app.services.job_service import create_job, get_user_jobs, update_job_status, get_all_jobs
from app.core.security import get_current_user
from app.services.job_service import assign_worker, get_worker_jobs

router = APIRouter()

# CREATE JOB

@router.post("/")
def create_job_route(data: dict, user=Depends(get_current_user)):
    service_id = data.get("serviceId")


    if not service_id:
        raise HTTPException(status_code=400, detail="serviceId is required")

    return create_job(user["id"], service_id)

@router.get("/")
def get_all_jobs_route():
    return get_all_jobs()

# GET MY JOBS

@router.get("/me")
def get_my_jobs_route(user=Depends(get_current_user)):
    return get_user_jobs(user["id"])


@router.get("/worker/{worker_id}")
def get_worker_jobs_route(worker_id: str):
    return get_worker_jobs(worker_id)    

# UPDATE JOB STATUS

@router.put("/{job_id}")
def update_status_route(job_id: str, status: str):
    allowed_status = ["PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"]

    if status not in allowed_status:
        raise HTTPException(status_code=400, detail="Invalid status")

    return update_job_status(job_id, status)

@router.put("/{job_id}/assign")
def assign_worker_route(job_id: str, workerId: str):
    return assign_worker(job_id, workerId)    