using FlightReservationSystem.Data;
using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FlightReservationSystem.Service;
	public class StaffService:IStaffService
	{
	private readonly FlightContext _context;
	private readonly IHttpContextAccessor _httpContextAccessor;

	public StaffService(FlightContext context,IHttpContextAccessor httpContextAccessor)
	{
		_context = context;
		_httpContextAccessor = httpContextAccessor;
	}

	public async Task<bool> RegisterStaff(Register staff)
	{

		if (await _context.Staffs.AnyAsync(s => s.Username == staff.Username))
		{
			return false;
		}

		string hashedPassword = HashPassword(staff.Password);

		var newStaff = new Staff
		{
			FirstName=staff.FirstName,
			LastName=staff.LastName,
			Position=staff.Position,
			Username = staff.Username,
			Password = hashedPassword
		};

		_context.Staffs.Add(newStaff);
		await _context.SaveChangesAsync();

		return true;
	}

	public async Task<Staff?> LoginStaff(Login newStaff)
	{
		var staff = await _context.Staffs.FirstOrDefaultAsync(s => s.Username == newStaff.Username);

		if (staff != null && VerifyPassword(newStaff.Password, staff.Password))
		{

			if (_httpContextAccessor.HttpContext != null)
			{
				_httpContextAccessor.HttpContext.Items["StaffId"] = staff.StaffId;
			}

			return staff;
		}

		return null;
	}

	public void Logout()
	{
		_httpContextAccessor.HttpContext?.Items.Remove("StaffId");
	}

	public int? GetLoggedInStaffId()
	{
		return _httpContextAccessor.HttpContext?.Items["StaffId"] as int?;
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



}
