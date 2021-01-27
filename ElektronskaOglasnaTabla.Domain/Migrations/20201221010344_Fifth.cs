using Microsoft.EntityFrameworkCore.Migrations;

namespace ElektronskaOglasnaTabla.Domain.Migrations
{
    public partial class Fifth : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Announcements_AnnouncementId",
                table: "Files");

            migrationBuilder.AlterColumn<int>(
                name: "AnnouncementId",
                table: "Files",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Files",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Announcements_AnnouncementId",
                table: "Files",
                column: "AnnouncementId",
                principalTable: "Announcements",
                principalColumn: "AnnouncementId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Announcements_AnnouncementId",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Files");

            migrationBuilder.AlterColumn<int>(
                name: "AnnouncementId",
                table: "Files",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Announcements_AnnouncementId",
                table: "Files",
                column: "AnnouncementId",
                principalTable: "Announcements",
                principalColumn: "AnnouncementId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
