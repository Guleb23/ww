using jjj.Models;

namespace jjj.Services.ExerciseServices
{
    public interface IExerciseService
    {
        Task<List<ExerciseDto>> GetAllExercisesAsync();
        Task<ExerciseDto?> GetExerciseByIdAsync(Guid id);
        Task<ExerciseDto> CreateExerciseAsync(CreateExerciseDto request);
        Task<ExerciseDto?> UpdateExerciseAsync(Guid id, UpdateExerciseDto request);
        Task<bool> DeleteExerciseAsync(Guid id);
        Task<List<ExerciseDto>> SearchExercisesAsync(string searchTerm);
        Task<bool> ExerciseExistsAsync(Guid id);
    }
}
