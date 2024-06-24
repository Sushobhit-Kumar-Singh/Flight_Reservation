using FlightReservationSystem.DTO;
using FlightReservationSystem.Model;

namespace FlightReservationSystem.Interface;
public interface IAdminService
	{
	 Task<bool> RegisterAdmin(Register admin);
	 Task<Admin?> LoginAdmin(Login newadmin);
	public int? GetLoggedInAdminId();    
	public void Logout();
}
