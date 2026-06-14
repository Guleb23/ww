namespace jjj.Models
{
    public class WorkoutExerciseDto
    {
        public Guid Id { get; set; }
        public Guid WorkoutId { get; set; }
        public Guid ExerciseId { get; set; }
        public int Order { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public string? Notes { get; set; }

        public ExerciseDto? Exercise { get; set; }
    }

    public class CreateWorkoutExerciseRequest
    {
        public Guid WorkoutId { get; set; }
        public Guid ExerciseId { get; set; }
        public int Order { get; set; } = 0;
        public int Sets { get; set; } = 3;
        public int Reps { get; set; } = 10;
        public string? Notes { get; set; }
    }

    public class UpdateWorkoutExerciseRequest
    {
        public int Order { get; set; }
        public int Sets { get; set; }
        public int Reps { get; set; }
        public string? Notes { get; set; }
    }

    public class AddExercisesToWorkoutRequest
    {
        public Guid WorkoutId { get; set; }
        public List<Guid> ExerciseIds { get; set; } = new List<Guid>();
        public int DefaultSets { get; set; } = 3;
        public int DefaultReps { get; set; } = 10;
    }
}
