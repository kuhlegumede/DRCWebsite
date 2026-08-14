namespace drcbackend.Service
{
    public class AdminAuthService : IAdminAuthService
    {
        private readonly IPasswordHasher _passwordHasher;

        private readonly ITokenService _tokenService;

        private readonly string _adminPasswordHash;

        public AdminAuthService(
            IConfiguration configuration,
            IPasswordHasher passwordHasher,
            ITokenService tokenService)
        {
            _passwordHasher =
                passwordHasher;

            _tokenService =
                tokenService;

            _adminPasswordHash =
                configuration[
                    "Auth:AdminPasswordHash"
                ]
                ?? throw new InvalidOperationException(
                    "Auth:AdminPasswordHash is not configured."
                );

            if (
                string.IsNullOrWhiteSpace(
                    _adminPasswordHash
                )
            )
            {
                throw new InvalidOperationException(
                    "Auth:AdminPasswordHash is empty. Generate a password hash using: dotnet run -- hash-password \"YourPassword\""
                );
            }
        }

        public (
            bool Success,
            string? Token,
            DateTime? ExpiresAtUtc
        ) Login(
            string password)
        {
            if (
                string.IsNullOrWhiteSpace(password)
            )
            {
                return (
                    false,
                    null,
                    null
                );
            }

            var valid =
                _passwordHasher.Verify(
                    password,
                    _adminPasswordHash
                );

            if (!valid)
            {
                return (
                    false,
                    null,
                    null
                );
            }

            var (
                token,
                expiresAtUtc
            ) =
                _tokenService
                    .IssueAdminToken();

            return (
                true,
                token,
                expiresAtUtc
            );
        }

        public bool IsValidToken(
            string? token)
        {
            return _tokenService
                .ValidateAdminToken(token);
        }
    }
}
