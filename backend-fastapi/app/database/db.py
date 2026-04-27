from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()


client = MongoClient(os.getenv("MONGO_URI"))
db = client["servenow_db"]

user_collection = db["users"]
service_requests_collection = db["service_requests"]
worker_collection = db["workers"]