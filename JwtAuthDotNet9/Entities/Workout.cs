namespace jjj.Entities
{
    public class Workout
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? ImageUrl { get; set; }
        public Guid UserId { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
