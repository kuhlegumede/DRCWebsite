namespace drcbackend.Models
{
    public class NewsImage
    {
        public int Id { get; set; }

        public int NewsPostId { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        public string Caption { get; set; } = string.Empty;

        public NewsPost? NewsPost { get; set; }
    }
}