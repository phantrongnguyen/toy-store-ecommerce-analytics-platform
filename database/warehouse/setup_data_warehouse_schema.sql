use [toy_store_datawarehouse];
go 


select *
from [dbo].[stage];
go 

select *
from [dbo].[dim_time];
go

select * 
from [dbo].[dim_papeview]
go

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_time
FOREIGN KEY ([time_id])
REFERENCES [dbo].[dim_time]([time_id])
GO 

alter table [dbo].[fact]
add constraint fk_product
foreign key ([OLE DB Source.product_id])
references [dbo].[product]([product_id])
go 

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_order
FOREIGN KEY ([OLE DB Source.order_id])
REFERENCES [dbo].[dim_order]([order_id])
GO 

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_papeview
FOREIGN KEY ([OLE DB Source.website_pageview_id])
REFERENCES [dbo].[dim_papeview]([website_pageview_id])
GO 

ALTER TABLE [dbo].[fact]
ADD CONSTRAINT fk_session
FOREIGN KEY ([OLE DB Source.website_session_id])
REFERENCES [dbo].[dim_session]([website_session_id])
GO 

select *
from fact;

select *
from [dbo].[dim_papeview];

