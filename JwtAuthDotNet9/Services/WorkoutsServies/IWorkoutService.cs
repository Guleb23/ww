using jjj.Models;

namespace jjj.Services.WorkoutsServies
{
    public interface IWorkoutService
    {
        Task<List<WorkoutDto>> GetAllWorkoutsAsync();
        Task<WorkoutDto?> GetWorkoutByIdAsync(Guid id);
        Task<List<WorkoutDto>> GetWorkoutsByUserIdAsync(Guid userId);
        Task<WorkoutDto> CreateWorkoutAsync(CreateWorkoutRequest request);
        Task<WorkoutDto?> UpdateWorkoutAsync(Guid id, UpdateWorkoutRequest request);
        Task<bool> DeleteWorkoutAsync(Guid id);
        Task<List<WorkoutDto>> SearchWorkoutsAsync(string searchTerm);
        Task<bool> WorkoutExistsAsync(Guid id);
        Task<bool> IsWorkoutOwnerAsync(Guid workoutId, Guid userId);
    }
}
