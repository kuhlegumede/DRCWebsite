using drcbackend.Models;
using drcbackend.Repository;
using Microsoft.AspNetCore.Mvc;

namespace drcbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly EmailService _emailService;

        public ContactController(EmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(
            [FromBody] ContactRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    message = "Request body is required."
                });
            }

            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Body))
            {
                return BadRequest(new
                {
                    message = "Name, email and message are required."
                });
            }

            try
            {
                Console.WriteLine("=== CONTACT REQUEST STARTED ===");
                Console.WriteLine($"Name: {request.Name}");
                Console.WriteLine($"Email: {request.Email}");
                Console.WriteLine($"Subject: {request.Subject}");

                await _emailService.SendContactEmailAsync(request);

                Console.WriteLine("=== CONTACT REQUEST COMPLETED ===");

                return Ok(new
                {
                    message = "Message sent successfully."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("=== CONTACT REQUEST FAILED ===");
                Console.WriteLine(ex.ToString());

                return StatusCode(500, new
                {
                    message = "Failed to send message.",
                    error = ex.Message
                });
            }
        }
    }
}
