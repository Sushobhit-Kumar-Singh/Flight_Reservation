using FlightReservationSystem.Data;
using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlightReservationSystem.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AdminController : ControllerBase
	{
		private readonly IAdminService _adminservice;
		private readonly FlightContext _context;
		private readonly IHttpContextAccessor _httpContextAccessor;


		public AdminController(IAdminService adminservice, FlightContext context, IHttpContextAccessor httpContextAccessor)
		{
			_adminservice = adminservice;
			_context = context;
			_httpContextAccessor = httpContextAccessor;
		}

		[HttpPost("register")]
		public async Task<IActionResult> RegisterAdmin([FromBody] Register admin)
		{
			try
			{
				if (await _context.Admins.AnyAsync(a => a.Username == admin.Username))
				{
					return BadRequest(new { Success = false, Message = "Admin Username already exists" });
				}

				await _adminservice.RegisterAdmin(admin);
				return Ok(new { Success = true, Message = "Admin Registered Successfully" });
			}

			catch (Exception ex)
			{
				Console.WriteLine(ex);
				return StatusCode(500, new { Success = false, Message = "Internal Server Error" });
			}
		}

		[HttpPost("login")]
		public async Task<IActionResult> LoginAdmin([FromBody] Login admin)
		{
			var result = await _adminservice.LoginAdmin(admin);

			if (result != null)
			{
				if (_httpContextAccessor.HttpContext != null)
				{
					_httpContextAccessor.HttpContext.Items["AdminId"] = result.AdminId;
				}

				return Ok(new { Message = "Admin login successful", AdminId = result.AdminId });
			}

			return Unauthorized(new { Message = "Invalid username or password" });
		}

		[HttpPost("logout")]
		[Authorize]
		public IActionResult Logout()
		{
			_adminservice.Logout();
			return Ok(new { message = "Logout successful" });
		}


	}
}

