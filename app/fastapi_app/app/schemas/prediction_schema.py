from pydantic import BaseModel, Field
from typing import Optional


class ProfitPredictionRequest(BaseModel):
    items_purchased: int = Field(..., ge=1)
    product_id: int = Field(..., ge=1)
    product_name: str

    primary_product_id: int = Field(..., ge=1)
    is_primary_item: int = Field(..., ge=0, le=1)

    utm_source: str
    utm_campaign: str
    utm_content: str

    device_type: str
    http_referer: str
    is_repeat_session: int = Field(..., ge=0, le=1)

    year: int = Field(..., ge=2010, le=2030)
    month: int = Field(..., ge=1, le=12)
    day: int = Field(..., ge=1, le=31)
    quater: int = Field(..., ge=1, le=4)
    hour: int = Field(..., ge=0, le=23)

    actual_revenue: Optional[float] = Field(default=None, ge=0)


class ProfitPredictionResponse(BaseModel):
    success: bool
    predicted_revenue: float

    actual_revenue: Optional[float] = None
    absolute_error: Optional[float] = None
    percentage_error: Optional[float] = None
    accuracy: Optional[float] = None