from fastapi import FastAPI
from app.routes.auth_routes import router as auth_router
from app.routes.user_routes import router as user_router
from app.routes.worker_routes import router as worker_router

from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="Blue Collar Platform API")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(worker_router)


@app.get("/")
def root():
    return {"message": "Server running"}
