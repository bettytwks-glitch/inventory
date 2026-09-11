namespace InventoryApi.Models.DTOs;

public record ResetPasswordRequest(string Token, string NewPassword);