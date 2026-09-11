namespace InventoryApi.Models.DTOs;

public record LoginResponse(
    string Token,
    string EmployeeId,
    string Name,
    string Department,
    string? Site,
    string Role,
    bool MustChangePassword
);