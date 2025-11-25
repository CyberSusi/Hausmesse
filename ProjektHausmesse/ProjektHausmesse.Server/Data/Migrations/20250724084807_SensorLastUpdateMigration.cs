using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjektHausmesse.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class SensorLastUpdateMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastUpdate",
                table: "Sensors",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastUpdate",
                table: "Sensors");
        }
    }
}
