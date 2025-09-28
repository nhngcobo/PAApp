using Backend.Models;
using Backend.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class ProjectService
    {
        private readonly IProjectRepository _repo;
        public ProjectService(IProjectRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<Project>> GetAllProjectsAsync()
        {
            return _repo.GetAllAsync();
        }

        public Task<Project> GetProjectByIdAsync(int id)
        {
            return _repo.GetByIdAsync(id);
        }
    }
}
