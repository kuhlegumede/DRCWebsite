using drcbackend.Models;
using drcbackend.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace drcbackend.Filters
{
    public class AdminOnlyAttribute : Attribute, IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(
       ActionExecutingContext context,
       ActionExecutionDelegate next)
        {
            var authService =
                context.HttpContext.RequestServices
                    .GetRequiredService<IAdminAuthService>();

            var authorizationHeader =
                context.HttpContext.Request.Headers.Authorization
                    .ToString();

            string? token = null;

            if (
                authorizationHeader.StartsWith(
                    "Bearer ",
                    StringComparison.OrdinalIgnoreCase
                )
            )
            {
                token = authorizationHeader["Bearer ".Length..].Trim();
            }

            if (!authService.IsValidToken(token))
            {
                context.Result =
                    new UnauthorizedObjectResult(
                        new ApiError
                        {
                            Message =
                                "Admin sign-in required or session expired."
                        }
                    );

                return;
            }

            await next();
        }
    }
}
