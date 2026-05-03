from fastapi import APIRouter, Depends
from app.services.customer_service import (
    get_dashboard,
    get_live_booking,
    get_history,
    get_wallet,
    get_favorites,
    get_notifications
)

from  app.routes.user_routes import get_current_user
from app.core.response import SuccessResponse, ErrorResponse

router = APIRouter(prefix="/customer", tags=["Customer"])


# -----------------------------
# DASHBOARD (CustomerDashboard)
# -----------------------------
@router.get("/dashboard")
async def dashboard(user=Depends(get_current_user)):

    data = await get_dashboard(user["id"])

    return SuccessResponse(data={
        "stats": data["stats"],
        "activeBooking": data["activeBooking"],
        "recent": data["recent"]
    })    


# -----------------------------
# LIVE BOOKING
# -----------------------------
@router.get("/live")
async def live(user=Depends(get_current_user)):

    booking = await get_live_booking(user["id"])

    return SuccessResponse(data=booking)


# -----------------------------
# HISTORY
# -----------------------------
@router.get("/history")
async def history(user=Depends(get_current_user)):

    data = await get_history(user["id"])

    return SuccessResponse(data=data)


# -----------------------------
# WALLET
# -----------------------------
@router.get("/wallet")
async def wallet(user=Depends(get_current_user)):

    data = await get_wallet(user["id"])

    return SuccessResponse(data=data)

# -----------------------------
# FAVORITES
# -----------------------------
@router.get("/favorites")
async def favorites(user=Depends(get_current_user)):

    data = await get_favorites(user["id"])

    return SuccessResponse(data=data)


# -----------------------------
# NOTIFICATIONS
# -----------------------------
@router.get("/notifications")
async def notifications(user=Depends(get_current_user)):

    data = await get_notifications(user["id"])

    return SuccessResponse(data=data)