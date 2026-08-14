using drcbackend.Models;

namespace drcbackend.Repository
{
    public interface IEventRepository
    {
        Task<IReadOnlyList<EventItem>> GetAllAsync();
        Task<EventItem?> GetByIdAsync(int id);
        Task<EventItem> AddAsync(EventItem newEvent);
        Task<bool> DeleteAsync(int id);
    }
}
