using InventoryApi.Models;

public interface IInventoryService
{
    IEnumerable<InventoryItem> GetAll();
    InventoryItem? GetById(int id);
    InventoryItem Create(InventoryItem item);
    InventoryItem? Update(int id, InventoryItem item);
    bool Delete(int id);
}
