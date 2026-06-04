from fastapi import APIRouter, HTTPException

from app.fastapi_app.app.schemas.prediction_schema import (
    ProfitPredictionRequest,
    ProfitPredictionResponse
)
from app.fastapi_app.app.services.prediction_service import predict_profit


router = APIRouter()


@router.post(
    "/predict/profit",
    response_model=ProfitPredictionResponse
)
def predict_profit_endpoint(data: ProfitPredictionRequest):
    try:
        result = predict_profit(data)
        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )