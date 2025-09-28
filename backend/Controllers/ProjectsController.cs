using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController(ProjectService service) : ControllerBase
    {
        private readonly ProjectService _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var projects = await _service.GetAllProjectsAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var project = await _service.GetProjectByIdAsync(id);
            if (project == null) return NotFound();
            return Ok(project);
        }
    }
}
