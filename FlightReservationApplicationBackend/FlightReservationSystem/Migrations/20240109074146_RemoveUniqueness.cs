using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightReservationSystem.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUniqueness : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CustomerFlights",
                table: "CustomerFlights");

            migrationBuilder.AddColumn<int>(
                name: "CustomerFlightId",
                table: "CustomerFlights",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CustomerFlights",
                table: "CustomerFlights",
                column: "CustomerFlightId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerFlights_CustomerId_FlightId",
                table: "CustomerFlights",
                columns: new[] { "CustomerId", "FlightId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CustomerFlights",
                table: "CustomerFlights");

            migrationBuilder.DropIndex(
                name: "IX_CustomerFlights_CustomerId_FlightId",
                table: "CustomerFlights");

            migrationBuilder.DropColumn(
                name: "CustomerFlightId",
                table: "CustomerFlights");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CustomerFlights",
                table: "CustomerFlights",
                columns: new[] { "CustomerId", "FlightId" });
        }
    }
}
