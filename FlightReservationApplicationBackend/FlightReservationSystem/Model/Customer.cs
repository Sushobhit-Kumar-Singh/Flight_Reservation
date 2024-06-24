using System.ComponentModel.DataAnnotations;

namespace FlightReservationSystem.Model;

	public class Customer
	{

	[Key]
	public int CustomerId { get; set; }

	public string FirstName { get; set; } = null!;

	public string LastName { get; set; } = null!;

	public string Email { get; set; } = null!;

	public DateTime BirthDate { get; set; }

	public string PhoneNo { get; set; } = null!;

	public string Username { get; set; } = null!;

	public string Password { get; set; } = null!;

	public ICollection<CustomerFlight> CustomerFlights { get; set; } = null!;

}
