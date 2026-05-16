from pydantic import BaseModel
from typing import List, Optional

class EmergencyContactSchema(BaseModel):
    name: str
    phone: str

class BankDetailsSchema(BaseModel):
    accountNumber: str
    ifscCode: str
    upiId: Optional[str] = None

class WorkerProfileResponse(BaseModel):
    id: str
    fullName: str
    phone: str
    serviceCategory: Optional[str]
    experienceYears: Optional[int]
    isLive: bool
    status: str

class WorkerApplySchema(BaseModel):
    serviceCategory: str  
    subCategories: List[str] 
    experienceYears: int
    baseRate: float
    serviceRadius: int 
    # Flattened location fields for the frontend to send easily
    latitude: float
    longitude: float
    city: str
    pincode: str
    # Nested objects
    emergencyContact: EmergencyContactSchema
    bankDetails: BankDetailsSchema
    shortBio: str