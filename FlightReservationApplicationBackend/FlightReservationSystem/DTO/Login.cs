using System.ComponentModel.DataAnnotations;

namespace FlightReservationSystem.DTO;
public class Login
{
	[Required(ErrorMessage = "Username is Required")]
	[StringLength(20,MinimumLength = 3, ErrorMessage = "Username must be between 3 and 20 characters.")]
	[RegularExpression(@"^[a-zA-Z0-9_]*$", ErrorMessage = "Only letters, numbers, and underscores are allowed.")]
	public string Username { get; set; } = null!;

	[Required(ErrorMessage = "Password is Required")]
	[StringLength(20, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 20 characters.")]
	[RegularExpression(@"^[a-zA-Z0-9_]*$", ErrorMessage = "Only letters, numbers, and underscores are allowed.")]
	public string Password { get; set; } = null!;
}
