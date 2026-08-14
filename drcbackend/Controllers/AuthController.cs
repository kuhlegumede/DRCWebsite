using drcbackend.Models;
using drcbackend.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace drcbackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAdminAuthService
       _adminAuthService;

        private readonly ILogger<AuthController>
            _logger;

        public AuthController(
            IAdminAuthService adminAuthService,
            ILogger<AuthController> logger)
        {
            _adminAuthService =
                adminAuthService;

            _logger = logger;
        }

        [HttpPost("login")]
        public ActionResult<LoginResponse> Login(
            [FromBody] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest(
                    new ApiError
                    {
                        Message =
                            "Login request is required."
                    }
                );
            }

            var (
                success,
                token,
                expiresAtUtc
            ) =
                _adminAuthService.Login(
                    request.Password
                );

            if (!success)
            {
                _logger.LogWarning(
                    "Failed admin login attempt from {RemoteIp}",
                    HttpContext.Connection
                        .RemoteIpAddress
                );

                return Unauthorized(
                    new ApiError
                    {
                        Message =
                            "Incorrect password."
                    }
                );
            }

            return Ok(
                new LoginResponse
                {
                    Token = token!,
                    ExpiresAtUtc =
                        expiresAtUtc!.Value
                }
            );
        }
    }
}
