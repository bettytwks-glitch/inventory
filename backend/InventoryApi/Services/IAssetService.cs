using InventoryApi.Models;
using InventoryApi.Models.DTOs;

public interface IAssetService
{
    Task<IEnumerable<Asset>> GetAllAsync();
    Task<IEnumerable<Asset>> GetByEmployeeAsync(string employeeId);
    Task<Asset?> GetByIdAsync(int id);
    Task<Asset> CreateAsync(CreateAssetRequest request, string createdBy);
    Task<Asset?> UpdateStatusAsync(int id, UpdateAssetRequest request);
}
