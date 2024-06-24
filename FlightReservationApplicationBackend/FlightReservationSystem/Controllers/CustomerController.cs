// CustomersController.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightReservationSystem.Data;
using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using FlightReservationSystem.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol;

namespace FlightReservationSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomersController : ControllerBase
	{
		private readonly ICustomerService _customerService;
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly FlightContext _context;

		public CustomersController(ICustomerService customerService, IHttpContextAccessor httpContextAccessor,FlightContext context)
		{
			_customerService = customerService;
			_httpContextAccessor = httpContextAccessor;
			_context = context;
		}

		[HttpPost("register")]
		public async Task<IActionResult> RegisterCustomer([FromBody] Register customer)
		{
			try
			{
				if (await _context.Customers.AnyAsync(c => c.Username == customer.Username))
				{
					return BadRequest(new { Success = false, Message = "Customer Username already exists" });
				}

				await _customerService.RegisterCustomer(customer);
				return Ok(new { Success = true, Message = "Customer Registered Successfully" });
			}

			catch (Exception ex)
			{
				Console.WriteLine(ex.Message);
				return StatusCode(500, new { Success = false, Message = "Internal Server Error" });
			}
		}

		[HttpPost("login")]
		public async Task<IActionResult> LoginCustomer([FromBody] Login customer)
		{
			var result = await _customerService.LoginCustomer(customer);

			if (result != null)
			{
				if (_httpContextAccessor.HttpContext != null)
				{
					_httpContextAccessor.HttpContext.Items["CustomerId"] = result.CustomerId;
				}

				return Ok(new { Message = "Admin login successful", CustomerId = result.CustomerId,firstName=result.FirstName,lastName=result.LastName});
			}

			return Unauthorized(new { Message = "Invalid username or password" });
		}

		[HttpPost("logout")]
		[Authorize]
		public IActionResult Logout()
		{
			_customerService.Logout();
			return Ok(new { message = "Logout successful" });
		}

		[HttpGet("{customerId}/details")]
		public async Task<IActionResult> GetCustomerDetails(int customerId)
		{
			var customerDetails = await _customerService.GetCustomerDetails(customerId);

			if (customerDetails != null)
			{
				return Ok(customerDetails);
			}

			return NotFound();
		}

		[HttpPost("{customerId}/book-flight/{flightId}")]
		public async Task<ActionResult> BookFlight(int customerId, int flightId)
		{
			try
			{
				bool isBookingSuccessful = await _customerService.BookFlight(customerId, flightId);

				if (isBookingSuccessful)
				{
					return Ok(new { Message = "Booking successful" });
				}

				return BadRequest(new { ErrorMessage = "Booking failed" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}

		[HttpDelete("{customerId}/cancel-booking/{flightId}")]
		public async Task<ActionResult> CancelBooking(int customerId, int flightId)
		{
			try
			{
				bool isCancellationSuccessful = await _customerService.CancelBooking(customerId, flightId);

				if (isCancellationSuccessful)
				{
					return Ok(new { Message = "Booking canceled successfully" });
				}

				return BadRequest(new { ErrorMessage = "Cancellation failed" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}

		[HttpDelete("{customerId}/cancel-flight/{flightId}")]
		public async Task<ActionResult> CancelFlight(int customerId, int flightId)
		{
			try
			{
				bool isCancellationSuccessful = await _customerService.CancelFlight(flightId);

				if (isCancellationSuccessful)
				{
					return Ok(new { Message = "Flight canceled successfully" });
				}

				return BadRequest(new { ErrorMessage = "Cancellation failed" });
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}

		[HttpGet("all-customers-bookings")]
		public async Task<ActionResult<IEnumerable<CustomerFlight>>> GetAllCustomerBookings()
		{
			try
			{
				var allBookings = await _customerService.GetAllCustomerBookings();
				return Ok(allBookings);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}



		[HttpGet("{customerId}/bookings")]
		public async Task<ActionResult<IEnumerable<CustomerFlight>>> GetCustomerBookings(int customerId)
		{
			try
			{
				var bookings = await _customerService.GetCustomerBookings(customerId);
				return Ok(bookings);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}

		[HttpGet("all-customers-flights")]
		public async Task<ActionResult<IEnumerable<Flight>>> GetAllCustomerFlights()
		{
			try
			{
				var allFlights = await _customerService.GetAllCustomerFlights();
				return Ok(allFlights);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}


		[HttpGet("{customerId}/flights")]
		public async Task<ActionResult<IEnumerable<Flight>>> GetCustomerFlights(int customerId)
		{
			try
			{
				var flights = await _customerService.GetCustomerFlights(customerId);
				return Ok(flights);
			}
			catch (Exception ex)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}
	}
}
