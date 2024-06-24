using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightReservationSystem.Migrations
{
    /// <inheritdoc />
    public partial class addNewSecondMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomerFlightId",
                table: "CustomerFlights");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CustomerFlightId",
                table: "CustomerFlights",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");
        }
    }
}
