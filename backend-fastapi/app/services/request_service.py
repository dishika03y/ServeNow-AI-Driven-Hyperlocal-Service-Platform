from bson import ObjectId
from app.database.db import service_requests_collection


def get_user_requests(user_id: str):

    requests = list(
        service_requests_collection.find(
            {"userId": ObjectId(user_id)},
            {"_id": 0}
        )
    )

    return requests