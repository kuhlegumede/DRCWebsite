namespace drcbackend.Service
{
    public interface IAdminAuthService
    {
        (
       bool Success,
       string? Token,
       DateTime? ExpiresAtUtc
   ) Login(
       string password
   );

        bool IsValidToken(
            string? token
        );
    }
}
