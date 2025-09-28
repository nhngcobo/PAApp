using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Repositories
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<Employee?> GetByIdAsync(int id);
        Task<int> AddAsync(Employee employee);
        Task<bool> UpdateAsync(Employee employee);
        // Add more methods as needed
    }
}
