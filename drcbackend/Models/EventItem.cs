namespace drcbackend.Models
{
    public class EventItem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Time {  get; set; } = string.Empty;
        public string Location {  get; set; } = string.Empty;
        public string Description {  get; set; } = string.Empty;
        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
