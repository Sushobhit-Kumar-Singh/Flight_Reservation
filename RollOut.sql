USE [FlightReservation]
GO

/****** Object:  Table [dbo].[Admins]    Script Date: 12-01-2024 17:52:18 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Admins](
	[AdminId] [int] IDENTITY(1,1) NOT NULL,
	[Username] [nvarchar](max) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Admins] PRIMARY KEY CLUSTERED 
(
	[AdminId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


CREATE TABLE [dbo].[CustomerFlights](
	[CustomerId] [int] NOT NULL,
	[FlightId] [int] NOT NULL,
	[CustomerFlightId] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [PK_CustomerFlights] PRIMARY KEY CLUSTERED 
(
	[CustomerFlightId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[CustomerFlights]  WITH CHECK ADD  CONSTRAINT [FK_CustomerFlights_Customers_CustomerId] FOREIGN KEY([CustomerId])
REFERENCES [dbo].[Customers] ([CustomerId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[CustomerFlights] CHECK CONSTRAINT [FK_CustomerFlights_Customers_CustomerId]
GO

ALTER TABLE [dbo].[CustomerFlights]  WITH CHECK ADD  CONSTRAINT [FK_CustomerFlights_Flights_FlightId] FOREIGN KEY([FlightId])
REFERENCES [dbo].[Flights] ([FlightId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[CustomerFlights] CHECK CONSTRAINT [FK_CustomerFlights_Flights_FlightId]
GO

CREATE TABLE [dbo].[Flights](
	[FlightId] [int] IDENTITY(1,1) NOT NULL,
	[FlightNumber] [nvarchar](max) NOT NULL,
	[DepartureCity] [nvarchar](max) NOT NULL,
	[ArrivalCity] [nvarchar](max) NOT NULL,
	[DepartureTime] [datetime2](7) NOT NULL,
	[ArrivalTime] [datetime2](7) NOT NULL,
	[TotalSeats] [int] NOT NULL,
	[AvailableSeats] [int] NOT NULL,
	[AdminId] [int] NOT NULL,
	[StaffId] [int] NOT NULL,
 CONSTRAINT [PK_Flights] PRIMARY KEY CLUSTERED 
(
	[FlightId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Flights]  WITH CHECK ADD  CONSTRAINT [FK_Flights_Admins_AdminId] FOREIGN KEY([AdminId])
REFERENCES [dbo].[Admins] ([AdminId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[Flights] CHECK CONSTRAINT [FK_Flights_Admins_AdminId]
GO

ALTER TABLE [dbo].[Flights]  WITH CHECK ADD  CONSTRAINT [FK_Flights_Staffs_StaffId] FOREIGN KEY([StaffId])
REFERENCES [dbo].[Staffs] ([StaffId])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[Flights] CHECK CONSTRAINT [FK_Flights_Staffs_StaffId]
GO

CREATE TABLE [dbo].[Staffs](
	[StaffId] [int] IDENTITY(1,1) NOT NULL,
	[FirstName] [nvarchar](max) NOT NULL,
	[LastName] [nvarchar](max) NOT NULL,
	[Position] [nvarchar](max) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[Username] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_Staffs] PRIMARY KEY CLUSTERED 
(
	[StaffId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Staffs] ADD  DEFAULT (N'') FOR [Password]
GO

ALTER TABLE [dbo].[Staffs] ADD  DEFAULT (N'') FOR [Username]
GO