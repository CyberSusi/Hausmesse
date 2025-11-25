using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjektHausmesse.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Containers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Position_Latitude = table.Column<decimal>(type: "TEXT", nullable: false),
                    Position_Longitude = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Containers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sensors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ContainerId = table.Column<Guid>(type: "TEXT", nullable: false),
                    HardwareId = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    CurDistance = table.Column<decimal>(type: "TEXT", nullable: true),
                    MaxDistance = table.Column<decimal>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sensors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sensors_Containers_ContainerId",
                        column: x => x.ContainerId,
                        principalTable: "Containers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Measurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SensorId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Distance = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Measurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Measurements_Sensors_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Measurements_SensorId",
                table: "Measurements",
                column: "SensorId");

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_ContainerId",
                table: "Sensors",
                column: "ContainerId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Measurements");

            migrationBuilder.DropTable(
                name: "Sensors");

            migrationBuilder.DropTable(
                name: "Containers");
        }
    }
}
