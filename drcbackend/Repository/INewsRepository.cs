using drcbackend.Models;

namespace drcbackend.Repository
{
    public interface INewsRepository
    {
        Task<List<NewsPost>> GetAllAsync();

        Task<NewsPost?> GetByIdAsync(int id);

        Task<NewsPost> CreateAsync(NewsPost news);

        Task DeleteAsync(NewsPost news);
    }
}