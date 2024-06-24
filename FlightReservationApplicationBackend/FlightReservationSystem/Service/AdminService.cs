using FlightReservationSystem.Data;
using FlightReservationSystem.DTO;
using FlightReservationSystem.Interface;
using FlightReservationSystem.Model;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Scripting;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace FlightReservationSystem.Service;
public class AdminService : IAdminService
{
	private readonly FlightContext _context;
	private readonly IHttpContextAccessor _httpContextAccessor;

	public AdminService(FlightContext context, IHttpContextAccessor httpContextAccessor)
	{
		_context = context;
		_httpContextAccessor = httpContextAccessor;
	}

	public async Task<bool> RegisterAdmin(Register admin)
	{
		if (await _context.Admins.AnyAsync(a => a.Username == admin.Username))
		{
			return false;
		}

		string hashedPassword = HashPassword(admin.Password);

		var newAdmin = new Admin
		{
			Username = admin.Username,
			Password = hashedPassword
		};

		_context.Admins.Add(newAdmin);
		await _context.SaveChangesAsync();

		return true;
	}

	public async Task<Admin?> LoginAdmin(Login newadmin)
	{
		var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Username == newadmin.Username);

		if (admin != null && VerifyPassword(newadmin.Password, admin.Password))
		{
			if (_httpContextAccessor.HttpContext != null)
			{
				_httpContextAccessor.HttpContext.Items["AdminId"] = admin.AdminId;
			}

			return admin;
		}

		return null;
	}

	public void Logout()
	{
		_httpContextAccessor.HttpContext?.Items.Remove("AdminId");
	}

	public int? GetLoggedInAdminId()
	{
		return _httpContextAccessor.HttpContext?.Items["AdminId"] as int?;
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
