from fastapi import FastAPI

from app.fastapi_app.app.api.prediction_api import router as prediction_router


app = FastAPI(
    title="Toy Store E-Commerce Prediction API",
    description="API for predicting profit/revenue from e-commerce session data",
    version="1.0.0"
)


app.include_router(
    prediction_router,
    prefix="/api/v1",
    tags=["Prediction"]
)


@app.get("/")
def root():
    return {
        "message": "Toy Store E-Commerce Prediction API is running"
    }