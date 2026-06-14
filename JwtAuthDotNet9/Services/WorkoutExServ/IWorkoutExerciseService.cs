using jjj.Models;

namespace jjj.Services.WorkoutExServ
{
    public interface IWorkoutExerciseService
    {
        // Основные CRUD операции
        Task<WorkoutExerciseDto?> GetByIdAsync(Guid id);
        Task<WorkoutExerciseDto> CreateAsync(CreateWorkoutExerciseRequest request);
        Task<WorkoutExerciseDto?> UpdateAsync(Guid id, UpdateWorkoutExerciseRequest request);
        Task<bool> DeleteAsync(Guid id);
        Task<bool> ExistsAsync(Guid id);

        // Получение упражнений тренировки
        Task<List<WorkoutExerciseDto>> GetExercisesByWorkoutAsync(Guid workoutId);
        Task<List<ExerciseDto>> GetFullExercisesByWorkoutAsync(Guid workoutId);

        // Получение тренировок упражнения
        Task<List<WorkoutExerciseDto>> GetWorkoutsByExerciseAsync(Guid exerciseId);

        // Проверки
        Task<bool> ExerciseExistsInWorkoutAsync(Guid workoutId, Guid exerciseId);
        Task<bool> IsValidWorkoutExerciseAsync(Guid workoutId, Guid exerciseId);

        // Массовые операции
        Task<int> AddExercisesToWorkoutAsync(AddExercisesToWorkoutRequest request);
        Task<bool> RemoveExerciseFromWorkoutAsync(Guid workoutId, Guid exerciseId);
        Task<bool> UpdateExerciseOrderAsync(Guid id, int newOrder);
        Task<bool> ReorderExercisesAsync(Guid workoutId, List<Guid> exerciseIdsInOrder);
    }
}
