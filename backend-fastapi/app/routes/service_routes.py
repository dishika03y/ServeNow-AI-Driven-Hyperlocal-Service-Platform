from fastapi import APIRouter
from app.services.service_service import create_service, get_services

router = APIRouter()

@router.post("/")
def add_service(data: dict):
    return create_service(data)

@router.get("/")
def fetch_services():
    return get_services()