from app.database.db import user_collection

def update_user_profile(phone: str, data: dict):

    update_data = {}

    for key, value in data.items():
        if value is not None:
            update_data[key] = value

    if not update_data:
        return None

    result = user_collection.update_one(
        {"phone": phone},
        {"$set": update_data}
    )

    return result