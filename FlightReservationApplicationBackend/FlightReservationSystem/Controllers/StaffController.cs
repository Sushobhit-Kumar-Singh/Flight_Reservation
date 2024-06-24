using FlightReservationSystem.Data;
using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlightReservationSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class StaffController : ControllerBase
	{
		private readonly IStaffService _staffservice;
		private readonly IFlightService _flightservice;
		private readonly FlightContext _context;
		private readonly IHttpContextAccessor _httpContextAccessor;


		public StaffController(IStaffService staffservice,FlightContext context,IFlightService flightService,IHttpContextAccessor httpContextAccessor)
        {
			_staffservice = staffservice;
			_flightservice = flightService;
			_context = context;
			_httpContextAccessor = httpContextAccessor;
        }

		[HttpPost("register")]
		public async Task<IActionResult> RegisterStaff([FromBody] Register staff)
		{
			try
			{
				if (await _context.Staffs.AnyAsync(s => s.Username == staff.Username))
				{
					return BadRequest(new { Success = false, Message = "Staff Username already exists" });
				}

				await _staffservice.RegisterStaff(staff);
				return Ok(new { Success = true, Message = "Staff Registered Successfully" });
			}
			catch (Exception ex)
			{
				Console.WriteLine(ex);
				return StatusCode(500, new { Success = false, Message = "Internal Server Error" });
			}
		}

		[HttpPost("login")]
		public async Task<IActionResult> Staff([FromBody] Login staff)
		{
			var result = await _staffservice.LoginStaff(staff);

			if (result != null)
			{
				if (_httpContextAccessor.HttpContext != null)
				{
					_httpContextAccessor.HttpContext.Items["StaffId"] = result.StaffId;
				}

				return Ok(new { Message = "Staff login successful", StaffId = result.StaffId });
			}

			return Unauthorized(new { Message = "Invalid username or password" });
		}

		[HttpPost("logout")]
		[Authorize]
		public ActionResult Logout()
		{
			_staffservice.Logout();
			return Ok(new { message = "Logout successful" });
		}	


	}
}
