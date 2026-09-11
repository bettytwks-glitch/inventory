namespace InventoryApi.Models.DTOs;

public class CreateAssetRequest
{
    public int CategoryId { get; set; } = 1;
    public string? AssetNo { get; set; }
    public string? ComputerName { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? Spec { get; set; }
    public string? LanMac { get; set; }
    public string? WifiMac { get; set; }
    public string? AssetType { get; set; }
    public string? Purpose { get; set; }
    public string? Site { get; set; }
    public string? Department { get; set; }
    public string? CustodianId { get; set; }
    public string? ManagerId { get; set; }
    public DateTime? DispatchDate { get; set; }
    public string? Notes { get; set; }
    public string? OfficeVersion { get; set; }
    public string? OsSerial { get; set; }
    public string Status { get; set; } = "new";
}
