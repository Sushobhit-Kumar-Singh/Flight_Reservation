using FlightReservationSystem.Data;
using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace FlightReservationSystem.Service
{
	public class CustomerService : ICustomerService
	{
		private readonly IFlightService _flightService;
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly FlightContext _context;

		public CustomerService(IFlightService flightService, FlightContext context,IHttpContextAccessor httpContextAccessor)  
		{
			_flightService = flightService;
			_httpContextAccessor = httpContextAccessor;
			_context = context;  
		}

		public async Task<bool> RegisterCustomer(Register customer)
		{
			if (await _context.Customers.AnyAsync(c => c.Username == customer.Username))
			{
				return false;
			}

			string hashedPassword = HashPassword(customer.Password);

			var newCustomer = new Customer
			{
				FirstName=customer.FirstName,
				LastName=customer.LastName,
				Email=customer.Email,
				BirthDate=customer.Birthdate,
				PhoneNo=customer.PhoneNo,
				Username = customer.Username,
				Password = hashedPassword
			};

			_context.Customers.Add(newCustomer);
			await _context.SaveChangesAsync();

			return true;
		}

		public async Task<Customer?> LoginCustomer(Login newcustomer)
		{
			var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Username == newcustomer.Username);

			if (customer != null && VerifyPassword(newcustomer.Password, customer.Password))
			{
				if (_httpContextAccessor.HttpContext != null)
				{
					_httpContextAccessor.HttpContext.Items["CustomerId"] = customer.CustomerId;
				}

				return customer;
			}

			return null;
		}

		public void Logout()
		{
			_httpContextAccessor.HttpContext?.Items.Remove("CustomerId");
		}

		public int? GetLoggedInCustomerId()
		{
			return _httpContextAccessor.HttpContext?.Items["CustomerId"] as int?;
		}

		private string HashPassword(string password)
		{
			using var sha256 = SHA256.Create();
			var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
			return BitConverter.ToString(hashedBytes).Replace("-", "").ToLower();
		}

		private bool VerifyPassword(string password, string hashedPassword)
		{
			return HashPassword(password) == hashedPassword;
		}

		public async Task<CustomerObject?> GetCustomerDetails(int customerId)
		{
			var customer = await _context.Customers
				.FirstOrDefaultAsync(c => c.CustomerId == customerId);

			if (customer != null)
			{
				return new CustomerObject
				{
					FirstName = customer.FirstName,
					LastName = customer.LastName,
					Email = customer.Email,
					BirthDate = customer.BirthDate,
					PhoneNo = customer.PhoneNo
				};
			}

			return null;
		}

		public async Task<bool> BookFlight(int customerId, int flightId)
		{
			try
			{
				bool isBookingSuccessful = await _flightService.BookCustomerOnFlight(customerId, flightId);

				if (isBookingSuccessful)
				{
					_context.CustomerFlights.Add(new CustomerFlight
					{
						CustomerId = customerId,
						FlightId = flightId
					});

					await _context.SaveChangesAsync();

					return true;
				}

				return false;
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error booking flight: {ex.Message}");
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
				bool isCancellationSuccessful = await _flightService.CancelFlight(flightId);

				if (isCancellationSuccessful)
				{

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


		public async Task<IEnumerable<CustomerFlight>> GetCustomerBookings(int customerId)
		{

			return await _context.CustomerFlights
                       .Where(cf => cf.CustomerId == customerId)
                       .ToListAsync();
		}

		public async Task<IEnumerable<CustomerFlight>> GetAllCustomerBookings()
		{
			return await _context.CustomerFlights.ToListAsync();
		}

		public async Task<IEnumerable<Flight>> GetCustomerFlights(int customerId)
		{
			
				return await _context.Flights
					.Where(f => f.CustomerFlights.Any(cf => cf.CustomerId == customerId))
					.ToListAsync();
		}

		public async Task<IEnumerable<Flight>> GetAllCustomerFlights()
		{
			return await _context.Flights
				.Where(f => f.CustomerFlights.Any())
				.Include(f => f.CustomerFlights)
				.ToListAsync();
		}

	}
}
