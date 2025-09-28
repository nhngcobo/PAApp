using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _service;
        public EmployeesController(EmployeeService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var employees = await _service.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpPost("match")]
        public async Task<IActionResult> Match([FromBody] MatchRequest request)
        {
            var matches = await _service.MatchEmployeesAsync(request);
            return Ok(matches);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadEmployee([FromForm] EmployeeUploadRequest request, IFormFile? image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? imageUrl = null;

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/{uniqueFileName}";
            }

            var result = await _service.UploadEmployeeAsync(request, imageUrl);

            return result.Success
                ? Ok(new { message = result.Message, statusCode = 200 })
                : BadRequest(new { message = result.Message, statusCode = 400 });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromForm] EmployeeUploadRequest request, IFormFile? image)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            string? imageUrl = null;

            if (image != null && image.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imageUrl = $"/uploads/{uniqueFileName}";
            }

            var result = await _service.UpdateEmployeeAsync(id, request, imageUrl);

            return result.Success
                ? Ok(new { message = result.Message, statusCode = 200 })
                : BadRequest(new { message = result.Message, statusCode = 400 });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var employee = await _service.GetAllEmployeesAsync();
            var emp = employee.FirstOrDefault(e => e.Id == id);
            
            return emp != null 
                ? Ok(emp) 
                : NotFound(new { message = "Employee not found", statusCode = 404 });
        }
    }
}
