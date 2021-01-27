using Microsoft.EntityFrameworkCore.Migrations;

namespace ElektronskaOglasnaTabla.Domain.Migrations
{
    public partial class Second : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_AspNetUsers_UserCreatedId",
                table: "Announcements");

            migrationBuilder.AlterColumn<string>(
                name: "UserCreatedId",
                table: "Announcements",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_AspNetUsers_UserCreatedId",
                table: "Announcements",
                column: "UserCreatedId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_AspNetUsers_UserCreatedId",
                table: "Announcements");

            migrationBuilder.AlterColumn<string>(
                name: "UserCreatedId",
                table: "Announcements",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_AspNetUsers_UserCreatedId",
                table: "Announcements",
                column: "UserCreatedId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
