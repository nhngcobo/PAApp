namespace Backend.Models
{
    public class Employee
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Role { get; set; }
        public required string Skills { get; set; }
        public required string Technologies { get; set; }
        public required string Department { get; set; }
        public int ExperienceYears { get; set; }
        public decimal? Rating { get; set; }
        public string? AvatarUrl { get; set; }
        
        // Availability tracking
        public bool IsOnProject { get; set; } = false;
        public string? CurrentProjectName { get; set; }
        public DateTime? ProjectEndDate { get; set; }
        public string AvailabilityStatus => GetAvailabilityStatus();
        
        private string GetAvailabilityStatus()
        {
            if (!IsOnProject)
                return "Available";
                
            if (ProjectEndDate.HasValue && ProjectEndDate.Value <= DateTime.Now.AddMonths(2))
                return "Available Soon";
                
            return "On Project";
        }
    }
}
