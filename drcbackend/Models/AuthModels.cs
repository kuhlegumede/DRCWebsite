namespace drcbackend.Models
{
    public class AuthModels
    {
    }
    public class LoginRequest
    {
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAtUtc { get; set; }
    }

    public class CreateEventRequest
    {
        public string Title { get; set; } = string.Empty;

        public string Date { get; set; } = string.Empty;

        public string Time { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }

    public class ApiError
    {
        public string Message { get; set; } = string.Empty;
    }
}
