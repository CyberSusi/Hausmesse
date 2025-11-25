using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjektHausmesse.Server.Data.Migrations;

/// <inheritdoc />
public partial class ContainerIdNullable : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Sensors_Containers_ContainerId",
            table: "Sensors");

        migrationBuilder.AlterColumn<int>(
            name: "ContainerId",
            table: "Sensors",
            type: "INTEGER",
            nullable: true,
            oldClrType: typeof(int),
            oldType: "INTEGER");

        migrationBuilder.AddForeignKey(
            name: "FK_Sensors_Containers_ContainerId",
            table: "Sensors",
            column: "ContainerId",
            principalTable: "Containers",
            principalColumn: "Id");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_Sensors_Containers_ContainerId",
            table: "Sensors");

        migrationBuilder.AlterColumn<int>(
            name: "ContainerId",
            table: "Sensors",
            type: "INTEGER",
            nullable: false,
            defaultValue: 0,
            oldClrType: typeof(int),
            oldType: "INTEGER",
            oldNullable: true);

        migrationBuilder.AddForeignKey(
            name: "FK_Sensors_Containers_ContainerId",
            table: "Sensors",
            column: "ContainerId",
            principalTable: "Containers",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }
}