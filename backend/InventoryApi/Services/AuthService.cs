using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using InventoryApi.Data;
using InventoryApi.Models;
using InventoryApi.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly IEmailService _email;

    public AuthService(AppDbContext db, IConfiguration config, IEmailService email)
    {
        _db = db;
        _config = config;
        _email = email;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var emp = await _db.Employees
            .FirstOrDefaultAsync(e => e.EmployeeId == request.EmployeeId && e.IsActive);
        if (emp is null) return null;

        // null hash → default password 123456
        var expected = emp.PasswordHash ?? HashPassword("123456", emp.EmployeeId);
        if (HashPassword(request.Password, emp.EmployeeId) != expected) return null;

        return new LoginResponse(
            Token: GenerateToken(emp),
            EmployeeId: emp.EmployeeId,
            Name: emp.Name,
            Department: emp.Department,
            Site: emp.Site,
            Role: emp.Role,
            MustChangePassword: emp.MustChangePassword
        );
    }

    public async Task<(bool ok, string msg)> ChangePasswordAsync(string employeeId, ChangePasswordRequest request)
    {
        var emp = await _db.Employees.FindAsync(employeeId);
        if (emp is null) return (false, "找不到帳號");

        var expected = emp.PasswordHash ?? HashPassword("123456", emp.EmployeeId);
        if (HashPassword(request.OldPassword, emp.EmployeeId) != expected)
            return (false, "目前密碼不正確");

        if (request.NewPassword.Length < 6)
            return (false, "新密碼至少需要 6 個字元");

        emp.PasswordHash = HashPassword(request.NewPassword, emp.EmployeeId);
        emp.MustChangePassword = false;
        await _db.SaveChangesAsync();
        return (true, "密碼已更新");
    }

    public async Task<(bool ok, string msg)> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var emp = await _db.Employees
            .FirstOrDefaultAsync(e => e.EmployeeId == request.EmployeeId && e.IsActive);
        if (emp is null) return (false, "找不到此工號");

        if (string.IsNullOrEmpty(emp.Email))
            return (false, "此帳號未設定電子郵件，請聯絡 IT 部門");

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLower();
        emp.ResetToken = token;
        emp.ResetTokenExpires = DateTime.UtcNow.AddHours(24);
        await _db.SaveChangesAsync();

        var baseUrl = _config["AppSettings:BaseUrl"] ?? "http://localhost:4200";
        var link = $"{baseUrl}/auth/reset-password?token={token}";
        await _email.SendPasswordResetAsync(emp.Email, emp.Name, link);

        return (true, "重設密碼連結已寄送至您的信箱");
    }

    public async Task<(bool ok, string msg)> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var emp = await _db.Employees
            .FirstOrDefaultAsync(e => e.ResetToken == request.Token);
        if (emp is null) return (false, "無效的重設連結");
        if (emp.ResetTokenExpires < DateTime.UtcNow) return (false, "重設連結已過期，請重新申請");

        if (request.NewPassword.Length < 6)
            return (false, "新密碼至少需要 6 個字元");

        emp.PasswordHash = HashPassword(request.NewPassword, emp.EmployeeId);
        emp.MustChangePassword = false;
        emp.ResetToken = null;
        emp.ResetTokenExpires = null;
        await _db.SaveChangesAsync();
        return (true, "密碼已重設，請重新登入");
    }

    public async Task<LoginResponse?> RegisterAsync(RegisterRequest request)
    {
        var exists = await _db.Employees.AnyAsync(e =>
            e.EmployeeId == request.EmployeeId || e.AdAccount == request.AdAccount);
        if (exists) return null;

        var employee = new Employee
        {
            EmployeeId = request.EmployeeId,
            Name = request.Name,
            Department = request.Department,
            AdAccount = request.AdAccount,
            Email = request.Email,
            Site = request.Site,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();

        return new LoginResponse(
            Token: GenerateToken(employee),
            EmployeeId: employee.EmployeeId,
            Name: employee.Name,
            Department: employee.Department,
            Site: employee.Site,
            Role: employee.Role,
            MustChangePassword: employee.MustChangePassword
        );
    }

    private static string HashPassword(string password, string employeeId)
    {
        var input = password + employeeId + "eAssets!2024";
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLower();
    }

    private string GenerateToken(Employee employee)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, employee.EmployeeId),
            new Claim(ClaimTypes.Name, employee.Name),
            new Claim("ad_account", employee.AdAccount),
            new Claim("department", employee.Department),
            new Claim(ClaimTypes.Role, employee.Role)
        };

        var token = new JwtSecurityToken(
            issuer: _config["JwtSettings:Issuer"],
            audience: _config["JwtSettings:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                double.Parse(_config["JwtSettings:ExpiryMinutes"]!)),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}