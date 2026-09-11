using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryApi.Models;

[Table("assets")]
public class Asset
{
    [Key]
    [Column("asset_id")]
    public int AssetId { get; set; }

    [Column("asset_no")]
    public string AssetNo { get; set; } = string.Empty;

    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("asset_name")]
    public string AssetName { get; set; } = string.Empty;

    [Column("brand")]
    public string? Brand { get; set; }

    [Column("model")]
    public string? Model { get; set; }

    [Column("serial_number")]
    public string? SerialNumber { get; set; }

    [Column("purchase_date", TypeName = "date")]
    public DateTime? PurchaseDate { get; set; }

    [Column("purchase_price", TypeName = "decimal(12,2)")]
    public decimal? PurchasePrice { get; set; }

    [Column("site")]
    public string? Site { get; set; }

    [Column("location")]
    public string? Location { get; set; }

    [Column("status")]
    public string Status { get; set; } = "new";

    [Column("custodian_id")]
    public string? CustodianId { get; set; }

    [Column("manager_id")]
    public string? ManagerId { get; set; }

    [Column("fa_major_category")]
    public string? FaMajorCategory { get; set; }

    [Column("fa_minor_category")]
    public string? FaMinorCategory { get; set; }

    [Column("computer_name")]
    public string? ComputerName { get; set; }

    [Column("spec")]
    public string? Spec { get; set; }

    [Column("lan_mac")]
    public string? LanMac { get; set; }

    [Column("wifi_mac")]
    public string? WifiMac { get; set; }

    [Column("asset_type")]
    public string? AssetType { get; set; }

    [Column("purpose")]
    public string? Purpose { get; set; }

    [Column("department")]
    public string? Department { get; set; }

    [Column("dispatch_date", TypeName = "date")]
    public DateTime? DispatchDate { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("office_version")]
    public string? OfficeVersion { get; set; }

    [Column("os_serial")]
    public string? OsSerial { get; set; }

    [Column("inventoried")]
    public bool Inventoried { get; set; } = false;

    [Column("inventoried_at")]
    public DateTime? InventoriedAt { get; set; }

    [Column("inventoried_by")]
    public string? InventoriedBy { get; set; }

    [Column("created_by")]
    public string? CreatedBy { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public AssetCategory? Category { get; set; }
    public Employee? Custodian { get; set; }
    public Employee? Manager { get; set; }
}
