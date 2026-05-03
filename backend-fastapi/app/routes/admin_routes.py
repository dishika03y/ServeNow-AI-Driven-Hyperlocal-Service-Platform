from fastapi import APIRouter, Depends, HTTPException, Query
from bson import ObjectId
from app.routes.user_routes import get_current_user
from app.services.admin_service import (
    get_workers_by_status,
    get_worker_details,
    approve_worker,
    reject_worker,
    get_admin_dashboard
)


def get_admin_user(current_user=Depends(get_current_user)):
    if current_user.get("role") != "ADMIN":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# ✅ Dashboard
@router.get("/dashboard")
async def dashboard(admin=Depends(get_admin_user)):
    return await get_admin_dashboard()


# ✅ Get workers list (filter by status)
@router.get("/workers")
async def list_workers(
    status: str = Query(None, description="pending/approved/rejected"),
    admin=Depends(get_admin_user)
):
    workers = await get_workers_by_status(status)
    return {
        "total": len(workers),
        "data": workers
    }


# ✅ Get worker details
@router.get("/workers/{worker_id}")
async def worker_details(worker_id: str, admin=Depends(get_admin_user)):
    worker = await get_worker_details(worker_id)

    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    return worker


# ✅ Approve worker
@router.patch("/workers/{worker_id}/approve")
async def approve(worker_id: str, admin=Depends(get_admin_user)):
    success = await approve_worker(worker_id)

    if not success:
        raise HTTPException(status_code=400, detail="Unable to approve worker")

    return {"message": "Worker approved successfully"}


# ✅ Reject worker
@router.patch("/workers/{worker_id}/reject")
async def reject(worker_id: str, admin=Depends(get_admin_user)):
    success = await reject_worker(worker_id)

    if not success:
        raise HTTPException(status_code=400, detail="Unable to reject worker")

    return {"message": "Worker rejected successfully"}