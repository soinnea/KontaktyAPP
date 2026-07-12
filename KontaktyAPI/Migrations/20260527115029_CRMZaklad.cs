using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KontaktyAPI.Migrations
{
    /// <inheritdoc />
    public partial class CRMZaklad : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FirmaId",
                table: "Kontakty",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Pozice",
                table: "Kontakty",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Tagy",
                table: "Kontakty",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Typ",
                table: "Kontakty",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Aktivity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Typ = table.Column<string>(type: "TEXT", nullable: false),
                    Popis = table.Column<string>(type: "TEXT", nullable: false),
                    Datum = table.Column<DateTime>(type: "TEXT", nullable: false),
                    VytvorenoAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    KontaktId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Aktivity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Aktivity_Kontakty_KontaktId",
                        column: x => x.KontaktId,
                        principalTable: "Kontakty",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Firmy",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nazev = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Telefon = table.Column<string>(type: "TEXT", nullable: false),
                    Mesto = table.Column<string>(type: "TEXT", nullable: false),
                    Adresa = table.Column<string>(type: "TEXT", nullable: false),
                    Ico = table.Column<string>(type: "TEXT", nullable: false),
                    Web = table.Column<string>(type: "TEXT", nullable: false),
                    Segment = table.Column<string>(type: "TEXT", nullable: false),
                    Tagy = table.Column<string>(type: "TEXT", nullable: false),
                    VytvorenoAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Firmy", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Schuzky",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Nazev = table.Column<string>(type: "TEXT", nullable: false),
                    Popis = table.Column<string>(type: "TEXT", nullable: false),
                    Datum = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Misto = table.Column<string>(type: "TEXT", nullable: false),
                    Stav = table.Column<string>(type: "TEXT", nullable: false),
                    VytvorenoAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    KontaktId = table.Column<int>(type: "INTEGER", nullable: true),
                    FirmaId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schuzky", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schuzky_Firmy_FirmaId",
                        column: x => x.FirmaId,
                        principalTable: "Firmy",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Schuzky_Kontakty_KontaktId",
                        column: x => x.KontaktId,
                        principalTable: "Kontakty",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Kontakty_FirmaId",
                table: "Kontakty",
                column: "FirmaId");

            migrationBuilder.CreateIndex(
                name: "IX_Aktivity_KontaktId",
                table: "Aktivity",
                column: "KontaktId");

            migrationBuilder.CreateIndex(
                name: "IX_Schuzky_FirmaId",
                table: "Schuzky",
                column: "FirmaId");

            migrationBuilder.CreateIndex(
                name: "IX_Schuzky_KontaktId",
                table: "Schuzky",
                column: "KontaktId");

            migrationBuilder.AddForeignKey(
                name: "FK_Kontakty_Firmy_FirmaId",
                table: "Kontakty",
                column: "FirmaId",
                principalTable: "Firmy",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kontakty_Firmy_FirmaId",
                table: "Kontakty");

            migrationBuilder.DropTable(
                name: "Aktivity");

            migrationBuilder.DropTable(
                name: "Schuzky");

            migrationBuilder.DropTable(
                name: "Firmy");

            migrationBuilder.DropIndex(
                name: "IX_Kontakty_FirmaId",
                table: "Kontakty");

            migrationBuilder.DropColumn(
                name: "FirmaId",
                table: "Kontakty");

            migrationBuilder.DropColumn(
                name: "Pozice",
                table: "Kontakty");

            migrationBuilder.DropColumn(
                name: "Tagy",
                table: "Kontakty");

            migrationBuilder.DropColumn(
                name: "Typ",
                table: "Kontakty");
        }
    }
}
