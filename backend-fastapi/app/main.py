from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.worker_routes import router as worker_router
from app.routes.admin_routes import router as admin_router

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

from app.routes.service_routes import router as service_router
from app.routes.job_routes import router as job_router

app = FastAPI(title="Blue Collar Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(worker_router)
app.include_router(admin_router)

app.include_router(service_router, prefix="/services", tags=["Services"])
app.include_router(job_router, prefix="/jobs", tags=["Jobs"])

@app.get("/")
def root():
    return {"message": "Server running"}
