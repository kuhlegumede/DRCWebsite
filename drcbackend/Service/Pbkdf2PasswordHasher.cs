using System.Security.Cryptography;

namespace drcbackend.Service
{
    public class Pbkdf2PasswordHasher : IPasswordHasher
    {
        private const int SaltSizeBytes = 16;

        private const int HashSizeBytes = 32;

        private const int Iterations = 100_000;

        private static readonly HashAlgorithmName Algorithm =
            HashAlgorithmName.SHA256;

        public string Hash(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
            {
                throw new ArgumentException(
                    "Password cannot be empty.",
                    nameof(password)
                );
            }

            var salt =
                RandomNumberGenerator.GetBytes(
                    SaltSizeBytes
                );

            var hash =
                Rfc2898DeriveBytes.Pbkdf2(
                    password,
                    salt,
                    Iterations,
                    Algorithm,
                    HashSizeBytes
                );

            return string.Join(
                ".",
                Iterations,
                Convert.ToBase64String(salt),
                Convert.ToBase64String(hash)
            );
        }

        public bool Verify(
            string password,
            string hashedPassword)
        {
            if (
                string.IsNullOrWhiteSpace(password) ||
                string.IsNullOrWhiteSpace(hashedPassword)
            )
            {
                return false;
            }

            try
            {
                var parts =
                    hashedPassword.Split(
                        '.',
                        3
                    );

                if (parts.Length != 3)
                {
                    return false;
                }

                if (
                    !int.TryParse(
                        parts[0],
                        out var iterations
                    )
                )
                {
                    return false;
                }

                if (iterations <= 0)
                {
                    return false;
                }

                var salt =
                    Convert.FromBase64String(
                        parts[1]
                    );

                var expectedHash =
                    Convert.FromBase64String(
                        parts[2]
                    );

                var actualHash =
                    Rfc2898DeriveBytes.Pbkdf2(
                        password,
                        salt,
                        iterations,
                        Algorithm,
                        expectedHash.Length
                    );

                return CryptographicOperations
                    .FixedTimeEquals(
                        actualHash,
                        expectedHash
                    );
            }
            catch
            {
                return false;
            }
        }
    }
}
