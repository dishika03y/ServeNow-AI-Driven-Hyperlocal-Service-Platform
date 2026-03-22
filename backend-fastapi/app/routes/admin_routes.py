from fastapi import APIRouter, HTTPException
from app.database.db import worker_collection
from bson import ObjectId

router = APIRouter(prefix="/admin", tags=["Admin"])

def format_mongo_doc(doc):
    """
    Helper to convert ALL ObjectIds in a document to strings
    so FastAPI can serialize them to JSON.
    """
    if not doc:
        return None
    
    # Convert the primary _id
    doc["_id"] = str(doc["_id"])
    
    # Convert any other ObjectIds (like userId)
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
            
    return doc

@router.get("/workers")
def get_all_workers():
    # Fetch all and format each one
    workers = list(worker_collection.find())
    return [format_mongo_doc(w) for w in workers]

@router.get("/worker/{worker_id}")
def get_worker(worker_id: str):
    try:
        worker = worker_collection.find_one({"_id": ObjectId(worker_id)})
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        return format_mongo_doc(worker)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid ID format")

@router.post("/approve/{worker_id}")
def approve_worker(worker_id: str):
    # Logic remains the same, but ensure we return a clean dict if needed
    result = worker_collection.update_one(
        {"_id": ObjectId(worker_id)},
        {"$set": {"status": "APPROVED", "verificationStatus": "ADMIN_APPROVED"}}
    )
    if result.modified_count == 0:
         raise HTTPException(status_code=404, detail="Worker not found")
    return {"message": "Worker approved successfully"}

@router.post("/reject/{worker_id}")
def reject_worker(worker_id: str):
    try:
        if not ObjectId.is_valid(worker_id):
            raise HTTPException(status_code=400, detail="Invalid ID")

        worker = worker_collection.find_one({"_id": ObjectId(worker_id)})

        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")

        if worker.get("status") == "APPROVED":
            raise HTTPException(status_code=400, detail="Already approved")

        worker_collection.update_one(
            {"_id": ObjectId(worker_id)},
            {
                "$set": {
                    "status": "REJECTED",
                    "verificationStatus": "ADMIN_REJECTED"
                }
            }
        )

        return {"message": "Worker rejected"}

    except Exception as e:
        return {"error": str(e)}