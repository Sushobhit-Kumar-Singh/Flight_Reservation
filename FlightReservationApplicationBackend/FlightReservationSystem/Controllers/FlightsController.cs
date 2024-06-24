using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using FlightReservationSystem.Service;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FlightReservationSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class FlightsController : ControllerBase
	{
		private readonly IFlightService _flightservice;
		public readonly IAdminService _adminService;

		public FlightsController(IFlightService flightService, IAdminService adminservice)
		{
			_flightservice = flightService;
			_adminService = adminservice;
		}

		// GET: api/<FlightsController>
		[HttpGet]
		public async Task<ActionResult<IEnumerable<Flight>>> GetAllFlights()
		{
			try
			{
				var flights = await _flightservice.GetAllFlights();
				return Ok(flights);
			}
			catch (Exception)
			{
				return NotFound("Flights not found");
			}
		}

		// GET api/<FlightsController>/5
		[HttpGet("{flightId}")]
		public async Task<ActionResult<Flight>> GetFlightById(int flightId)
		{
			try
			{
				var flight = await _flightservice.GetFlightById(flightId);

				if (flight == null)
				{
					return NotFound();
				}

				return Ok(flight);
			}
			catch (Exception)
			{
				return NotFound("Flight not found");
			}
		}


		[HttpPost("add")]
		public async Task<ActionResult> AddFlight([FromBody] FlightObject flight)
		{
			try
			{
					await _flightservice.AddFlight(flight);
					return Ok(new { Message = "Flight Added Successfully" });
			}
			catch (Exception ex)
			{
				Console.WriteLine($"Error adding new flight: {ex.Message}");
				Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}

		[HttpPut("update/{flightId}")]
		public async Task<ActionResult> UpdateFlight(int flightId, [FromBody] FlightObject flight)
		{
			try
			{

					await _flightservice.UpdateFlight(flightId, flight);

					return Ok(new { Message = "Flight updated successfully." });
			}
			catch (Exception ex)
			{
				Console.WriteLine($"An error occurred while updating flight: {ex.Message}");
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = ex.ToString() });
			}
		}

		[HttpDelete("delete/{flightId}")]
		public async Task<ActionResult> DeleteFlight(int flightId)
		{
			try
			{

					await _flightservice.DeleteFlight(flightId);

					return Ok(new { Message = "Flight deleted successfully." });
			}
			catch (Exception)
			{
				return StatusCode(500, new { ErrorMessage = "Internal server error", ExceptionDetails = "Error Deleting Flight" });
			}
		}

		
	}
}
