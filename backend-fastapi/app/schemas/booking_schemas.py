from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class LocationSchema(BaseModel):
    lat: float
    lng: float

class BookingCreateSchema(BaseModel):
    serviceId: str
    location: LocationSchema
    scheduledAt: Optional[datetime] = None
    notes: Optional[str] = None


class BookingResponseSchema(BaseModel):
    id: str
    userId: str
    serviceId: str
    jobId: Optional[str]
    status: str
    scheduledAt: Optional[datetime]
    location: dict
    notes: Optional[str]
    createdAt: datetime