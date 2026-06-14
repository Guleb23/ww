using jjj.Models;
using jjj.Services.WorkoutsServies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace jjj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutsController : ControllerBase
    {
        private readonly IWorkoutService _workoutService;

        public WorkoutsController(IWorkoutService workoutService)
        {
            _workoutService = workoutService;
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkoutDto>>> GetAll()
        {
            try
            {
                var workouts = await _workoutService.GetAllWorkoutsAsync();
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<WorkoutDto>> GetById(Guid id)
        {
            try
            {
                var workout = await _workoutService.GetWorkoutByIdAsync(id);
                if (workout == null)
                    return NotFound($"Workout with id {id} not found");

                return Ok(workout);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<WorkoutDto>>> GetByUser(Guid userId)
        {
            try
            {
                var workouts = await _workoutService.GetWorkoutsByUserIdAsync(userId);
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<WorkoutDto>>> Search([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                    return BadRequest("Search term is required");

                var workouts = await _workoutService.SearchWorkoutsAsync(term);
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<WorkoutDto>> Create(CreateWorkoutRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest("Name is required");

                if (request.UserId == Guid.Empty)
                    return BadRequest("UserId is required");

                var workout = await _workoutService.CreateWorkoutAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = workout.Id }, workout);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<WorkoutDto>> Update(Guid id, UpdateWorkoutRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var workoutExists = await _workoutService.WorkoutExistsAsync(id);
                if (!workoutExists)
                    return NotFound($"Workout with id {id} not found");

                var workout = await _workoutService.UpdateWorkoutAsync(id, request);
                return Ok(workout);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            try
            {
                var workoutExists = await _workoutService.WorkoutExistsAsync(id);
                if (!workoutExists)
                    return NotFound($"Workout with id {id} not found");

                await _workoutService.DeleteWorkoutAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}/owner/{userId}")]
        public async Task<ActionResult<bool>> CheckOwner(Guid id, Guid userId)
        {
            try
            {
                var isOwner = await _workoutService.IsWorkoutOwnerAsync(id, userId);
                return Ok(isOwner);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
