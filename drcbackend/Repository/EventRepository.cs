using drcbackend.Models;
using DrcPrimarySchool.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace drcbackend.Repository
{
    public class EventRepository : IEventRepository
    {
        private readonly ApplicationDbContext _context;

        public EventRepository(
            ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<EventItem>> GetAllAsync()
        {
            return await _context.Events
                .AsNoTracking()
                .OrderBy(e => e.Date)
                .ThenBy(e => e.Time)
                .ToListAsync();
        }

        public async Task<EventItem?> GetByIdAsync(int id)
        {
            return await _context.Events
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<EventItem> AddAsync(
            EventItem newEvent)
        {
            _context.Events.Add(newEvent);

            await _context.SaveChangesAsync();

            return newEvent;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var eventItem =
                await _context.Events
                    .FirstOrDefaultAsync(e => e.Id == id);

            if (eventItem == null)
            {
                return false;
            }

            _context.Events.Remove(eventItem);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
