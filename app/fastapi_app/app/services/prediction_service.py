import pandas as pd

from app.fastapi_app.app.services.model_service import load_profit_model
from app.fastapi_app.app.schemas.prediction_schema import ProfitPredictionRequest


model = load_profit_model()


FEATURE_COLUMNS = [
    "items_purchased",
    "product_id",
    "product_name",
    "primary_product_id",
    "is_primary_item",
    "utm_source",
    "utm_campaign",
    "utm_content",
    "device_type",
    "http_referer",
    "is_repeat_session",
    "year",
    "month",
    "day",
    "quater",
    "hour"
]


def create_input_dataframe(data: ProfitPredictionRequest) -> pd.DataFrame:
    input_dict = data.model_dump()

    input_dict.pop("actual_revenue", None)

    df = pd.DataFrame([input_dict])
    df = df[FEATURE_COLUMNS]

    return df


def calculate_error_metrics(actual_revenue: float, prediction: float) -> dict:
    absolute_error = abs(actual_revenue - prediction)
    percentage_error = (absolute_error / actual_revenue) * 100
    accuracy = max(0.0, 100.0 - percentage_error)

    return {
        "actual_revenue": round(actual_revenue, 2),
        "absolute_error": round(absolute_error, 2),
        "percentage_error": round(percentage_error, 2),
        "accuracy": round(accuracy, 2)
    }


def predict_profit(data: ProfitPredictionRequest) -> dict:
    df = create_input_dataframe(data)

    prediction = model.predict(df)[0]
    prediction = float(prediction)

    result = {
        "success": True,
        "predicted_revenue": round(prediction, 2)
    }

    if data.actual_revenue is not None and data.actual_revenue > 0:
        error_metrics = calculate_error_metrics(
            actual_revenue=data.actual_revenue,
            prediction=prediction
        )
        result.update(error_metrics)

    return result