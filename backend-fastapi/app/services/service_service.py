from app.database.db import db
from bson import ObjectId


# -----------------------------
# CREATE SERVICE
# -----------------------------
def create_service(data):

    service = {
        "name": data.get("name"),
        "description": data.get("description"),
        "price": data.get("price"),
        "category": data.get("category")   # ✅ FIXED
    }

    db.services.insert_one(service)

    return {
        "success": True,
        "message": "Service created successfully"
    }


# -----------------------------
# GET ALL SERVICES
# -----------------------------
def get_services():

    services = list(db.services.find())

    return {
        "success": True,
        "data": [
            {
                "id": str(s["_id"]),
                "name": s.get("name"),
                "description": s.get("description"),
                "price": s.get("price"),
                "category": s.get("category")   # ✅ FIXED
            }
            for s in services
        ]
    }