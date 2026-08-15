using drcbackend.Models;
using drcbackend.Repository;
using MailKit;
using Microsoft.AspNetCore.Http;
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
        public async Task<IActionResult> SendMessage([FromBody] ContactRequest request)
        {
            if(string.IsNullOrWhiteSpace(request.Name)  ||
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
                Console.WriteLine($"Name: {message.Name}");
                Console.WriteLine($"Email: {message.Email}");

                // Your existing contact logic here

                Console.WriteLine("=== CONTACT REQUEST COMPLETED ===")
                await _emailService.SendContactEmailAsync(request);
                return Ok(new
                {
                    message = "Message sent successfullly."
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("=== CONTACT REQUEST FAILED ===");
                Console.WriteLine(ex.ToString());
                return StatusCode(500, new { message = "Failed to send message." , error = ex.Message});
            }    
        }
    }
}
