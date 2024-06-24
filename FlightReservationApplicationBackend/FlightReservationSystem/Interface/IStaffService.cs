using FlightReservationSystem.DTO;
using FlightReservationSystem.Model;

namespace FlightReservationSystem.Interface;
	public interface IStaffService
	{
	Task<bool> RegisterStaff(Register staff);
	Task<Staff?> LoginStaff(Login newstaff);
	public int? GetLoggedInStaffId();
	public void Logout();
}
