using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightReservationSystem.Migrations
{
    /// <inheritdoc />
    public partial class addNewMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "CustomerFlights",
                newName: "CustomerFlightId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CustomerFlightId",
                table: "CustomerFlights",
                newName: "Id");
        }
    }
}
