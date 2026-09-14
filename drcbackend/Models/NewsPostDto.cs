namespace drcbackend.Models
{
    public class NewsPostDto
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        public DateTime PublishedAtUtc { get; set; }

        public DateTime CreatedAtUtc { get; set; }

        public List<NewsImageDto> Images { get; set; } = new();
    }

    public class NewsImageDto
    {
        public int Id { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public string Caption { get; set; } = string.Empty;
    }
}
