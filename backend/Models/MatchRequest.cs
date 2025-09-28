namespace Backend.Models
{
    public class MatchRequest
    {
    public List<string>? Skills { get; set; }
    public List<string>? Technologies { get; set; }
    public string? ProjectType { get; set; }
    public string? Priority { get; set; }
        // Add more fields as needed
    }
}