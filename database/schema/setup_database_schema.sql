USE [toy_store_database];
GO 

-- 1. tao khoa chinh cho [dbo].[order_item_refunds]
SELECT *
FROM [dbo].[order_item_refunds];
GO 

EXEC sp_help '[dbo].[order_item_refunds]';
GO 

--- 1.1. Bước 1: Sửa cột để không cho phép giá trị NULL
ALTER TABLE [dbo].[order_item_refunds]
ALTER COLUMN order_item_refund_id INT NOT NULL;
GO
-- 1.2. Bước 2: Thêm Khóa chính
ALTER TABLE [dbo].[order_item_refunds]
ADD CONSTRAINT pk_order_item_refunds
PRIMARY KEY (order_item_refund_id);
GO 

-- 1.3. Bước 3: Tạo khóa ngoại cho [dbo].[order_item_refunds]
ALTER TABLE [dbo].[order_item_refunds]
ADD CONSTRAINT fk_refunds_order_items
FOREIGN KEY (order_item_id)
REFERENCES order_items(order_item_id);
GO 

-- Thêm khóa ngoại cho cột order_id
ALTER TABLE [dbo].[order_item_refunds]
ADD CONSTRAINT fk_refunds_orders
FOREIGN KEY (order_id)
REFERENCES [dbo].[orders](order_id);
GO

-- Vì khi import data các bảng đã nhầm cho tất cả đều NULL 

-- 2. Tạo khóa chính cho [dbo].[order_items]
SELECT * 
FROM [dbo].[order_items];
GO 

ALTER TABLE [dbo].[order_items]
ALTER COLUMN order_item_id INT NOT NULL;
GO 

ALTER TABLE [dbo].[order_items]
ADD CONSTRAINT pk_order_items
PRIMARY KEY (order_item_id);
GO 

-- 2.1. Tạo khóa ngoại liên kết đến các bảng 
-- Liên kết đến bảng orders
ALTER TABLE [dbo].[order_items]
ADD CONSTRAINT fk_items_orders
FOREIGN KEY (order_id) REFERENCES [dbo].[orders](order_id);

-- Liên kết đến bảng products
ALTER TABLE [dbo].[order_items]
ADD CONSTRAINT fk_items_products
FOREIGN KEY (product_id) REFERENCES [dbo].[products](product_id);

-- 3. Tạo khóa chính cho [dbo].[orders]
SELECT *
FROM [dbo].[orders];
GO 

ALTER TABLE [dbo].[orders]
ALTER COLUMN order_id INT NOT NULL;
GO 

ALTER TABLE [dbo].[orders]
ADD CONSTRAINT pk_order_id
PRIMARY KEY (order_id);
GO 

-- 3.1. Tạo khóa ngoại liên kết đến các bảng 
-- Liên kết đến bảng website_sessions
ALTER TABLE [dbo].[orders]
ADD CONSTRAINT fk_orders_sessions
FOREIGN KEY (website_session_id) REFERENCES [dbo].[website_sessions](website_session_id);

-- 4. Tạo khóa chính cho [dbo].[products]
SELECT *
FROM [dbo].[products];
GO 

ALTER TABLE [dbo].[products]
ALTER COLUMN product_id INT NOT NULL;
GO 

ALTER TABLE [dbo].[products]
ADD CONSTRAINT pk_product_id
PRIMARY KEY (product_id);
GO 

-- 5. Tạo khóa chính cho [dbo].[website_pageviews]
SELECT *
FROM [dbo].[website_pageviews];
GO 

ALTER TABLE [dbo].[website_pageviews]
ALTER COLUMN [website_pageview_id] INT NOT NULL;
GO 

ALTER TABLE [dbo].[website_pageviews]
ADD CONSTRAINT pk_website_pageviews
PRIMARY KEY ([website_pageview_id]);
GO 

-- Liên kết đến bảng website_sessions
ALTER TABLE [dbo].[website_pageviews]
ADD CONSTRAINT fk_pageviews_sessions
FOREIGN KEY (website_session_id) REFERENCES [dbo].[website_sessions](website_session_id);


-- 6. Tạo khóa chính cho [dbo].[website_sessions]
SELECT *
FROM [dbo].[website_sessions];
GO 

ALTER TABLE [dbo].[website_sessions]
ALTER COLUMN [website_session_id] INT NOT NULL;
GO

ALTER TABLE [dbo].[website_sessions]
ADD CONSTRAINT pk_website_sessions
PRIMARY KEY ([website_session_id]);
GO 