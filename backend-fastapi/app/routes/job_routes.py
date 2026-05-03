from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.services.job_service import (
    create_job,
    get_user_jobs,
    get_worker_jobs,
    update_job_status,
    get_all_jobs
)

router = APIRouter(prefix="/jobs", tags=["Jobs"])


# ✅ CREATE JOB (AUTO ASSIGN)
@router.post("/book")
async def create_job_route(data: dict, user=Depends(get_current_user)):

    if not data.get("serviceId") or not data.get("location"):
        raise HTTPException(400, "serviceId and location required")

    return await create_job(
        str(user["_id"]),
        data["serviceId"],
        data["location"]
    )


# ✅ GET MY JOBS
@router.get("/me")
async def get_my_jobs_route(user=Depends(get_current_user)):
    return await get_user_jobs(str(user["_id"]))


# ✅ GET WORKER JOBS
@router.get("/worker/{worker_id}")
async def get_worker_jobs_route(worker_id: str):
    return await get_worker_jobs(worker_id)


# ✅ UPDATE JOB STATUS
@router.put("/{job_id}")
async def update_status_route(job_id: str, status: str):

    allowed_status = ["ASSIGNED", "ACCEPTED", "COMPLETED", "CANCELLED"]

    if status not in allowed_status:
        raise HTTPException(400, "Invalid status")

    return await update_job_status(job_id, status)


# ✅ ADMIN (optional)
@router.get("/")
async def get_all_jobs_route():
    return await get_all_jobs()