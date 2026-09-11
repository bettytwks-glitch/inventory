namespace InventoryApi.Models.DTOs;

public record ChangePasswordRequest(string OldPassword, string NewPassword);