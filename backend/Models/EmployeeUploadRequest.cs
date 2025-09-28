using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class EmployeeUploadRequest
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Role { get; set; } = string.Empty;

        [Required]
        public string Skills { get; set; } = string.Empty; // Comma-separated

        [Required]
        public string Technologies { get; set; } = string.Empty; // Comma-separated

        [StringLength(100)]
        public string? Department { get; set; }

        [Range(0, 50)]
        public int? ExperienceYears { get; set; }

        [Range(1, 5)]
        public decimal? Rating { get; set; }
        
        // Availability tracking
        public bool IsOnProject { get; set; } = false;
        
        [StringLength(200)]
        public string? CurrentProjectName { get; set; }
        
        public DateTime? ProjectEndDate { get; set; }
    }
}