namespace InventoryApi.Models.DTOs;

public class CreateEmployeeRequest
{
    public string EmployeeId { get; set; } = string.Empty;
    public string AdAccount  { get; set; } = string.Empty;
    public string Name       { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
}
