CREATE DATABASE InmobiliariaDB;
GO

USE InmobiliariaDB;
GO

CREATE TABLE Properties (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Price DECIMAL(18,2) NOT NULL,
    City NVARCHAR(100) NULL,
    Address NVARCHAR(255) NULL,
    Rooms INT NULL,
    Bathrooms INT NULL,
    AreaM2 DECIMAL(10,2) NULL,
    ImageUrl NVARCHAR(500) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    WhatsappNumber NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO
CREATE TABLE AdminUsers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);
GO
-- Datos de ejemplo
INSERT INTO Properties
(Title, Description, Price, City, Address, Rooms, Bathrooms, AreaM2, ImageUrl, IsActive, WhatsappNumber)
VALUES
('Apartamento Laureles', 'Apartamento moderno cerca al parque.', 350000000, 'Medellín', 'Calle 35 #70-15', 3, 2, 82, 'https://picsum.photos/600/400', 1, '573001234567'),
('Casa Envigado', 'Casa independiente con patio.', 520000000, 'Envigado', 'Carrera 43 #30-20', 4, 3, 120, 'https://picsum.photos/600/401', 1, '573001234567'),
('Apartaestudio Poblado', 'Ideal para inversión.', 280000000, 'Medellín', 'Calle 10 #38-50', 1, 1, 45, 'https://picsum.photos/600/402', 1, '573001234567');