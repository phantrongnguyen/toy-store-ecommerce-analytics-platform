from pathlib import Path

import joblib


MODEL_PATH = (
    Path(__file__).resolve().parent.parent.parent.parent.parent
    / "ml"
    / "models"
    / "profit_prediction_model.pkl"
)


def load_profit_model():
    return joblib.load(MODEL_PATH)
