using drcbackend.Models;
using DrcPrimarySchool.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace drcbackend.Repository
{
    public class NewsRepository : INewsRepository
    {
        private readonly ApplicationDbContext _context;

        public NewsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NewsPost>> GetAllAsync()
        {
             return await _context.NewsPosts
              .Include(n => n.Images)
              .OrderByDescending(n => n.PublishedAtUtc)
              .ToListAsync();
        }

        public async Task<NewsPost?> GetByIdAsync(int id)
        {
            return await _context.NewsPosts
                .Include(n => n.Images)
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<NewsPost> CreateAsync(NewsPost news)
        {
            _context.NewsPosts.Add(news);

            await _context.SaveChangesAsync();

            return news;
        }

        public async Task DeleteAsync(NewsPost news)
        {
            _context.NewsPosts.Remove(news);

            await _context.SaveChangesAsync();
        }
    }
}
