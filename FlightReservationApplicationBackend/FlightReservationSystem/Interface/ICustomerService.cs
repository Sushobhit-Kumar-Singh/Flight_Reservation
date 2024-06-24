using FlightReservationSystem.DTO;
using FlightReservationSystem.Model;

namespace FlightReservationSystem.Interface
{
	public interface ICustomerService
	{
		Task<bool> RegisterCustomer(Register customer);
		Task<Customer?> LoginCustomer(Login newcustomer);
		public int? GetLoggedInCustomerId();
		public void Logout();
		Task<CustomerObject?> GetCustomerDetails(int customerId);
		Task<bool> BookFlight(int customerId, int flightId);
		Task<bool> CancelBooking(int customerId, int flightId);
		Task<bool> CancelFlight(int flightId);
		Task<IEnumerable<CustomerFlight>> GetCustomerBookings(int customerId);
		Task<IEnumerable<CustomerFlight>> GetAllCustomerBookings();
		Task<IEnumerable<Flight>> GetCustomerFlights(int customerId);
		Task<IEnumerable<Flight>> GetAllCustomerFlights();
	}
}
