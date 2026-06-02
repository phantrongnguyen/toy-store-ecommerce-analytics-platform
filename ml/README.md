# Phân tích các bài toán Machine Learning từ Star Schema

## 1. Tổng quan

Dự án **Toy Store E-Commerce Analytics Platform** xây dựng hệ thống phân tích dữ liệu thương mại điện tử dựa trên mô hình kho dữ liệu dạng **Star Schema**. Dữ liệu được lấy từ các bảng giao dịch như website sessions, pageviews, orders, order items, refunds và products, sau đó được xử lý bằng SSIS để tạo Data Warehouse.

Star Schema hiện tại gồm:

```text
fact
dim_time
dim_session
dim_product
dim_order
dim_papeview
```

Từ mô hình này, có thể xây dựng nhiều bài toán Machine Learning phục vụ phân tích hành vi khách hàng, tối ưu marketing, dự đoán doanh thu và đánh giá rủi ro hoàn tiền.

---

# 2. Bài toán 1: Dự đoán khách hàng có mua hàng hay không

## 2.1. Mô tả bài toán

Bài toán này nhằm dự đoán một phiên truy cập hoặc một lượt xem trang có khả năng tạo ra đơn hàng hay không. Đây là bài toán quan trọng trong thương mại điện tử vì giúp doanh nghiệp đánh giá khả năng chuyển đổi từ truy cập sang mua hàng.

## 2.2. Loại bài toán

```text
Binary Classification
```

## 2.3. Target

```text
has_order
```

Cách tạo biến mục tiêu:

```text
has_order = 1 nếu order_id khác NULL
has_order = 0 nếu order_id NULL
```

## 2.4. Các bảng cần sử dụng

| Bảng         | Mục đích sử dụng                                       |
| ------------ | ------------------------------------------------------ |
| fact         | Lấy order_id, session_id, pageview_id, product_id      |
| dim_session  | Lấy thông tin nguồn truy cập, thiết bị, khách quay lại |
| dim_time     | Lấy thông tin thời gian truy cập                       |
| dim_papeview | Lấy URL trang được xem                                 |
| dim_order    | Kiểm tra thông tin đơn hàng nếu có                     |

## 2.5. Feature đề xuất

| Nhóm feature | Biến                                                |
| ------------ | --------------------------------------------------- |
| Session      | is_repeat_session, device_type                      |
| Marketing    | utm_source, utm_campaign, utm_content, http_referer |
| Pageview     | pageview_url                                        |
| Time         | day, month, quarter, year, weekday                  |
| Behavior     | số pageview trong session                           |

## 2.6. Model phù hợp

```text
Logistic Regression
Decision Tree
Random Forest
XGBoost
LightGBM
```

## 2.7. Metric đánh giá

```text
Accuracy
Precision
Recall
F1-score
ROC-AUC
Confusion Matrix
```

## 2.8. Ý nghĩa kinh doanh

Bài toán giúp doanh nghiệp biết được nhóm khách hàng nào có khả năng mua hàng cao, từ đó tối ưu chiến dịch marketing, cải thiện giao diện website và tăng tỷ lệ chuyển đổi.

---

# 3. Bài toán 2: Dự đoán tỷ lệ chuyển đổi của session

## 3.1. Mô tả bài toán

Bài toán dự đoán xác suất một session chuyển đổi thành đơn hàng. Khác với bài toán phân loại mua hàng, bài toán này tập trung vào xác suất chuyển đổi, giúp đánh giá chất lượng traffic.

## 3.2. Loại bài toán

```text
Binary Classification / Probability Prediction
```

## 3.3. Target

```text
conversion
```

Cách tạo:

```text
conversion = 1 nếu session có ít nhất một order
conversion = 0 nếu session không có order
```

## 3.4. Các bảng cần sử dụng

| Bảng         | Mục đích                               |
| ------------ | -------------------------------------- |
| fact         | Xác định session có đơn hàng hay không |
| dim_session  | Phân tích nguồn truy cập và thiết bị   |
| dim_time     | Phân tích thời gian truy cập           |
| dim_papeview | Phân tích hành vi xem trang            |

## 3.5. Feature đề xuất

```text
utm_source
utm_campaign
utm_content
device_type
http_referer
is_repeat_session
number_of_pageviews
landing_page_url
month
weekday
```

## 3.6. Model phù hợp

```text
Logistic Regression
Random Forest Classifier
XGBoost Classifier
Gradient Boosting Classifier
```

## 3.7. Metric đánh giá

```text
ROC-AUC
Precision
Recall
F1-score
Log Loss
```

## 3.8. Ý nghĩa kinh doanh

Bài toán này giúp đánh giá traffic từ các kênh marketing. Ví dụ, nếu traffic từ `gsearch` có xác suất chuyển đổi cao hơn `bsearch`, doanh nghiệp có thể ưu tiên ngân sách cho kênh hiệu quả hơn.

---

# 4. Bài toán 3: Dự đoán doanh thu theo session

## 4.1. Mô tả bài toán

Bài toán này dự đoán doanh thu mà một session có thể tạo ra. Đây là bài toán hồi quy, phù hợp để đánh giá giá trị kinh tế của từng lượt truy cập.

## 4.2. Loại bài toán

```text
Regression
```

## 4.3. Target

```text
revenue_per_session
```

Cách tạo:

```text
revenue_per_session = tổng price_usd theo website_session_id
```

## 4.4. Các bảng cần sử dụng

| Bảng        | Mục đích                             |
| ----------- | ------------------------------------ |
| fact        | Lấy session_id, order_id, product_id |
| dim_order   | Lấy thông tin đơn hàng               |
| dim_product | Lấy giá bán, giá vốn, sản phẩm       |
| dim_session | Lấy thông tin kênh marketing         |
| dim_time    | Lấy thời gian mua hàng               |

## 4.5. Feature đề xuất

```text
device_type
utm_source
utm_campaign
utm_content
is_repeat_session
primary_product_id
product_name
number_of_pageviews
month
quarter
year
```

## 4.6. Model phù hợp

```text
Linear Regression
Random Forest Regressor
Gradient Boosting Regressor
XGBoost Regressor
```

## 4.7. Metric đánh giá

```text
MAE
MSE
RMSE
R2-score
```

## 4.8. Ý nghĩa kinh doanh

Bài toán giúp doanh nghiệp dự đoán doanh thu kỳ vọng từ từng nhóm khách hàng hoặc từng kênh marketing. Từ đó có thể tối ưu chi phí quảng cáo và tăng doanh thu trên mỗi session.

---

# 5. Bài toán 4: Dự đoán sản phẩm khách hàng có khả năng mua

## 5.1. Mô tả bài toán

Bài toán này dự đoán sản phẩm mà khách hàng có khả năng mua dựa trên hành vi truy cập, nguồn traffic và thông tin session.

## 5.2. Loại bài toán

```text
Multi-class Classification
```

## 5.3. Target

```text
primary_product_id
```

hoặc:

```text
product_name
```

## 5.4. Các bảng cần sử dụng

| Bảng         | Mục đích                           |
| ------------ | ---------------------------------- |
| fact         | Liên kết session, order và product |
| dim_product  | Lấy thông tin sản phẩm             |
| dim_session  | Lấy thông tin nguồn truy cập       |
| dim_papeview | Lấy thông tin trang khách đã xem   |
| dim_time     | Lấy thời điểm truy cập/mua hàng    |

## 5.5. Feature đề xuất

```text
pageview_url
utm_source
utm_campaign
utm_content
device_type
is_repeat_session
month
weekday
number_of_pageviews
```

## 5.6. Model phù hợp

```text
Decision Tree
Random Forest
XGBoost
LightGBM
Naive Bayes
```

## 5.7. Metric đánh giá

```text
Accuracy
Macro F1-score
Weighted F1-score
Precision
Recall
Confusion Matrix
```

## 5.8. Ý nghĩa kinh doanh

Bài toán này có thể dùng để xây dựng hệ thống gợi ý sản phẩm cơ bản, giúp doanh nghiệp cá nhân hóa trải nghiệm mua sắm và tăng khả năng bán chéo sản phẩm.

---

# 6. Bài toán 5: Dự đoán đơn hàng có bị hoàn tiền hay không

## 6.1. Mô tả bài toán

Bài toán này dự đoán khả năng một đơn hàng hoặc một sản phẩm trong đơn hàng bị hoàn tiền. Đây là bài toán quan trọng để đánh giá rủi ro sau bán hàng.

## 6.2. Loại bài toán

```text
Binary Classification
```

## 6.3. Target

```text
is_refunded
```

Cách tạo:

```text
is_refunded = 1 nếu order_item_id có trong bảng refund
is_refunded = 0 nếu không có refund
```

## 6.4. Các bảng cần sử dụng

| Bảng        | Mục đích                                 |
| ----------- | ---------------------------------------- |
| fact        | Lấy order_item_id, order_id, product_id  |
| dim_order   | Lấy thông tin đơn hàng                   |
| dim_product | Lấy thông tin sản phẩm, giá bán, giá vốn |
| dim_session | Lấy nguồn truy cập và thiết bị           |
| dim_time    | Lấy thời điểm mua hàng                   |

## 6.5. Feature đề xuất

```text
product_id
product_name
price_usd
cogs_usd
items_purchased
device_type
utm_source
utm_campaign
is_repeat_session
month
quarter
```

## 6.6. Model phù hợp

```text
Logistic Regression
Decision Tree
Random Forest
XGBoost
```

## 6.7. Metric đánh giá

```text
Precision
Recall
F1-score
ROC-AUC
Confusion Matrix
```

## 6.8. Ý nghĩa kinh doanh

Bài toán giúp doanh nghiệp phát hiện sản phẩm hoặc nhóm đơn hàng có rủi ro hoàn tiền cao. Từ đó có thể cải thiện chất lượng sản phẩm, chính sách bán hàng và chăm sóc khách hàng.

---

# 7. Bài toán 6: Phân cụm khách hàng hoặc session

## 7.1. Mô tả bài toán

Bài toán phân cụm nhằm chia khách hàng hoặc session thành các nhóm có hành vi tương đồng. Đây là bài toán không giám sát, không cần biến mục tiêu.

## 7.2. Loại bài toán

```text
Clustering
```

## 7.3. Target

```text
Không có target
```

## 7.4. Các bảng cần sử dụng

| Bảng        | Mục đích                         |
| ----------- | -------------------------------- |
| fact        | Tổng hợp hành vi mua hàng        |
| dim_session | Thông tin session và traffic     |
| dim_order   | Thông tin đơn hàng               |
| dim_product | Thông tin sản phẩm               |
| dim_time    | Phân tích hành vi theo thời gian |

## 7.5. Feature đề xuất

```text
total_sessions
total_pageviews
total_orders
total_revenue
avg_order_value
conversion_rate
main_device_type
main_utm_source
is_repeat_session_ratio
refund_rate
```

## 7.6. Model phù hợp

```text
K-Means
DBSCAN
Hierarchical Clustering
Gaussian Mixture Model
```

## 7.7. Metric đánh giá

```text
Silhouette Score
Davies-Bouldin Index
Calinski-Harabasz Index
```

## 7.8. Nhóm khách hàng có thể tìm được

```text
Nhóm khách truy cập nhiều nhưng không mua
Nhóm khách mua nhanh
Nhóm khách đến từ quảng cáo trả phí
Nhóm khách quay lại nhiều lần
Nhóm khách có giá trị doanh thu cao
```

## 7.9. Ý nghĩa kinh doanh

Phân cụm giúp doanh nghiệp hiểu rõ các nhóm khách hàng khác nhau, từ đó xây dựng chiến lược marketing, khuyến mãi và chăm sóc khách hàng phù hợp.

---

# 8. Bài toán 7: Dự báo doanh thu theo thời gian

## 8.1. Mô tả bài toán

Bài toán này dự báo doanh thu trong tương lai dựa trên dữ liệu doanh thu lịch sử. Đây là bài toán chuỗi thời gian, phù hợp với dữ liệu thương mại điện tử có yếu tố thời gian rõ ràng.

## 8.2. Loại bài toán

```text
Time Series Forecasting
```

## 8.3. Target

```text
daily_revenue
monthly_revenue
```

## 8.4. Các bảng cần sử dụng

| Bảng        | Mục đích                                      |
| ----------- | --------------------------------------------- |
| fact        | Lấy thông tin order và product                |
| dim_order   | Lấy thông tin đơn hàng                        |
| dim_product | Lấy giá bán                                   |
| dim_time    | Gom nhóm doanh thu theo ngày, tháng, quý, năm |

## 8.5. Feature đề xuất

```text
date
day
month
quarter
year
weekday
daily_orders
daily_sessions
daily_revenue
daily_conversion_rate
```

## 8.6. Model phù hợp

```text
Moving Average
ARIMA
SARIMA
Prophet
Random Forest Regressor
XGBoost Regressor
```

## 8.7. Metric đánh giá

```text
MAE
RMSE
MAPE
R2-score
```

## 8.8. Ý nghĩa kinh doanh

Bài toán giúp doanh nghiệp dự báo doanh thu tương lai, lập kế hoạch tồn kho, ngân sách marketing và đánh giá xu hướng tăng trưởng.

---

# 9. Bài toán 8: Dự báo số lượng đơn hàng theo thời gian

## 9.1. Mô tả bài toán

Bài toán này dự báo số lượng đơn hàng theo ngày, tuần hoặc tháng. Đây là bài toán quan trọng để đánh giá nhu cầu mua hàng trong tương lai.

## 9.2. Loại bài toán

```text
Time Series Forecasting / Regression
```

## 9.3. Target

```text
daily_orders
monthly_orders
```

## 9.4. Các bảng cần sử dụng

| Bảng        | Mục đích                                  |
| ----------- | ----------------------------------------- |
| fact        | Lấy order_id                              |
| dim_order   | Lấy thông tin đơn hàng                    |
| dim_time    | Gom nhóm số lượng đơn hàng theo thời gian |
| dim_session | Có thể dùng để bổ sung số lượng session   |

## 9.5. Feature đề xuất

```text
date
day
month
quarter
year
weekday
daily_sessions
daily_pageviews
daily_conversion_rate
previous_day_orders
previous_week_orders
```

## 9.6. Model phù hợp

```text
ARIMA
SARIMA
Prophet
Random Forest Regressor
XGBoost Regressor
```

## 9.7. Metric đánh giá

```text
MAE
RMSE
MAPE
```

## 9.8. Ý nghĩa kinh doanh

Bài toán giúp dự báo nhu cầu mua hàng, hỗ trợ lập kế hoạch bán hàng, tồn kho và vận hành hệ thống.

---

# 10. Bài toán 9: Đánh giá hiệu quả kênh marketing

## 10.1. Mô tả bài toán

Bài toán này phân loại các kênh marketing theo mức độ hiệu quả dựa trên các chỉ số như số session, tỷ lệ chuyển đổi, doanh thu và số đơn hàng.

## 10.2. Loại bài toán

```text
Multi-class Classification
```

## 10.3. Target

Có thể tạo target như sau:

```text
marketing_performance = High / Medium / Low
```

Dựa trên:

```text
conversion_rate
revenue_per_session
order_volume
refund_rate
```

## 10.4. Các bảng cần sử dụng

| Bảng        | Mục đích                                  |
| ----------- | ----------------------------------------- |
| fact        | Lấy order_id, session_id, revenue         |
| dim_session | Lấy utm_source, utm_campaign, utm_content |
| dim_order   | Lấy thông tin đơn hàng                    |
| dim_product | Lấy doanh thu sản phẩm                    |
| dim_time    | Phân tích hiệu quả theo thời gian         |

## 10.5. Feature đề xuất

```text
utm_source
utm_campaign
utm_content
total_sessions
total_orders
total_revenue
conversion_rate
revenue_per_session
refund_rate
month
quarter
```

## 10.6. Model phù hợp

```text
Decision Tree
Random Forest
XGBoost
Gradient Boosting
```

## 10.7. Metric đánh giá

```text
Accuracy
Precision
Recall
F1-score
Macro F1-score
```

## 10.8. Ý nghĩa kinh doanh

Bài toán giúp doanh nghiệp xác định kênh marketing nào hiệu quả, kênh nào cần tối ưu hoặc cắt giảm ngân sách.

---

# 11. Bài toán 10: Dự đoán giá trị đơn hàng trung bình

## 11.1. Mô tả bài toán

Bài toán này dự đoán giá trị trung bình của đơn hàng dựa trên thông tin sản phẩm, số lượng mua, nguồn truy cập và thời gian mua hàng.

## 11.2. Loại bài toán

```text
Regression
```

## 11.3. Target

```text
average_order_value
```

Cách tạo:

```text
average_order_value = total_revenue / total_orders
```

## 11.4. Các bảng cần sử dụng

| Bảng        | Mục đích                       |
| ----------- | ------------------------------ |
| fact        | Lấy order_id, product_id       |
| dim_order   | Lấy thông tin đơn hàng         |
| dim_product | Lấy giá bán, giá vốn, sản phẩm |
| dim_session | Lấy nguồn truy cập             |
| dim_time    | Lấy thời gian mua hàng         |

## 11.5. Feature đề xuất

```text
items_purchased
product_id
product_name
price_usd
cogs_usd
utm_source
utm_campaign
device_type
is_repeat_session
month
quarter
```

## 11.6. Model phù hợp

```text
Linear Regression
Random Forest Regressor
XGBoost Regressor
Gradient Boosting Regressor
```

## 11.7. Metric đánh giá

```text
MAE
MSE
RMSE
R2-score
```

## 11.8. Ý nghĩa kinh doanh

Bài toán giúp dự đoán giá trị đơn hàng, hỗ trợ chiến lược upsell, cross-sell và tối ưu doanh thu trên mỗi khách hàng.

---

# 12. Bảng tổng hợp các bài toán Machine Learning

| STT | Bài toán                  | Loại bài toán              | Target                | Bảng chính cần dùng                                    |
| --- | ------------------------- | -------------------------- | --------------------- | ------------------------------------------------------ |
| 1   | Dự đoán mua hàng          | Binary Classification      | has_order             | fact, dim_session, dim_time, dim_papeview              |
| 2   | Dự đoán conversion        | Binary Classification      | conversion            | fact, dim_session, dim_time, dim_papeview              |
| 3   | Dự đoán doanh thu/session | Regression                 | revenue_per_session   | fact, dim_order, dim_product, dim_session, dim_time    |
| 4   | Dự đoán sản phẩm mua      | Multi-class Classification | product_name          | fact, dim_product, dim_session, dim_papeview, dim_time |
| 5   | Dự đoán refund            | Binary Classification      | is_refunded           | fact, dim_order, dim_product, dim_session, dim_time    |
| 6   | Phân cụm khách/session    | Clustering                 | Không có              | fact, dim_session, dim_order, dim_product, dim_time    |
| 7   | Dự báo doanh thu          | Time Series                | daily_revenue         | fact, dim_order, dim_product, dim_time                 |
| 8   | Dự báo số đơn hàng        | Time Series                | daily_orders          | fact, dim_order, dim_time, dim_session                 |
| 9   | Đánh giá kênh marketing   | Multi-class Classification | marketing_performance | fact, dim_session, dim_order, dim_product, dim_time    |
| 10  | Dự đoán giá trị đơn hàng  | Regression                 | average_order_value   | fact, dim_order, dim_product, dim_session, dim_time    |

---

# 13. Các bài toán nên ưu tiên thực hiện

Trong phạm vi đồ án đại học, không nên triển khai quá nhiều bài toán cùng lúc. Nên chọn 3 bài toán chính để triển khai hoàn chỉnh:

## 13.1. Bài toán ưu tiên 1: Dự đoán khách hàng có mua hàng hay không

Lý do chọn:

```text
Phù hợp nhất với dữ liệu thương mại điện tử
Dễ tạo target từ order_id
Có ý nghĩa trực tiếp với tỷ lệ chuyển đổi
Dễ đánh giá bằng các metric classification
```

## 13.2. Bài toán ưu tiên 2: Dự đoán doanh thu theo session

Lý do chọn:

```text
Có giá trị kinh doanh cao
Gắn trực tiếp với revenue, order, product
Phù hợp với bài toán regression
Có thể phân tích feature importance
```

## 13.3. Bài toán ưu tiên 3: Dự đoán refund

Lý do chọn:

```text
Tạo thêm hướng phân tích rủi ro
Khai thác được dữ liệu order_item_refunds
Có ý nghĩa trong kiểm soát chất lượng sản phẩm
Phù hợp để so sánh nhiều thuật toán classification
```

---

# 14. Pipeline Machine Learning đề xuất

Quy trình xây dựng Machine Learning từ Star Schema:

```text
Bước 1: Xác định bài toán kinh doanh
Bước 2: Xác định target
Bước 3: Xác định các bảng cần join
Bước 4: Tạo ML dataset từ Star Schema
Bước 5: Làm sạch dữ liệu
Bước 6: Feature Engineering
Bước 7: Encoding biến categorical
Bước 8: Train/Test Split
Bước 9: Huấn luyện model
Bước 10: Đánh giá model
Bước 11: Phân tích feature importance
Bước 12: Trình bày kết quả trong báo cáo hoặc Power BI
```

---

# 15. Kết luận

Star Schema của dự án có thể được sử dụng trực tiếp để xây dựng nhiều bài toán Machine Learning trong thương mại điện tử. Các bảng dimension giúp bổ sung ngữ cảnh cho bảng fact, từ đó tạo ra bộ dữ liệu ML có đầy đủ thông tin về thời gian, sản phẩm, đơn hàng, session, pageview và nguồn marketing.

Trong phạm vi đồ án, nên ưu tiên các bài toán có ý nghĩa rõ ràng, dễ tạo target và có khả năng đánh giá bằng metric cụ thể. Ba bài toán phù hợp nhất là:

```text
Dự đoán khách hàng có mua hàng hay không
Dự đoán doanh thu theo session
Dự đoán đơn hàng có bị hoàn tiền hay không
```

Các bài toán này vừa thể hiện được năng lực khai thác Data Warehouse, vừa kết nối tốt với Data Analytics, Power BI và Machine Learning.
