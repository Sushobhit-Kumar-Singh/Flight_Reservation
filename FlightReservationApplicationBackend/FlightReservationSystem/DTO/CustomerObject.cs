namespace FlightReservationSystem.DTO
{
	public class CustomerObject
	{
		public string FirstName { get; set; } = null!;

		public string LastName { get; set; } = null!;

		public string Email { get; set; } = null!;

		public DateTime BirthDate { get; set; }

		public string PhoneNo { get; set; } = null!;
	}
}
