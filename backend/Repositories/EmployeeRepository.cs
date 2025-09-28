using Backend.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;

namespace Backend.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly string _connectionString;
        public EmployeeRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT Id, Name, Email, JobTitle as Role, Skills, Technologies, Department, 
                           ExperienceYears, Rating, AvatarUrl, IsOnProject, CurrentProjectName, ProjectEndDate 
                           FROM Employees";
                return await db.QueryAsync<Employee>(sql);
            }
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var sql = @"SELECT Id, Name, Email, JobTitle as Role, Skills, Technologies, Department, 
                           ExperienceYears, Rating, AvatarUrl, IsOnProject, CurrentProjectName, ProjectEndDate 
                           FROM Employees WHERE Id = @Id";
                return await db.QueryFirstOrDefaultAsync<Employee>(sql, new { Id = id });
            }
        }

        public async Task<int> AddAsync(Employee employee)
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var sql = @"INSERT INTO Employees (Name, Email, JobTitle, Skills, Technologies, Department, 
                           ExperienceYears, Rating, AvatarUrl, IsOnProject, CurrentProjectName, ProjectEndDate) 
                           VALUES (@Name, @Email, @Role, @Skills, @Technologies, @Department, 
                           @ExperienceYears, @Rating, @AvatarUrl, @IsOnProject, @CurrentProjectName, @ProjectEndDate);
                           SELECT CAST(SCOPE_IDENTITY() as int)";
                return await db.QuerySingleAsync<int>(sql, employee);
            }
        }

        public async Task<bool> UpdateAsync(Employee employee)
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var sql = @"UPDATE Employees SET 
                           Name = @Name, 
                           Email = @Email, 
                           JobTitle = @Role, 
                           Skills = @Skills, 
                           Technologies = @Technologies, 
                           Department = @Department, 
                           ExperienceYears = @ExperienceYears, 
                           Rating = @Rating, 
                           AvatarUrl = @AvatarUrl,
                           IsOnProject = @IsOnProject,
                           CurrentProjectName = @CurrentProjectName,
                           ProjectEndDate = @ProjectEndDate
                           WHERE Id = @Id";
                var rowsAffected = await db.ExecuteAsync(sql, employee);
                return rowsAffected > 0;
            }
        }
    }
}
