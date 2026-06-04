import streamlit as st
import pandas as pd
import joblib

from pathlib import Path

MODEL_PATH = (
    Path(__file__).resolve().parent.parent.parent
    / "ml"
    / "models"
    / "profit_prediction_model.pkl"
)


@st.cache_resource
def load_model():
    """Load the trained prediction model."""
    model = joblib.load(MODEL_PATH)
    return model


st.set_page_config(
    page_title="Toy Store Revenue Prediction",
    page_icon="🧸",
    layout="centered"
)

model = load_model()

st.title("🧸 Toy Store E-Commerce Revenue Prediction")
st.write(
    "Predict session revenue based on product, marketing, and time-related features."
)

st.subheader("Enter Session Information")

items_purchased = st.number_input(
    "Items Purchased",
    min_value=1,
    value=1
)

product_id = st.number_input(
    "Product ID",
    min_value=1,
    value=1
)

product_name = st.selectbox(
    "Product Name",
    [
        "The Original Mr. Fuzzy",
        "The Forever Love Bear",
        "The Birthday Sugar Panda",
        "The Hudson River Mini bear"
    ]
)

primary_product_id = st.number_input(
    "Primary Product ID",
    min_value=1,
    value=1
)

is_primary_item = st.selectbox(
    "Is Primary Item",
    [1, 0]
)

utm_source = st.selectbox(
    "UTM Source",
    ["gsearch", "bsearch", "socialbook", "email", "direct", "organic"]
)

utm_campaign = st.selectbox(
    "UTM Campaign",
    ["nonbrand", "brand", "desktop_targeted", "pilot", "none"]
)

utm_content = st.selectbox(
    "UTM Content",
    ["g_ad_1", "g_ad_2", "b_ad_1", "b_ad_2", "none"]
)

device_type = st.selectbox(
    "Device Type",
    ["desktop", "mobile"]
)

http_referer = st.selectbox(
    "HTTP Referrer",
    [
        "https://www.gsearch.com",
        "https://www.bsearch.com",
        "https://www.socialbook.com",
        "none"
    ]
)

is_repeat_session = st.selectbox(
    "Is Repeat Session",
    [0, 1]
)

year = st.number_input(
    "Year",
    min_value=2010,
    max_value=2030,
    value=2013
)

month = st.number_input(
    "Month",
    min_value=1,
    max_value=12,
    value=5
)

day = st.number_input(
    "Day",
    min_value=1,
    max_value=31,
    value=12
)

quarter = st.number_input(
    "Quarter",
    min_value=1,
    max_value=4,
    value=2
)

hour = st.number_input(
    "Hour",
    min_value=0,
    max_value=23,
    value=14
)

if st.button("Predict Revenue", key="predict_btn_1"):

    # Create input DataFrame for model inference
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
            "quater": quarter,
            "hour": hour
        }
    ])

    try:
        # Generate prediction
        prediction = model.predict(sample_input)[0]

        st.success(
            f"Predicted Revenue: ${prediction:,.2f}"
        )

        st.subheader("Input Data")
        st.dataframe(sample_input)

    except Exception as e:
        st.error(
            "Prediction failed. The input features may not match the training pipeline."
        )
        st.exception(e)

actual_revenue = st.number_input(
    "Actual Revenue",
    min_value=0.0,
    value=0.0,
    step=1.0,
    help="Enter actual revenue to calculate prediction error"
)

if st.button("Predict Revenue", key="predict_btn_2"):

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
            "quater": quarter,
            "hour": hour
        }
    ])

    try:
        # Generate prediction
        prediction = model.predict(sample_input)[0]

        st.success(f"Predicted Revenue: ${prediction:,.2f}")

        st.subheader("Input Data")
        st.dataframe(sample_input)

        # Calculate prediction error if actual revenue is provided
        if actual_revenue > 0:
            absolute_error = abs(actual_revenue - prediction)
            percentage_error = (absolute_error / actual_revenue) * 100

            st.subheader("Prediction Error")

            col1, col2, col3 = st.columns(3)

            col1.metric(
                label="Actual Revenue",
                value=f"${actual_revenue:,.2f}"
            )

            col2.metric(
                label="Predicted Revenue",
                value=f"${prediction:,.2f}",
                delta=f"${prediction - actual_revenue:+,.2f}"
            )

            col3.metric(
                label="Absolute Error",
                value=f"${absolute_error:,.2f}"
            )

            accuracy = max(0.0, 100.0 - percentage_error)

            st.subheader("Accuracy")
            st.progress(int(accuracy))

            acol1, acol2 = st.columns(2)
            acol1.metric("Percentage Error", f"{percentage_error:.2f}%")
            acol2.metric("Accuracy", f"{accuracy:.2f}%")

            # Actual vs Predicted comparison chart
            chart_data = pd.DataFrame({
                "Actual": [actual_revenue],
                "Predicted": [prediction]
            })

            st.subheader("Actual vs Predicted Revenue")
            st.bar_chart(chart_data, color=["#ff4b4b", "#21c354"])

            # Error analysis chart
            error_data = pd.DataFrame({
                "Absolute Error ($)": [absolute_error],
                "Accuracy (%)": [accuracy]
            })

            st.subheader("Error Analysis")
            st.bar_chart(error_data, color=["#ff6b6b", "#4ecdc4"])

        else:
            st.info(
                "Enter Actual Revenue greater than 0 to calculate prediction error."
            )

    except Exception as e:
        st.error(
            "Prediction failed. The input features may not match the training pipeline."
        )
        st.exception(e)