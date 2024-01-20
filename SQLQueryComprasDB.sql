-- Crear la base de datos
CREATE DATABASE ComprasDb;
GO

USE ComprasDb;
GO

-- Crear la tabla DetalleOrdenes
CREATE TABLE [dbo].[DetalleOrdenes](
    [ID] [int] IDENTITY(1,1) NOT NULL,
    [IDOrden] [int] NULL,
    [IDProducto] [int] NULL,
    [Cantidad] [int] NULL,
    [Precio] [float] NULL,
    PRIMARY KEY CLUSTERED 
    (
        [ID] ASC
    ) WITH (
        PAD_INDEX = OFF, 
        STATISTICS_NORECOMPUTE = OFF, 
        IGNORE_DUP_KEY = OFF, 
        ALLOW_ROW_LOCKS = ON, 
        ALLOW_PAGE_LOCKS = ON
    ) ON [PRIMARY]
);

-- Crear la tabla Orden
CREATE TABLE [dbo].[Orden](
    [IDOrden] [int] IDENTITY(1,1) NOT NULL,
    [Fecha] [datetime] NULL,
    [Total] [float] NULL,
    PRIMARY KEY CLUSTERED 
    (
        [IDOrden] ASC
    ) WITH (
        PAD_INDEX = OFF, 
        STATISTICS_NORECOMPUTE = OFF, 
        IGNORE_DUP_KEY = OFF, 
        ALLOW_ROW_LOCKS = ON, 
        ALLOW_PAGE_LOCKS = ON
    ) ON [PRIMARY]
);

-- Establecer la relación entre DetalleOrdenes e Orden
ALTER TABLE [dbo].[DetalleOrdenes]  
WITH CHECK ADD FOREIGN KEY([IDOrden])
REFERENCES [dbo].[Orden] ([IDOrden]);
