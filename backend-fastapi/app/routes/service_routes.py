from fastapi import APIRouter
from app.services.service_service import create_service, get_services
from app.schemas.service_schema import ServiceCreate

router = APIRouter()

@router.post("/")
def add_service(data: ServiceCreate):
    return create_service(data.dict())

@router.get("/")
def fetch_services():
    return get_services() 