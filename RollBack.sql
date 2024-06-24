USE [FlightReservation]
GO

/****** Object:  Table [dbo].[Admins]    Script Date: 12-01-2024 17:55:54 ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Admins]') AND type in (N'U'))
DROP TABLE [dbo].[Admins]
GO


IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[CustomerFlights]') AND type in (N'U'))
DROP TABLE [dbo].[CustomerFlights]
GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Flights]') AND type in (N'U'))
DROP TABLE [dbo].[Flights]
GO

IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Staffs]') AND type in (N'U'))
DROP TABLE [dbo].[Staffs]
GO
