namespace jjj.Entities
{
    public class WorkoutExercise
    {
        public Guid Id { get; set; }
        public Guid WorkoutId { get; set; }
        public Guid ExerciseId { get; set; }
        public int Order { get; set; } = 0; 
        public int Sets { get; set; } = 3;
        public int Reps { get; set; } = 10;
        public string? Notes { get; set; }
    }
}
