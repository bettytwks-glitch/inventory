namespace InventoryApi.Models.DTOs;

public class UpdateEmployeeRequest
{
    public string Name       { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string AdAccount  { get; set; } = string.Empty;
    public bool   IsActive   { get; set; }
    public string Role       { get; set; } = "user";
}
