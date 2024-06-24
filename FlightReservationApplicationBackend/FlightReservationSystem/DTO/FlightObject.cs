using System;
using System.ComponentModel.DataAnnotations;

public class FlightObject
{
	[Required(ErrorMessage = "Flight number is required.")]
	public string FlightNumber { get; set; } = null!;

	[Required(ErrorMessage = "Departure city is required.")]
	public string DepartureCity { get; set; } = null!;

	[Required(ErrorMessage = "Arrival city is required.")]
	public string ArrivalCity { get; set; } = null!;

	[Required(ErrorMessage = "Departure time is required.")]
	[DataType(DataType.DateTime)]
	public DateTime DepartureTime { get; set; }

	[Required(ErrorMessage = "Arrival time is required.")]
	[DataType(DataType.DateTime)]
	public DateTime ArrivalTime { get; set; }

	[Required(ErrorMessage = "Total seats is required.")]
	[Range(1, int.MaxValue, ErrorMessage = "Total seats must be at least 1.")]
	public int TotalSeats { get; set; }

	[Required(ErrorMessage = "Available seats is required.")]
	[Range(0, int.MaxValue, ErrorMessage = "Available seats must be at least 0.")]
	public int AvailableSeats { get; set; }

	public int AdminId { get; set; }

	public int StaffId { get; set; }


}
