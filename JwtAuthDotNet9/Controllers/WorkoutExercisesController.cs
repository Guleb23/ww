using jjj.Models;
using jjj.Services.WorkoutExServ;
using Microsoft.AspNetCore.Mvc;

namespace jjj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutExercisesController : ControllerBase
    {
        private readonly IWorkoutExerciseService _workoutExerciseService;

        public WorkoutExercisesController(IWorkoutExerciseService workoutExerciseService)
        {
            _workoutExerciseService = workoutExerciseService;
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<WorkoutExerciseDto>> GetById(Guid id)
        {
            var item = await _workoutExerciseService.GetByIdAsync(id);
            if (item == null)
                return NotFound();

            return Ok(item);
        }

        [HttpGet("by-workout/{workoutId:guid}")]
        public async Task<ActionResult<List<WorkoutExerciseDto>>> GetByWorkout(Guid workoutId)
        {
            var items = await _workoutExerciseService.GetExercisesByWorkoutAsync(workoutId);
            return Ok(items);
        }

        [HttpPost]
        public async Task<ActionResult<WorkoutExerciseDto>> Create(CreateWorkoutExerciseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // базовая валидация существования
            var isValid = await _workoutExerciseService.IsValidWorkoutExerciseAsync(request.WorkoutId, request.ExerciseId);
            if (!isValid)
                return BadRequest("Тренировка или упражнение не найдены.");

            try
            {
                var created = await _workoutExerciseService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<WorkoutExerciseDto>> Update(Guid id, UpdateWorkoutExerciseRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _workoutExerciseService.UpdateAsync(id, request);
            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _workoutExerciseService.DeleteAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpPost("bulk-add")]
        public async Task<ActionResult<int>> BulkAdd(AddExercisesToWorkoutRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var count = await _workoutExerciseService.AddExercisesToWorkoutAsync(request);
            return Ok(count);
        }

        [HttpDelete("{workoutId:guid}/exercise/{exerciseId:guid}")]
        public async Task<IActionResult> RemoveFromWorkout(Guid workoutId, Guid exerciseId)
        {
            var removed = await _workoutExerciseService.RemoveExerciseFromWorkoutAsync(workoutId, exerciseId);
            if (!removed)
                return NotFound();

            return NoContent();
        }
    }
}

