using jjj.Data;
using jjj.Entities;
using jjj.Models;
using jjj.Services.ExerciseServices;
using Microsoft.EntityFrameworkCore;

namespace jjj.Services.WorkoutExServ
{
    public class WorkoutExerciseService : IWorkoutExerciseService
    {
        private readonly UserDbContext _context;
        private readonly IExerciseService _exerciseService;

        public WorkoutExerciseService(UserDbContext context, IExerciseService exerciseService)
        {
            _context = context;
            _exerciseService = exerciseService;
        }

        public async Task<WorkoutExerciseDto?> GetByIdAsync(Guid id)
        {
            var workoutExercise = await _context.WorkoutExercises
                .FirstOrDefaultAsync(we => we.Id == id);

            return workoutExercise == null ? null : MapToDto(workoutExercise);
        }

        public async Task<WorkoutExerciseDto> CreateAsync(CreateWorkoutExerciseRequest request)
        {
            // Проверяем, существует ли уже такое упражнение в тренировке
            var exists = await ExerciseExistsInWorkoutAsync(request.WorkoutId, request.ExerciseId);
            if (exists)
                throw new InvalidOperationException("Упражнение уже добавлено в эту тренировку");

            var workoutExercise = new WorkoutExercise
            {
                Id = Guid.NewGuid(),
                WorkoutId = request.WorkoutId,
                ExerciseId = request.ExerciseId,
                Order = request.Order,
                Sets = request.Sets,
                Reps = request.Reps,
                Notes = request.Notes
            };

            _context.WorkoutExercises.Add(workoutExercise);
            await _context.SaveChangesAsync();

            return MapToDto(workoutExercise);
        }

        public async Task<WorkoutExerciseDto?> UpdateAsync(Guid id, UpdateWorkoutExerciseRequest request)
        {
            var workoutExercise = await _context.WorkoutExercises.FindAsync(id);
            if (workoutExercise == null)
                return null;

            workoutExercise.Order = request.Order;
            workoutExercise.Sets = request.Sets;
            workoutExercise.Reps = request.Reps;
            workoutExercise.Notes = request.Notes;

            _context.WorkoutExercises.Update(workoutExercise);
            await _context.SaveChangesAsync();

            return MapToDto(workoutExercise);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var workoutExercise = await _context.WorkoutExercises.FindAsync(id);
            if (workoutExercise == null)
                return false;

            _context.WorkoutExercises.Remove(workoutExercise);
            await _context.SaveChangesAsync();

            // Обновляем порядок оставшихся упражнений
            await ReorderAfterDeletionAsync(workoutExercise.WorkoutId, workoutExercise.Order);

            return true;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await _context.WorkoutExercises.AnyAsync(we => we.Id == id);
        }

        public async Task<List<WorkoutExerciseDto>> GetExercisesByWorkoutAsync(Guid workoutId)
        {
            var workoutExercises = await _context.WorkoutExercises
                .Where(we => we.WorkoutId == workoutId)
                .OrderBy(we => we.Order)
                .ToListAsync();

            return workoutExercises.Select(MapToDto).ToList();
        }

        public async Task<List<ExerciseDto>> GetFullExercisesByWorkoutAsync(Guid workoutId)
        {
            var workoutExercises = await _context.WorkoutExercises
                .Where(we => we.WorkoutId == workoutId)
                .OrderBy(we => we.Order)
                .ToListAsync();

            var result = new List<ExerciseDto>();
            foreach (var we in workoutExercises)
            {
                var exercise = await _exerciseService.GetExerciseByIdAsync(we.ExerciseId);
                if (exercise != null)
                {
                    // Можно добавить параметры из workoutExercise к exercise
                    result.Add(exercise);
                }
            }

            return result;
        }

        public async Task<List<WorkoutExerciseDto>> GetWorkoutsByExerciseAsync(Guid exerciseId)
        {
            var workoutExercises = await _context.WorkoutExercises
                .Where(we => we.ExerciseId == exerciseId)
                .OrderBy(we => we.Order)
                .ToListAsync();

            return workoutExercises.Select(MapToDto).ToList();
        }

        public async Task<bool> ExerciseExistsInWorkoutAsync(Guid workoutId, Guid exerciseId)
        {
            return await _context.WorkoutExercises
                .AnyAsync(we => we.WorkoutId == workoutId && we.ExerciseId == exerciseId);
        }

        public async Task<bool> IsValidWorkoutExerciseAsync(Guid workoutId, Guid exerciseId)
        {
            // Проверяем, существуют ли тренировка и упражнение
            var workoutExists = await _context.Workouts.AnyAsync(w => w.Id == workoutId);
            var exerciseExists = await _context.Exercises.AnyAsync(e => e.Id == exerciseId);

            return workoutExists && exerciseExists;
        }

        public async Task<int> AddExercisesToWorkoutAsync(AddExercisesToWorkoutRequest request)
        {
            if (request.ExerciseIds.Count == 0)
                return 0;

            // Получаем текущий максимальный порядок в тренировке
            var maxOrder = await _context.WorkoutExercises
                .Where(we => we.WorkoutId == request.WorkoutId)
                .MaxAsync(we => (int?)we.Order) ?? -1;

            var addedCount = 0;
            var order = maxOrder + 1;

            foreach (var exerciseId in request.ExerciseIds.Distinct())
            {
                // Проверяем, не добавлено ли уже это упражнение
                var exists = await ExerciseExistsInWorkoutAsync(request.WorkoutId, exerciseId);
                if (!exists)
                {
                    var workoutExercise = new WorkoutExercise
                    {
                        Id = Guid.NewGuid(),
                        WorkoutId = request.WorkoutId,
                        ExerciseId = exerciseId,
                        Order = order++,
                        Sets = request.DefaultSets,
                        Reps = request.DefaultReps
                    };

                    _context.WorkoutExercises.Add(workoutExercise);
                    addedCount++;
                }
            }

            if (addedCount > 0)
                await _context.SaveChangesAsync();

            return addedCount;
        }

        public async Task<bool> RemoveExerciseFromWorkoutAsync(Guid workoutId, Guid exerciseId)
        {
            var workoutExercise = await _context.WorkoutExercises
                .FirstOrDefaultAsync(we => we.WorkoutId == workoutId && we.ExerciseId == exerciseId);

            if (workoutExercise == null)
                return false;

            var order = workoutExercise.Order;
            _context.WorkoutExercises.Remove(workoutExercise);
            await _context.SaveChangesAsync();

            // Обновляем порядок оставшихся упражнений
            await ReorderAfterDeletionAsync(workoutId, order);

            return true;
        }

        public async Task<bool> UpdateExerciseOrderAsync(Guid id, int newOrder)
        {
            var workoutExercise = await _context.WorkoutExercises.FindAsync(id);
            if (workoutExercise == null)
                return false;

            var oldOrder = workoutExercise.Order;
            if (oldOrder == newOrder)
                return true;

            // Сдвигаем другие элементы
            if (newOrder > oldOrder)
            {
                // Перемещаем вниз
                await _context.WorkoutExercises
                    .Where(we => we.WorkoutId == workoutExercise.WorkoutId &&
                               we.Order > oldOrder &&
                               we.Order <= newOrder)
                    .ExecuteUpdateAsync(setters =>
                        setters.SetProperty(we => we.Order, we => we.Order - 1));
            }
            else
            {
                // Перемещаем вверх
                await _context.WorkoutExercises
                    .Where(we => we.WorkoutId == workoutExercise.WorkoutId &&
                               we.Order >= newOrder &&
                               we.Order < oldOrder)
                    .ExecuteUpdateAsync(setters =>
                        setters.SetProperty(we => we.Order, we => we.Order + 1));
            }

            // Обновляем порядок текущего элемента
            workoutExercise.Order = newOrder;
            _context.WorkoutExercises.Update(workoutExercise);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ReorderExercisesAsync(Guid workoutId, List<Guid> exerciseIdsInOrder)
        {
            if (exerciseIdsInOrder.Count == 0)
                return false;

            // Получаем все упражнения тренировки
            var workoutExercises = await _context.WorkoutExercises
                .Where(we => we.WorkoutId == workoutId)
                .ToListAsync();

            // Проверяем, что все ID валидны
            var validIds = workoutExercises.Select(we => we.Id).ToHashSet();
            if (exerciseIdsInOrder.Any(id => !validIds.Contains(id)))
                return false;

            // Обновляем порядок
            for (int i = 0; i < exerciseIdsInOrder.Count; i++)
            {
                var workoutExercise = workoutExercises.First(we => we.Id == exerciseIdsInOrder[i]);
                workoutExercise.Order = i;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        private async Task ReorderAfterDeletionAsync(Guid workoutId, int deletedOrder)
        {
            // Сдвигаем все элементы после удаленного на одну позицию вверх
            await _context.WorkoutExercises
                .Where(we => we.WorkoutId == workoutId && we.Order > deletedOrder)
                .ExecuteUpdateAsync(setters =>
                    setters.SetProperty(we => we.Order, we => we.Order - 1));
        }

        private WorkoutExerciseDto MapToDto(WorkoutExercise workoutExercise)
        {
            return new WorkoutExerciseDto
            {
                Id = workoutExercise.Id,
                WorkoutId = workoutExercise.WorkoutId,
                ExerciseId = workoutExercise.ExerciseId,
                Order = workoutExercise.Order,
                Sets = workoutExercise.Sets,
                Reps = workoutExercise.Reps,
                Notes = workoutExercise.Notes
            };
        }
    }
}
