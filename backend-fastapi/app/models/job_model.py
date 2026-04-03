class Job(BaseModel):
    userId: str
    serviceId: str
    status: str = "PENDING"