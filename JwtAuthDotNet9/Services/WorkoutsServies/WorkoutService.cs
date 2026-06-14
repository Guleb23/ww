using jjj.Data;
using jjj.Entities;
using jjj.Models;
using Microsoft.EntityFrameworkCore;

namespace jjj.Services.WorkoutsServies
{
    public class WorkoutService : IWorkoutService
    {
        private readonly UserDbContext _context;

        public WorkoutService(UserDbContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutDto>> GetAllWorkoutsAsync()
        {
            var workouts = await _context.Workouts
                .OrderByDescending(w => w.CreatedDate)
                .ToListAsync();

            return workouts.Select(MapToDto).ToList();
        }

        public async Task<WorkoutDto?> GetWorkoutByIdAsync(Guid id)
        {
            var workout = await _context.Workouts.FindAsync(id);
            return workout == null ? null : MapToDto(workout);
        }

        public async Task<List<WorkoutDto>> GetWorkoutsByUserIdAsync(Guid userId)
        {
            var workouts = await _context.Workouts
                .Where(w => w.UserId == userId)
                .OrderByDescending(w => w.CreatedDate)
                .ToListAsync();

            return workouts.Select(MapToDto).ToList();
        }

        public async Task<WorkoutDto> CreateWorkoutAsync(CreateWorkoutRequest request)
        {
            var workout = new Workout
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                UserId = request.UserId,
                CreatedDate = DateTime.UtcNow
            };

            _context.Workouts.Add(workout);
            await _context.SaveChangesAsync();

            return MapToDto(workout);
        }

        public async Task<WorkoutDto?> UpdateWorkoutAsync(Guid id, UpdateWorkoutRequest request)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
                return null;

            workout.Name = request.Name;
            workout.Description = request.Description;
            workout.ImageUrl = request.ImageUrl;

            _context.Workouts.Update(workout);
            await _context.SaveChangesAsync();

            return MapToDto(workout);
        }

        public async Task<bool> DeleteWorkoutAsync(Guid id)
        {
            var workout = await _context.Workouts.FindAsync(id);
            if (workout == null)
                return false;

            _context.Workouts.Remove(workout);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<WorkoutDto>> SearchWorkoutsAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return new List<WorkoutDto>();

            var workouts = await _context.Workouts
                .Where(w => w.Name.Contains(searchTerm) ||
                           (w.Description != null && w.Description.Contains(searchTerm)))
                .OrderByDescending(w => w.CreatedDate)
                .ToListAsync();

            return workouts.Select(MapToDto).ToList();
        }

        public async Task<bool> WorkoutExistsAsync(Guid id)
        {
            return await _context.Workouts.AnyAsync(w => w.Id == id);
        }

        public async Task<bool> IsWorkoutOwnerAsync(Guid workoutId, Guid userId)
        {
            var workout = await _context.Workouts.FindAsync(workoutId);
            return workout != null && workout.UserId == userId;
        }

        private WorkoutDto MapToDto(Workout workout)
        {
            return new WorkoutDto
            {
                Id = workout.Id,
                Name = workout.Name,
                Description = workout.Description,
                ImageUrl = workout.ImageUrl,
                UserId = workout.UserId,
                CreatedDate = workout.CreatedDate
            };
        }
    }
}
