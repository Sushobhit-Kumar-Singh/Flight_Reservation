using FlightReservationSystem.Data;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FlightReservationSystem.Service;

	public class FlightService:IFlightService
{
	private readonly FlightContext _context;

	public FlightService(FlightContext context)
	{
		_context = context;
	}

	public async Task AddFlight(FlightObject flight)
	{
		var newFlight = new Flight
		{
			FlightNumber = flight.FlightNumber,
			DepartureCity = flight.DepartureCity,
			ArrivalCity = flight.ArrivalCity,
			DepartureTime = flight.DepartureTime,
			ArrivalTime = flight.ArrivalTime,
			TotalSeats = flight.TotalSeats,
			AvailableSeats = flight.AvailableSeats,
			AdminId = flight.AdminId,
			StaffId = flight.StaffId
		};

		_context.Add(newFlight);
		await _context.SaveChangesAsync();
	}

	public async Task UpdateFlight(int flightId, FlightObject flight)
	{
		var existingFlight = await _context.Flights.FindAsync(flightId);

		if (existingFlight == null)
		{
			return;
		}

		existingFlight.FlightNumber = flight.FlightNumber;
		existingFlight.DepartureCity = flight.DepartureCity;
		existingFlight.ArrivalCity = flight.ArrivalCity;
		existingFlight.DepartureTime = flight.DepartureTime;
		existingFlight.ArrivalTime = flight.ArrivalTime;
		existingFlight.TotalSeats = flight.TotalSeats;
		existingFlight.AvailableSeats = flight.AvailableSeats;
		existingFlight.AdminId = flight.AdminId;
		existingFlight.StaffId = flight.StaffId;

		await _context.SaveChangesAsync();
	}

	public async Task DeleteFlight(int flightId)
	{
		var flight = await _context.Flights.FindAsync(flightId);

		if (flight != null)
		{
			_context.Flights.Remove(flight);
			await _context.SaveChangesAsync();
		}
	}

	public async Task<IEnumerable<Flight>> GetAllFlights()
	{
		return await _context.Flights
			.ToListAsync();
	}

	public async Task<Flight> GetFlightById(int flightId)
	{
		var flight= await _context.Flights.FindAsync(flightId);

		if(flight==null)
		{
			throw new Exception("Flight Not Found");
		}

		return flight;
	}

	public async Task<bool> BookCustomerOnFlight(int customerId, int flightId)
	{
		try
		{
			var flight = await _context.Flights.FindAsync(flightId);

			if (flight != null && flight.AvailableSeats > 0)
			{
				flight.AvailableSeats--;
				await _context.SaveChangesAsync();
				return true;
			}

			return false;
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Error booking customer on flight: {ex.Message}");
			return false;
		}
	}

	public async Task<bool> CancelBooking(int customerId, int flightId)
	{
		try
		{
			var customerFlight = await _context.CustomerFlights
		   .Where(cf => cf.CustomerId == customerId && cf.FlightId == flightId)
		   .OrderBy(cf => cf.CustomerFlightId) 
		   .FirstOrDefaultAsync();

			if (customerFlight != null)
			{
				_context.CustomerFlights.Remove(customerFlight);
				await _context.SaveChangesAsync();
				return true;
			}

			return false;
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Error canceling booking: {ex.Message}");
			return false;
		}
	}

	public async Task<bool> CancelFlight(int flightId)
	{
		try
		{
			var flight = await _context.Flights.FindAsync(flightId);

			if (flight != null)
			{
				flight.AvailableSeats += _context.CustomerFlights.Count(cf => cf.FlightId == flightId);
				_context.CustomerFlights.RemoveRange(_context.CustomerFlights.Where(cf => cf.FlightId == flightId));
				_context.Flights.Remove(flight);

				await _context.SaveChangesAsync();
				return true;
			}

			return false;
		}
		catch (Exception ex)
		{
			Console.WriteLine($"Error canceling flight: {ex.Message}");
			return false;
		}
	}



}
