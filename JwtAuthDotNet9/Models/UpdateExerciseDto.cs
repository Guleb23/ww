namespace jjj.Models
{
    public class UpdateExerciseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? GifUrl { get; set; }
        public string? Instructions { get; set; }
    }
}
