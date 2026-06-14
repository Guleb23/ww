using jjj.Data;
using jjj.Entities;
using jjj.Models;
using jjj.Services.ExerciseServices;
using Microsoft.EntityFrameworkCore;

namespace jjj.Services.ExerciseServiceS
{
    public class ExerciseService : IExerciseService
    {
        private readonly UserDbContext _context;

        public ExerciseService(UserDbContext context)
        {
            _context = context;
        }

        public async Task<List<ExerciseDto>> GetAllExercisesAsync()
        {
            var exercises = await _context.Exercises
                .OrderBy(e => e.Name)
                .ToListAsync();

            return exercises.Select(MapToDto).ToList();
        }

        public async Task<ExerciseDto?> GetExerciseByIdAsync(Guid id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            return exercise == null ? null : MapToDto(exercise);
        }

        public async Task<ExerciseDto> CreateExerciseAsync(CreateExerciseDto request)
        {
            var exercise = new Exercise
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                ImageUrl = request.ImageUrl,
                GifUrl = request.GifUrl,
                Instructions = request.Instructions
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            return MapToDto(exercise);
        }

        public async Task<ExerciseDto?> UpdateExerciseAsync(Guid id, UpdateExerciseDto request)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return null;

            exercise.Name = request.Name;
            exercise.Description = request.Description;
            exercise.ImageUrl = request.ImageUrl;
            exercise.GifUrl = request.GifUrl;
            exercise.Instructions = request.Instructions;

            _context.Exercises.Update(exercise);
            await _context.SaveChangesAsync();

            return MapToDto(exercise);
        }

        public async Task<bool> DeleteExerciseAsync(Guid id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return false;

            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<ExerciseDto>> SearchExercisesAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return new List<ExerciseDto>();

            var exercises = await _context.Exercises
                .Where(e => e.Name.Contains(searchTerm) ||
                           e.Description.Contains(searchTerm) ||
                           (e.Instructions != null && e.Instructions.Contains(searchTerm)))
                .OrderBy(e => e.Name)
                .ToListAsync();

            return exercises.Select(MapToDto).ToList();
        }

        public async Task<bool> ExerciseExistsAsync(Guid id)
        {
            return await _context.Exercises.AnyAsync(e => e.Id == id);
        }

        private ExerciseDto MapToDto(Exercise exercise)
        {
            return new ExerciseDto
            {
                Id = exercise.Id,
                Name = exercise.Name,
                Description = exercise.Description,
                ImageUrl = exercise.ImageUrl,
                GifUrl = exercise.GifUrl,
                Instructions = exercise.Instructions
            };
        }
    }
}
