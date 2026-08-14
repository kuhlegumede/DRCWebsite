using drcbackend.Filters;
using drcbackend.Models;
using drcbackend.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace drcbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventsController : ControllerBase
    {
        private readonly IEventRepository
        _repository;

        private readonly ILogger<EventsController>
            _logger;

        public EventsController(
            IEventRepository repository,
            ILogger<EventsController> logger)
        {
            _repository = repository;

            _logger = logger;
        }

        [HttpGet]
        public async Task<
            ActionResult<IReadOnlyList<EventItem>>
        > GetAll()
        {
            var events =
                await _repository.GetAllAsync();

            return Ok(events);
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<EventItem>> GetById(
            int id)
        {
            var eventItem =
                await _repository.GetByIdAsync(id);

            if (eventItem == null)
            {
                return NotFound(
                    new ApiError
                    {
                        Message =
                            "Event not found."
                    }
                );
            }

            return Ok(eventItem);
        }


        [HttpPost]
        [AdminOnly]
        public async Task<ActionResult<EventItem>> Create(
            [FromBody] CreateEventRequest request)
        {
            if (request == null)
            {
                return BadRequest(
                    new ApiError
                    {
                        Message =
                            "Event data is required."
                    }
                );
            }

            if (
                string.IsNullOrWhiteSpace(
                    request.Title
                )
            )
            {
                return BadRequest(
                    new ApiError
                    {
                        Message =
                            "Event title is required."
                    }
                );
            }

            if (
                string.IsNullOrWhiteSpace(
                    request.Date
                )
            )
            {
                return BadRequest(
                    new ApiError
                    {
                        Message =
                            "Event date is required."
                    }
                );
            }

            var newEvent =
                new EventItem
                {
                    Title =
                        request.Title.Trim(),

                    Date =
                        request.Date.Trim(),

                    Time =
                        request.Time?.Trim()
                        ?? string.Empty,

                    Location =
                        request.Location?.Trim()
                        ?? string.Empty,

                    Description =
                        request.Description?.Trim()
                        ?? string.Empty,

                    CreatedAtUtc =
                        DateTime.UtcNow
                };

            var created =
                await _repository.AddAsync(
                    newEvent
                );

            _logger.LogInformation(
                "Admin created event {EventId}: {Title}",
                created.Id,
                created.Title
            );

            return CreatedAtAction(
                nameof(GetById),
                new
                {
                    id = created.Id
                },
                created
            );
        }


        [HttpDelete("{id:int}")]
        [AdminOnly]
        public async Task<IActionResult> Delete(
            int id)
        {
            var deleted =
                await _repository.DeleteAsync(
                    id
                );

            if (!deleted)
            {
                return NotFound(
                    new ApiError
                    {
                        Message =
                            "Event not found."
                    }
                );
            }

            _logger.LogInformation(
                "Admin deleted event {EventId}",
                id
            );

            return NoContent();
        }
    }
}
