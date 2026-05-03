from datetime import datetime
from bson import ObjectId

def booking_entity(booking) -> dict:
    return {
        "id": str(booking["_id"]),
        "userId": str(booking["userId"]),
        "serviceId": str(booking["serviceId"]),
        "jobId": str(booking.get("jobId")) if booking.get("jobId") else None,
        "status": booking.get("status", "CREATED"),
        "scheduledAt": booking.get("scheduledAt"),
        "location": booking.get("location"),
        "notes": booking.get("notes"),
        "createdAt": booking.get("createdAt"),
        "updatedAt": booking.get("updatedAt"),
    }