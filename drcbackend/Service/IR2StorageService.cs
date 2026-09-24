using Microsoft.AspNetCore.Http;

namespace drcbackend.Service
{
    public interface IR2StorageService
    {
        Task<string> UploadAsync(
           IFormFile file,
           string folder);

        Task DeleteAsync(
            string imageUrl);
    }
}
