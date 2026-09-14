using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace drcbackend.Service
{
    public class AdminAuthenticationHandler
        : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        private readonly IAdminAuthService _adminAuthService;

        public AdminAuthenticationHandler(
            IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            IAdminAuthService adminAuthService)
            : base(options, logger, encoder)
        {
            _adminAuthService = adminAuthService;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var authorizationHeader =
                Request.Headers.Authorization.ToString();

            if (string.IsNullOrWhiteSpace(authorizationHeader))
            {
                return Task.FromResult(
                    AuthenticateResult.NoResult()
                );
            }

            if (!authorizationHeader.StartsWith(
                    "Bearer ",
                    StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult(
                    AuthenticateResult.NoResult()
                );
            }

            var token =
                authorizationHeader["Bearer ".Length..].Trim();

            if (string.IsNullOrWhiteSpace(token))
            {
                return Task.FromResult(
                    AuthenticateResult.NoResult()
                );
            }

            if (!_adminAuthService.IsValidToken(token))
            {
                return Task.FromResult(
                    AuthenticateResult.Fail("Invalid or expired admin token.")
                );
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, "Admin"),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var identity =
                new ClaimsIdentity(
                    claims,
                    Scheme.Name
                );

            var principal =
                new ClaimsPrincipal(identity);

            var ticket =
                new AuthenticationTicket(
                    principal,
                    Scheme.Name
                );

            return Task.FromResult(
                AuthenticateResult.Success(ticket)
            );
        }
    }
}
