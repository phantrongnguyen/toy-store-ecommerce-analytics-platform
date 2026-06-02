use [test];
go

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_time
FOREIGN KEY ([time_id])
REFERENCES [dbo].[dim_time]([time_id])
GO 

alter table [dbo].[fact]
add constraint fk_product
foreign key ([product_id])
references [dbo].[dim_product]([product_id])
go 


ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_order
FOREIGN KEY ([order_id])
REFERENCES [dbo].[dim_order]([order_id])
GO 

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_papeview
FOREIGN KEY ([website_pageview_id])
REFERENCES [dbo].[dim_papeview]([website_pageview_id])
GO 

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_session
FOREIGN KEY ([website_session_id])
REFERENCES [dbo].[dim_session]([website_session_id])
GO