namespace InventoryApi.Models.DTOs;

public record RegisterRequest(
    string EmployeeId,
    string Name,
    string Department,
    string AdAccount,
    string? Email,
    string? Site
);
