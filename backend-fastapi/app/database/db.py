from pymongo import MongoClient
import os

client = MongoClient(os.getenv("MONGO_URI"))
db = client["servenow_db"]

user_collection = db["users"]