namespace drcbackend.Service
{
    public interface ITokenService
    {
        (
        string Token,
        DateTime ExpiresAtUtc
    ) IssueAdminToken();

        bool ValidateAdminToken(
            string? token
        );
    }
}
