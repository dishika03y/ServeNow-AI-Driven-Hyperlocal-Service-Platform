from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

from app.database.db import booking_model
from app.models.booking_model import booking_entity

# 🔥 IMPORTANT: reuse your job system
from app.services.job_service import create_job


# ✅ CREATE BOOKING
def create_booking(user_id: str, data: dict):

    booking = {
        "userId": ObjectId(user_id),
        "serviceId": ObjectId(data["serviceId"]),
        "location": data["location"],
        "scheduledAt": data.get("scheduledAt"),
        "notes": data.get("notes"),
        "status": "CREATED",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow(),
    }

    # ✅ CREATE BOOKING
    result = booking_model.insert_one(booking)

    # ✅ CONVERT LOCATION → GEOJSON COORDINATES
    user_location = [
        data["location"]["lng"],
        data["location"]["lat"]
    ]

    # ✅ CREATE JOB
    job = create_job(
        user_id,
        data["serviceId"],
        user_location
    )

    # ✅ UPDATE BOOKING WITH JOB
    booking_model.update_one(
        {"_id": result.inserted_id},
        {
            "$set": {
                "jobId": job.get("jobId"),
                "status": "ASSIGNED"
            }
        }
    )

    booking["_id"] = result.inserted_id
    booking["jobId"] = job.get("jobId")
    booking["status"] = "ASSIGNED"

    return booking_entity(booking)


# ✅ GET USER BOOKINGS
def get_user_bookings(user_id: str):

    bookings = booking_model.find({
        "userId": ObjectId(user_id)
    }).sort("createdAt", -1)

    return [booking_entity(b) for b in bookings]


# ✅ GET SINGLE BOOKING
def get_booking_by_id(booking_id: str):

    booking = booking_model.find_one({
        "_id": ObjectId(booking_id)
    })

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    return booking_entity(booking)


# ✅ CANCEL BOOKING
def cancel_booking(booking_id: str, user_id: str):

    booking = booking_model.find_one({
        "_id": ObjectId(booking_id),
        "userId": ObjectId(user_id)
    })

    if not booking:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking["status"] in ["COMPLETED", "CANCELLED"]:
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel"
        )

    booking_model.update_one(
        {"_id": ObjectId(booking_id)},
        {
            "$set": {
                "status": "CANCELLED",
                "updatedAt": datetime.utcnow()
            }
        }
    )

    return {"message": "Booking cancelled successfully"}


# ✅ USER STATS
def get_user_stats(user_id: str):

    total = booking_model.count_documents({
        "userId": ObjectId(user_id)
    })

    completed = booking_model.count_documents({
        "userId": ObjectId(user_id),
        "status": "COMPLETED"
    })

    cancelled = booking_model.count_documents({
        "userId": ObjectId(user_id),
        "status": "CANCELLED"
    })

    active = booking_model.count_documents({
        "userId": ObjectId(user_id),
        "status": {
            "$in": [
                "CREATED",
                "ASSIGNED",
                "ACCEPTED",
                "IN_PROGRESS"
            ]
        }
    })

    return {
        "totalBookings": total,
        "completed": completed,
        "cancelled": cancelled,
        "active": active
    }