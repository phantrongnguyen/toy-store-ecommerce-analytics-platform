from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from app.fastapi_app.app.api.prediction_api import router as prediction_router


app = FastAPI(
    title="Toy Store E-Commerce Prediction API",
    description="API for predicting profit/revenue from e-commerce session data",
    version="1.0.0"
)

BASE_DIR = Path(__file__).resolve().parent

app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "app" / "static")),
    name="static"
)

templates = Jinja2Templates(directory=str(BASE_DIR / "app" / "templates"))

app.include_router(
    prediction_router,
    prefix="/api/v1",
    tags=["Prediction"]
)


@app.get("/", response_class=HTMLResponse)
def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})