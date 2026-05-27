# Toy Store E-Commerce Analytics Platform

A **data warehousing and analytics platform** for a fictional toy store e-commerce business ("Maven Fuzzy Factory"). This project ingests raw transactional data, loads it into SQL Server, transforms it into a star-schema data warehouse via SSIS, and performs exploratory data analysis using Python.

## Architecture

```
[CSV Files] ──► [SQL Server OLTP: toy_store_database]
                       │
                       ▼
            [SSIS ETL Packages]
                       │
                       ▼
   [SQL Server Data Warehouse: toy_store_datawarehouse]
        (Star Schema: fact + dimension tables)
                       │
                       ▼
      [Jupyter Notebook (Python)] ──► [EDA / Reports]
```

- **Source Layer**: Raw CSV files from Maven Analytics Data Playground
- **Staging Area**: SQL Server OLTP database (`toy_store_database`)
- **Data Warehouse**: SQL Server star-schema (`toy_store_datawarehouse`)
- **ETL Middleware**: SSIS packages (4 projects)
- **Consumption Layer**: Python/Jupyter notebooks for analysis

## Tech Stack

| Category | Technologies |
|---|---|
| Languages | Python 3.12, T-SQL, XML (SSIS) |
| Database | Microsoft SQL Server 2022 (`LENOVO\SQLEXPRESS`) |
| ETL | SQL Server Integration Services (SSIS) — Visual Studio 2022 |
| Analysis | Jupyter Notebook, pandas, numpy, matplotlib, seaborn |
| Source Data | [Maven Analytics — Toy Store E-Commerce Database](https://mavenanalytics.io/data-playground/toy-store-e-commerce-database) |

## Data Source

Raw data comes from the **Maven Analytics Data Playground**. It contains ~3 years of e-commerce data (Mar 2012 – Apr 2015) for a fictional toy store:

| Dataset | Records | Description |
|---|---|---|
| `website_sessions` | 472,871 | Web traffic with UTM marketing params |
| `website_pageviews` | 1,188,124 | Individual pageview logs |
| `orders` | 32,313 | Order headers |
| `order_items` | 40,025 | Line items per order |
| `order_item_refunds` | 1,731 | Refund records |
| `products` | 4 | Product catalog |

## Data Model

### OLTP — Normalized Schema

```
website_sessions ──┬── website_pageviews
                   │
                   ▼
orders ──┬── order_items ──┬── order_item_refunds
         │                  │
         ▼                  │
    products ───────────────┘
```

### Data Warehouse — Star Schema

```
                    dim_time
                       │
dim_session ──── fact ──── dim_product
                       │
                  dim_order
                       │
                 dim_papeview
```

## Project Structure

```
├── data/
│   ├── raw/              # Source CSV files
│   └── processed/        # Reserved for cleaned data
├── database/
│   ├── schema/           # OLTP database schema (T-SQL)
│   └── warehouse/        # DW schema + SSIS ETL projects
│       ├── etl/                        # Excel → stage (legacy)
│       ├── etl_toy_store/              # OLTP → staging
│       ├── etl_toy_store_dataware_house/  # Staging → DW
│       └── test/                       # Test SSIS package
├── notebooks/
│   ├── 01_information_data.ipynb       # Initial EDA
│   └── ...                             # (more notebooks)
├── reports/
│   ├── dashboard/          # Dashboard placeholder
│   ├── data/schema.png     # Schema diagram
│   └── words/de_cuong.docx # Project outline (Vietnamese)
├── docs/
│   └── note.md             # Reference notes
├── requirements.txt
├── .gitignore
└── LICENSE                 # MIT
```

## Setup

### Prerequisites

- Microsoft SQL Server 2022 (local instance recommended)
- Visual Studio 2022 with SSIS installed
- Python 3.12+
- Git

### 1. Database Setup

```sql
-- Create OLTP database and import CSV data, then run:
database\schema\setup_database_schema.sql

-- Create data warehouse:
database\warehouse\setup_data_warehouse_schema.sql
```

### 2. SSIS ETL

Open the `.dtproj` files in Visual Studio under `database/warehouse/` and execute in order:

1. `etl_toy_store` — merges sessions + pageviews into staging
2. `etl_toy_store_dataware_house` — builds DW dimensions + fact table

### 3. Python Environment

```bash
python -m venv venv
source venv/bin/activate    # Linux/macOS
.\venv\Scripts\Activate.ps1 # Windows
pip install pandas numpy matplotlib seaborn jupyter
```

### 4. Run Notebooks

```bash
jupyter notebook notebooks/
```

## Usage

- **EDA**: Run `notebooks/01_information_data.ipynb` for initial data exploration
- **Marketing Analytics**: Analyze traffic sources, conversion rates, and campaign performance
- **Product Analytics**: Track product-level revenue, refund rates, and order patterns
- **Dashboard**: Extend `reports/dashboard/` with visualization outputs

## Results (Preliminary)

- All datasets are clean — no nulls or duplicates in most tables
- ~83K nulls in `website_sessions.utm_*` fields (expected for direct/organic traffic)
- 4 products, 32K+ orders, 1.1M+ pageviews over ~3 years

## License

MIT License — see [LICENSE](LICENSE). Copyright (c) 2026 Phan Trong Nguyen.
