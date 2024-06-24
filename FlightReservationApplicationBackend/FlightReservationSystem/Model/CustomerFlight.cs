

namespace FlightReservationSystem.Model;
	public class CustomerFlight
	{
	public int CustomerFlightId { get; set; }


	public int CustomerId { get; set; }
	public Customer Customer { get; set; } = null!;

	public int FlightId { get; set; }
	public Flight Flight { get; set; } = null!;
}
