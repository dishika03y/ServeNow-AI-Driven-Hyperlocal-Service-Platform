from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()


client = MongoClient(os.getenv("MONGO_URI"))
db = client["servenow_db"]

def init_db():
    worker_collection.create_index([("userId", 1)])
    worker_collection.create_index([("location", "2dsphere")])

user_collection = db["users"]
service_requests_collection = db["service_requests"]
worker_collection = db["workers"]
booking_model = db["bookings"]