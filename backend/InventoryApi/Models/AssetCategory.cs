using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models;

[Table("asset_categories")]
public class AssetCategory
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("asset_code")]
    public string AssetCode { get; set; } = string.Empty;

    [Column("category_name")]
    public string CategoryName { get; set; } = string.Empty;

    [Column("dept_info_code")]
    public string? DeptInfoCode { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
