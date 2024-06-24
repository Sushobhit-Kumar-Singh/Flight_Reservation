using FlightReservationSystem.DTO;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FlightReservationSystem.Model;

	public class Staff
	{

	[Key]
	public int StaffId { get; set; }

	public string FirstName { get; set; } = null!;

	public string LastName { get; set; } = null!;

	public string Position { get; set; } = null!;

	public string Username { get; set; } = null!;

	public string Password { get; set; } = null!;

	public ICollection<Flight> Flights { get; set; } = null!;

}
