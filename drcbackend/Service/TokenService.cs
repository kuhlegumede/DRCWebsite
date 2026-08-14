using System.Security.Cryptography;
using System.Text;

namespace drcbackend.Service
{
    public class TokenService : ITokenService
    {
        private readonly byte[] _signingKey;

        private readonly TimeSpan _tokenLifetime;

        public TokenService(
            IConfiguration configuration)
        {
            var configuredKey =
                configuration["Auth:SigningKey"];

            if (string.IsNullOrWhiteSpace(configuredKey))
            {
                throw new InvalidOperationException(
                    "Auth:SigningKey is not configured."
                );
            }

            if (configuredKey.Length < 32)
            {
                throw new InvalidOperationException(
                    "Auth:SigningKey must contain at least 32 characters."
                );
            }

            _signingKey =
                Encoding.UTF8.GetBytes(
                    configuredKey
                );

            var hours =
                configuration.GetValue<double?>(
                    "Auth:TokenLifetimeHours"
                ) ?? 8;

            if (hours <= 0)
            {
                hours = 8;
            }

            _tokenLifetime =
                TimeSpan.FromHours(hours);
        }

        public (
            string Token,
            DateTime ExpiresAtUtc
        ) IssueAdminToken()
        {
            var expiresAtUtc =
                DateTime.UtcNow.Add(
                    _tokenLifetime
                );

            var payload =
                expiresAtUtc.Ticks.ToString();

            var signature =
                Sign(payload);

            var token =
                $"{payload}.{signature}";

            return (
                token,
                expiresAtUtc
            );
        }

        public bool ValidateAdminToken(
            string? token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                return false;
            }

            var parts =
                token.Split(
                    '.',
                    2
                );

            if (parts.Length != 2)
            {
                return false;
            }

            var payload = parts[0];

            var providedSignature =
                parts[1];

            var expectedSignature =
                Sign(payload);

            try
            {
                var providedBytes =
                    Convert.FromBase64String(
                        providedSignature
                    );

                var expectedBytes =
                    Convert.FromBase64String(
                        expectedSignature
                    );

                if (
                    !CryptographicOperations
                        .FixedTimeEquals(
                            providedBytes,
                            expectedBytes
                        )
                )
                {
                    return false;
                }
            }
            catch
            {
                return false;
            }

            if (
                !long.TryParse(
                    payload,
                    out var expiryTicks
                )
            )
            {
                return false;
            }

            try
            {
                var expiresAtUtc =
                    new DateTime(
                        expiryTicks,
                        DateTimeKind.Utc
                    );

                return expiresAtUtc >
                       DateTime.UtcNow;
            }
            catch
            {
                return false;
            }
        }

        private string Sign(
            string payload)
        {
            using var hmac =
                new HMACSHA256(
                    _signingKey
                );

            var hash =
                hmac.ComputeHash(
                    Encoding.UTF8.GetBytes(
                        payload
                    )
                );

            return Convert.ToBase64String(
                hash
            );
        }
    }
}
