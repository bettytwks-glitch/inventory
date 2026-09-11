using InventoryApi.Models;

public class InventoryService : IInventoryService
{
    private readonly List<InventoryItem> _items = new();
    private int _nextId = 1;

    public IEnumerable<InventoryItem> GetAll() => _items;

    public InventoryItem? GetById(int id) =>
        _items.FirstOrDefault(x => x.Id == id);

    public InventoryItem Create(InventoryItem item)
    {
        item.Id = _nextId++;
        item.CreatedAt = DateTime.UtcNow;
        item.UpdatedAt = DateTime.UtcNow;
        _items.Add(item);
        return item;
    }

    public InventoryItem? Update(int id, InventoryItem item)
    {
        var existing = _items.FirstOrDefault(x => x.Id == id);
        if (existing is null) return null;

        existing.Name = item.Name;
        existing.Category = item.Category;
        existing.Quantity = item.Quantity;
        existing.UnitPrice = item.UnitPrice;
        existing.Description = item.Description;
        existing.UpdatedAt = DateTime.UtcNow;
        return existing;
    }

    public bool Delete(int id)
    {
        var item = _items.FirstOrDefault(x => x.Id == id);
        if (item is null) return false;
        _items.Remove(item);
        return true;
    }
}
