namespace drcbackend.Models
{
    public class NewsPost
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime PublishedAtUtc { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

        public List<NewsImage> Images { get; set; } = new List<NewsImage>();
    }
}
