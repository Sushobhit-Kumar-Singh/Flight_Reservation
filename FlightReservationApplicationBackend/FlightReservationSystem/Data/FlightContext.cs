using FlightReservationSystem.Model;
using Microsoft.EntityFrameworkCore;

namespace FlightReservationSystem.Data;
	public class FlightContext:DbContext
	{
	public FlightContext(DbContextOptions<FlightContext> options) : base(options)
	{ }

		public DbSet<Flight> Flights { get; set; }
	    public DbSet<Admin> Admins { get; set; }
	    public DbSet<Customer> Customers { get; set; }
	    public DbSet<Staff> Staffs { get; set; }
	    public DbSet<CustomerFlight> CustomerFlights { get; set; }

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{

		modelBuilder.Entity<CustomerFlight>()
	         .HasIndex(cf => new { cf.CustomerId, cf.FlightId })
	         .IsUnique(false);

		modelBuilder.Entity<CustomerFlight>()
			.HasOne(cf => cf.Customer)
			.WithMany(c => c.CustomerFlights)
			.HasForeignKey(cf => cf.CustomerId);

		modelBuilder.Entity<CustomerFlight>()
			.HasOne(cf => cf.Flight)
			.WithMany(f => f.CustomerFlights)
			.HasForeignKey(cf => cf.FlightId);

		modelBuilder.Entity<Staff>()
				.Property(s => s.Username)
				.IsRequired();

		modelBuilder.Entity<Staff>()
			.Property(s => s.Password)
			.IsRequired();

		modelBuilder.Entity<Customer>()
			   .Property(c => c.Username)
			   .IsRequired();

		modelBuilder.Entity<Customer>()
			.Property(c => c.Password)
			.IsRequired();

		base.OnModelCreating(modelBuilder);
	}
}


