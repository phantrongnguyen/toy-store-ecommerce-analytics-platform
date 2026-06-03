import streamlit as st
import pandas as pd
import pickle

from pathlib import Path

MODEL_PATH = Path(__file__).resolve().parent.parent / "ml" / "models" / "profit_prediction_model.pkl"


@st.cache_resource
def load_model():
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    return model


st.set_page_config(
    page_title="Toy Store Revenue Prediction",
    page_icon="🧸",
    layout="centered"
)

model = load_model()

st.title("🧸 Toy Store E-Commerce Revenue Prediction")
st.write("Dự đoán doanh thu theo session dựa trên thông tin sản phẩm, marketing và thời gian.")

st.subheader("Nhập thông tin session")

items_purchased = st.number_input("Items purchased", min_value=1, value=1)
product_id = st.number_input("Product ID", min_value=1, value=1)
product_name = st.selectbox(
    "Product name",
    [
        "The Original Mr. Fuzzy",
        "The Forever Love Bear",
        "The Birthday Sugar Panda",
        "The Hudson River Mini bear"
    ]
)

primary_product_id = st.number_input("Primary product ID", min_value=1, value=1)
is_primary_item = st.selectbox("Is primary item", [1, 0])

utm_source = st.selectbox(
    "UTM source",
    ["gsearch", "bsearch", "socialbook", "email", "direct", "organic"]
)

utm_campaign = st.selectbox(
    "UTM campaign",
    ["nonbrand", "brand", "desktop_targeted", "pilot", "none"]
)

utm_content = st.selectbox(
    "UTM content",
    ["g_ad_1", "g_ad_2", "b_ad_1", "b_ad_2", "none"]
)

device_type = st.selectbox("Device type", ["desktop", "mobile"])

http_referer = st.selectbox(
    "HTTP referer",
    [
        "https://www.gsearch.com",
        "https://www.bsearch.com",
        "https://www.socialbook.com",
        "none"
    ]
)

is_repeat_session = st.selectbox("Is repeat session", [0, 1])

year = st.number_input("Year", min_value=2010, max_value=2030, value=2013)
month = st.number_input("Month", min_value=1, max_value=12, value=5)
day = st.number_input("Day", min_value=1, max_value=31, value=12)
quater = st.number_input("Quarter", min_value=1, max_value=4, value=2)
hour = st.number_input("Hour", min_value=0, max_value=23, value=14)

if st.button("Dự đoán doanh thu"):
    sample_input = pd.DataFrame([
        {
            "items_purchased": items_purchased,
            "product_id": product_id,
            "product_name": product_name,
            "primary_product_id": primary_product_id,
            "is_primary_item": is_primary_item,
            "utm_source": utm_source,
            "utm_campaign": utm_campaign,
            "utm_content": utm_content,
            "device_type": device_type,
            "http_referer": http_referer,
            "is_repeat_session": is_repeat_session,
            "year": year,
            "month": month,
            "day": day,
            "quater": quater,
            "hour": hour
        }
    ])

    try:
        prediction = model.predict(sample_input)[0]

        st.success(f"Doanh thu dự đoán: ${prediction:,.2f}")

        st.subheader("Dữ liệu đầu vào")
        st.dataframe(sample_input)

    except Exception as e:
        st.error("Không thể dự đoán. Có thể input chưa khớp với pipeline/model đã train.")
        st.exception(e)