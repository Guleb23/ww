using jjj.Models;
using jjj.Services.ExerciseServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace jjj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;

        public ExercisesController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ExerciseDto>>> GetAll()
        {
            try
            {
                var exercises = await _exerciseService.GetAllExercisesAsync();
                return Ok(exercises);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExerciseDto>> GetById(Guid id)
        {
            try
            {
                var exercise = await _exerciseService.GetExerciseByIdAsync(id);
                if (exercise == null)
                    return NotFound($"Exercise with id {id} not found");

                return Ok(exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<List<ExerciseDto>>> Search([FromQuery] string term)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(term))
                    return BadRequest("Search term is required");

                var exercises = await _exerciseService.SearchExercisesAsync(term);
                return Ok(exercises);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<ExerciseDto>> Create(CreateExerciseDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest("Name is required");

                if (string.IsNullOrWhiteSpace(request.Description))
                    return BadRequest("Description is required");

                var exercise = await _exerciseService.CreateExerciseAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, exercise);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ExerciseDto>> Update(Guid id, UpdateExerciseDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var exerciseExists = await _exerciseService.ExerciseExistsAsync(id);
                if (!exerciseExists)
                    return NotFound($"Exercise with id {id} not found");

                var exercise = await _exerciseService.UpdateExerciseAsync(id, request);
                return Ok(exercise);
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
                var exerciseExists = await _exerciseService.ExerciseExistsAsync(id);
                if (!exerciseExists)
                    return NotFound($"Exercise with id {id} not found");

                await _exerciseService.DeleteExerciseAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
