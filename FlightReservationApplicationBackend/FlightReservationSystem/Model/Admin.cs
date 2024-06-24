using System.ComponentModel.DataAnnotations;

namespace FlightReservationSystem.Model;
	public class Admin
	{

	[Key]
    public int AdminId { get; set; }

	public string Username { get; set; } = null!;

	public string Password { get; set; } = null!;

	public ICollection<Flight>? Flights { get; set; } = null!;

}
