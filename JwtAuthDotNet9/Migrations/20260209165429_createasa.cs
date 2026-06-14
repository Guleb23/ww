using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace jjj.Migrations
{
    /// <inheritdoc />
    public partial class createasa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "WorkoutExercises",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "WorkoutExercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Reps",
                table: "WorkoutExercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Sets",
                table: "WorkoutExercises",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Notes",
                table: "WorkoutExercises");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "WorkoutExercises");

            migrationBuilder.DropColumn(
                name: "Reps",
                table: "WorkoutExercises");

            migrationBuilder.DropColumn(
                name: "Sets",
                table: "WorkoutExercises");
        }
    }
}
