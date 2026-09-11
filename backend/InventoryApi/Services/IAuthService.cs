using InventoryApi.Models.DTOs;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<LoginResponse?> RegisterAsync(RegisterRequest request);
    Task<(bool ok, string msg)> ChangePasswordAsync(string employeeId, ChangePasswordRequest request);
    Task<(bool ok, string msg)> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<(bool ok, string msg)> ResetPasswordAsync(ResetPasswordRequest request);
}