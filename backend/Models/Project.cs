using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string ClientName { get; set; }
        public string Industry { get; set; }
        public string ProjectType { get; set; }
        public string Priority { get; set; }
        public string Skills { get; set; }
        public string Technologies { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string EstimatedHours { get; set; }
        public string Budget { get; set; }
    }
}
