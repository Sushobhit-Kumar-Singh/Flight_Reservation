using FlightReservationSystem.Model;

namespace FlightReservationSystem.Interface;
	public interface IFlightService
	{
	Task<IEnumerable<Flight>> GetAllFlights();
	Task<Flight> GetFlightById(int flightId);
	Task AddFlight(FlightObject flight);
	Task UpdateFlight(int flightId,FlightObject flight);
	Task DeleteFlight(int flightId);
	Task<bool> BookCustomerOnFlight(int customerId, int flightId);
	Task<bool> CancelBooking(int customerId, int flightId);
	Task<bool> CancelFlight(int flightId);

}
