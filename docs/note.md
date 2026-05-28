1. Nạp file csv vào SQL Server: https://www.youtube.com/watch?v=4JadZq2PjZQ
2. Cấu trúc thư mục tham khảo: 
```
toy-store-ecommerce-analytics-platform/
│
├── README.md
├── requirements.txt
├── .gitignore
├── .env.example
│
├── data/
│   ├── raw/                    # CSV gốc
│   ├── cleaned/                # Dữ liệu đã làm sạch
│   ├── warehouse/              # Dữ liệu sau ETL / star schema
│   └── ml_dataset/             # Dataset đã join để train ML
│
├── sql/
│   ├── 01_create_database.sql
│   ├── 02_create_raw_tables.sql
│   ├── 03_create_star_schema.sql
│   ├── 04_etl_fact_dim.sql
│   ├── 05_create_ml_feature_view.sql
│   └── 06_dax_measures.md
│
├── warehouse/
│   ├── schema/
│   │   ├── fact_table.sql
│   │   ├── dim_time.sql
│   │   ├── dim_session.sql
│   │   ├── dim_product.sql
│   │   ├── dim_order.sql
│   │   └── dim_pageview.sql
│   │
│   ├── etl/
│   │   ├── load_raw_to_staging.sql
│   │   ├── transform_dimensions.sql
│   │   └── transform_fact.sql
│   │
│   └── docs/
│       ├── star_schema_design.md
│       ├── data_dictionary.md
│       └── erd.png
│
├── analysis/
│   ├── notebooks/
│   │   ├── 01_data_overview.ipynb
│   │   ├── 02_eda_sessions_orders.ipynb
│   │   ├── 03_marketing_channel_analysis.ipynb
│   │   ├── 04_product_analysis.ipynb
│   │   └── 05_customer_behavior_analysis.ipynb
│   │
│   ├── reports/
│   │   ├── eda_report.md
│   │   ├── marketing_analysis_report.md
│   │   └── product_analysis_report.md
│   │
│   └── visuals/
│       ├── revenue_trend.png
│       ├── conversion_rate.png
│       └── top_products.png
│
├── powerbi/
│   ├── dashboard.pbix
│   ├── dax_measures.md
│   ├── screenshots/
│   │   ├── executive_dashboard.png
│   │   ├── marketing_dashboard.png
│   │   └── product_dashboard.png
│   │
│   └── docs/
│       └── dashboard_design.md
│
├── ml/
│   ├── notebooks/
│   │   ├── 01_create_ml_dataset.ipynb
│   │   ├── 02_feature_engineering.ipynb
│   │   ├── 03_baseline_model.ipynb
│   │   ├── 04_random_forest.ipynb
│   │   └── 05_xgboost_model.ipynb
│   │
│   ├── src/
│   │   ├── data_loader.py
│   │   ├── preprocessing.py
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── predict.py
│   │
│   ├── models/
│   │   ├── conversion_model.pkl
│   │   └── encoder.pkl
│   │
│   └── reports/
│       ├── model_evaluation.md
│       └── metrics.csv
│
├── app/
│   ├── main.py                  # FastAPI app
│   ├── api/
│   │   └── routes.py
│   ├── services/
│   │   └── prediction_service.py
│   └── schemas/
│       └── prediction_schema.py
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── docs/
    ├── project_overview.md
    ├── system_architecture.md
    ├── data_pipeline.md
    └── final_report.md
```