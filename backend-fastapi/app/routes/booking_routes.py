from fastapi import APIRouter, Depends

from app.routes.user_routes import get_current_user
from app.schemas.booking_schemas import BookingCreateSchema
from app.services.booking_service import (
    create_booking,
    get_user_bookings,
    get_booking_by_id,
    cancel_booking,
    get_user_stats
)

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


# ✅ CREATE BOOKING
@router.post("/")
async def create_booking_route(
    data: BookingCreateSchema,
    user=Depends(get_current_user)
):
    return await create_booking(str(user["_id"]), data.dict())


# ✅ GET MY BOOKINGS
@router.get("/me")
async def get_my_bookings_route(user=Depends(get_current_user)):
    return await get_user_bookings(str(user["_id"]))


# ✅ GET SINGLE BOOKING
@router.get("/{booking_id}")
async def get_booking_route(booking_id: str):
    return await get_booking_by_id(booking_id)


# ✅ CANCEL BOOKING
@router.patch("/{booking_id}/cancel")
async def cancel_booking_route(
    booking_id: str,
    user=Depends(get_current_user)
):
    return await cancel_booking(booking_id, str(user["_id"]))


# ✅ USER STATS (DASHBOARD)
@router.get("/me/stats")
async def get_stats_route(user=Depends(get_current_user)):
    return await get_user_stats(str(user["_id"]))