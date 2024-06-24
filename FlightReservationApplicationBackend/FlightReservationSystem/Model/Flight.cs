using System.ComponentModel.DataAnnotations;

namespace FlightReservationSystem.Model;
	public class Flight
	{
	 [Key]
	 public int FlightId { get; set; }

	 public string FlightNumber { get; set; } = null!;

     public string DepartureCity { get; set; } = null!;

	 public string ArrivalCity { get; set; } = null!;

	 public DateTime DepartureTime { get; set; }

	 public DateTime ArrivalTime { get; set; }

	 public int TotalSeats { get; set; }

	 public int AvailableSeats { get; set; }

	public int AdminId { get; set; }
	public Admin Admin { get; set; } = null!;

	public int StaffId { get; set; }
	public Staff Staff { get; set; } = null!;

	public ICollection<CustomerFlight> CustomerFlights { get; set; } = null!;

}

