using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models;

[Table("employees")]
public class Employee
{
    [Key]
    [Column("employee_id")]
    public string EmployeeId { get; set; } = string.Empty;

    [Column("name")]
    public string Name { get; set; } = string.Empty;

    [Column("department")]
    public string Department { get; set; } = string.Empty;

    [Column("email")]
    public string? Email { get; set; }

    [Column("ad_account")]
    public string AdAccount { get; set; } = string.Empty;

    [Column("site")]
    public string? Site { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("role")]
    public string Role { get; set; } = "user";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("password_hash")]
    public string? PasswordHash { get; set; }

    [Column("must_change_password")]
    public bool MustChangePassword { get; set; } = true;

    [Column("reset_token")]
    public string? ResetToken { get; set; }

    [Column("reset_token_expires")]
    public DateTime? ResetTokenExpires { get; set; }
}
