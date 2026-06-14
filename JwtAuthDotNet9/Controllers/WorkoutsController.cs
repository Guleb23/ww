using jjj.Models;
using jjj.Services.WorkoutsServies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<List<WorkoutDto>>> GetMine()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId is null)
                    return Unauthorized();

                var workouts = await _workoutService.GetWorkoutsByUserIdAsync(userId.Value);
                return Ok(workouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("me/search")]
        public async Task<ActionResult<List<WorkoutDto>>> SearchMine([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                    return BadRequest("Search term is required");

                var userId = GetCurrentUserId();
                if (userId is null)
                    return Unauthorized();

                var workouts = await _workoutService.GetWorkoutsByUserIdAsync(userId.Value);
                var filtered = workouts
                    .Where(w => w.Name.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                                (w.Description?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false))
                    .ToList();

                return Ok(filtered);
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

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<WorkoutDto>> Create(CreateWorkoutRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest("Name is required");

                var userId = GetCurrentUserId();
                if (userId is null)
                    return Unauthorized();

                var workout = await _workoutService.CreateWorkoutAsync(request, userId.Value);
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

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
        }
    }
}
