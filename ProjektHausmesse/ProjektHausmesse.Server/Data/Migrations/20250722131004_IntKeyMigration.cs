using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ProjektHausmesse.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class IntKeyMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                DELETE FROM Measurements;
                DELETE FROM Sensors;
                DELETE FROM Containers;
                """
            );

            migrationBuilder.AlterColumn<int>(
                name: "ContainerId",
                table: "Sensors",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT"
            );

            migrationBuilder
                .AlterColumn<int>(
                    name: "Id",
                    table: "Sensors",
                    type: "INTEGER",
                    nullable: false,
                    oldClrType: typeof(Guid),
                    oldType: "TEXT"
                )
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<int>(
                name: "SensorId",
                table: "Measurements",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "TEXT"
            );

            migrationBuilder
                .AlterColumn<int>(
                    name: "Id",
                    table: "Measurements",
                    type: "INTEGER",
                    nullable: false,
                    oldClrType: typeof(Guid),
                    oldType: "TEXT"
                )
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder
                .AlterColumn<int>(
                    name: "Id",
                    table: "Containers",
                    type: "INTEGER",
                    nullable: false,
                    oldClrType: typeof(Guid),
                    oldType: "TEXT"
                )
                .Annotation("Sqlite:Autoincrement", true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<Guid>(
                name: "ContainerId",
                table: "Sensors",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER"
            );

            migrationBuilder
                .AlterColumn<Guid>(
                    name: "Id",
                    table: "Sensors",
                    type: "TEXT",
                    nullable: false,
                    oldClrType: typeof(int),
                    oldType: "INTEGER"
                )
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AlterColumn<Guid>(
                name: "SensorId",
                table: "Measurements",
                type: "TEXT",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER"
            );

            migrationBuilder
                .AlterColumn<Guid>(
                    name: "Id",
                    table: "Measurements",
                    type: "TEXT",
                    nullable: false,
                    oldClrType: typeof(int),
                    oldType: "INTEGER"
                )
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder
                .AlterColumn<Guid>(
                    name: "Id",
                    table: "Containers",
                    type: "TEXT",
                    nullable: false,
                    oldClrType: typeof(int),
                    oldType: "INTEGER"
                )
                .OldAnnotation("Sqlite:Autoincrement", true);
        }
    }
}
