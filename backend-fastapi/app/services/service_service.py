from app.database.db import db

def create_service(data):
    service = {
        "name": data.get("name"),
        "category": data.get("category"),
        "price": data.get("price")
    }

    db.services.insert_one(service)
    return {"message": "Service created"}

def get_services():
    return list(db.services.find())