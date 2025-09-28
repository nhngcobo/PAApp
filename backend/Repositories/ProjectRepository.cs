using Backend.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;

namespace Backend.Repositories
{
    public class ProjectRepository(IConfiguration configuration) : IProjectRepository
    {
        private readonly string _connectionString = configuration.GetConnectionString("DefaultConnection");

        public async Task<IEnumerable<Project>> GetAllAsync()
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var sql = "SELECT * FROM Projects";
                return await db.QueryAsync<Project>(sql);
            }
        }

        public async Task<Project> GetByIdAsync(int id)
        {
            using (IDbConnection db = new SqlConnection(_connectionString))
            {
                var sql = "SELECT * FROM Projects WHERE Id = @Id";
                return await db.QueryFirstOrDefaultAsync<Project>(sql, new { Id = id });
            }
        }
    }
}
