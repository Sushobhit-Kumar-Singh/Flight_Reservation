using System.ComponentModel.DataAnnotations;

namespace FlightReservationSystem.DTO;
public class Register
{
    [Required(ErrorMessage ="First Name is Required")]
    public string FirstName { get; set; } = null!;

	[Required(ErrorMessage = "Last Name is Required")]
	public string LastName { get; set; } = null!;

	[Required(ErrorMessage = "Position is Required")]
	public string Position { get; set; } = null!;

	[EmailAddress(ErrorMessage ="Invalid E Mail Address")]
	[Required(ErrorMessage = "E Mail is Required")]
	public string Email { get; set; } = null!;

    [DataType(DataType.Date)]
	[Required(ErrorMessage = "Birthdate is Required")]
	public DateTime Birthdate { get; set; }

	[Required(ErrorMessage = "Phone No is Required")]
	[RegularExpression(@"^\d{10}$", ErrorMessage = "Please enter a valid 10-digit phone number.")]
	public string PhoneNo { get; set; } = null!;

	[Required(ErrorMessage = "Username is Required")]
	[StringLength(20, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 20 characters.")]
	[RegularExpression(@"^[a-zA-Z0-9_]*$", ErrorMessage = "Only letters, numbers, and underscores are allowed.")]
	public string Username { get; set; } = null!;

	[Required(ErrorMessage = "Password is Required")]
	[StringLength(20, MinimumLength = 8, ErrorMessage = "Password must be between 8 and 20 characters.")]
	[RegularExpression(@"^[a-zA-Z0-9_]*$", ErrorMessage = "Only letters, numbers, and underscores are allowed.")]
	public string Password { get; set; } = null!;
}
