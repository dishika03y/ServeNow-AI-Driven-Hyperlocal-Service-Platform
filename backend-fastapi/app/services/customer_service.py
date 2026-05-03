from app.database.db import booking_collection, user_collection, worker_collection
from bson import ObjectId
from datetime import datetime


# -----------------------------
# HELPERS
# -----------------------------
def format_price(value):
    return f"₹{value or 0}"


def format_date(dt):
    if not dt:
        return None
    return dt.strftime("%d %b %Y")


# -----------------------------
# ✅ DASHBOARD
# -----------------------------
async def get_dashboard(user_id: str):

    bookings = list(
        booking_collection.find({"userId": ObjectId(user_id)})
        .sort("createdAt", -1)
    )

    total = len(bookings)
    ongoing = sum(1 for b in bookings if b.get("status") in ["ONGOING", "ASSIGNED"])
    completed = sum(1 for b in bookings if b.get("status") == "COMPLETED")

    active = next(
        (b for b in bookings if b.get("status") in ["ONGOING", "ASSIGNED"]),
        None
    )

    recent = bookings[:3]

    return {
        "stats": {
            "total": total,
            "ongoing": ongoing,
            "completed": completed
        },

        "activeBooking": {
            "id": str(active["_id"]),
            "service": active.get("serviceName"),
            "status": active.get("status")
        } if active else None,

        "recent": [
            {
                "id": str(r["_id"]),
                "service": r.get("serviceName"),
                "status": r.get("status")
            }
            for r in recent
        ]
    }


# -----------------------------
# ✅ LIVE BOOKING
# -----------------------------
async def get_live_booking(user_id: str):

    booking = booking_collection.find_one(
        {
            "userId": ObjectId(user_id),
            "status": {"$in": ["ONGOING", "ASSIGNED"]}
        },
        sort=[("createdAt", -1)]
    )

    if not booking:
        return None

    return {
        "id": str(booking["_id"]),
        "service": booking.get("serviceName"),
        "worker": booking.get("workerName", "Assigned Partner"),
        "status": booking.get("status"),
        "eta": booking.get("eta", "15 mins"),
        "date": "Today",
        "price": format_price(booking.get("price"))
    }


# -----------------------------
# ✅ HISTORY
# -----------------------------
async def get_history(user_id: str):

    bookings = list(
        booking_collection.find({
            "userId": ObjectId(user_id),
            "status": "COMPLETED"
        }).sort("createdAt", -1)
    )

    return [
        {
            "id": str(b["_id"]),
            "service": b.get("serviceName"),
            "worker": b.get("workerName", "Unknown"),
            "date": format_date(b.get("createdAt")),
            "status": b.get("status"),
            "price": format_price(b.get("price"))
        }
        for b in bookings
    ]


# -----------------------------
# ✅ WALLET (BASIC VERSION)
# -----------------------------
async def get_wallet(user_id: str):

    bookings = list(
        booking_collection.find({
            "userId": ObjectId(user_id),
            "status": "COMPLETED"
        }).sort("createdAt", -1)
    )

    transactions = []

    total_spent = 0

    for b in bookings[:10]:  # limit
        amount = b.get("price", 0)
        total_spent += amount

        transactions.append({
            "id": str(b["_id"]),
            "title": b.get("serviceName"),
            "amount": f"-₹{amount}",
            "date": format_date(b.get("createdAt"))
        })

    return {
        "balance": 0,  # future wallet system
        "transactions": transactions
    }


# -----------------------------
# ✅ FAVORITES (REALISTIC)
# -----------------------------
async def get_favorites(user_id: str):

    user = user_collection.find_one(
        {"_id": ObjectId(user_id)},
        {"favorites": 1}
    )

    if not user or "favorites" not in user:
        return []

    workers = list(
        worker_collection.find({
            "_id": {"$in": [ObjectId(w) for w in user["favorites"]]}
        })
    )

    return [
        {
            "id": str(w["_id"]),
            "name": w.get("fullName"),
            "service": w.get("serviceCategory")
        }
        for w in workers
    ]


# -----------------------------
# ✅ NOTIFICATIONS (BASIC SYSTEM)
# -----------------------------
async def get_notifications(user_id: str):

    bookings = list(
        booking_collection.find({"userId": ObjectId(user_id)})
        .sort("createdAt", -1)
        .limit(10)
    )

    notifications = []

    for b in bookings:
        status = b.get("status")

        if status == "COMPLETED":
            title = "Service Completed"
            message = f"{b.get('serviceName')} completed successfully"
        elif status == "ONGOING":
            title = "Service Ongoing"
            message = f"{b.get('workerName', 'Partner')} is on the way"
        elif status == "ASSIGNED":
            title = "Worker Assigned"
            message = f"{b.get('workerName', 'Partner')} assigned"
        else:
            title = "Booking Update"
            message = f"{b.get('serviceName')} updated"

        notifications.append({
            "id": str(b["_id"]),
            "title": title,
            "message": message,
            "time": format_date(b.get("createdAt"))
        })

    return notifications