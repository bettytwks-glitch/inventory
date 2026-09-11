using InventoryApi.Data;
using InventoryApi.Models;
using InventoryApi.Models.DTOs;
using Microsoft.EntityFrameworkCore;

public class AssetService : IAssetService
{
    private readonly AppDbContext _db;

    public AssetService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Asset>> GetAllAsync() =>
        await _db.Assets
            .Include(a => a.Category)
            .Include(a => a.Custodian)
            .Include(a => a.Manager)
            .OrderBy(a => a.AssetId)
            .ToListAsync();

    public async Task<IEnumerable<Asset>> GetByEmployeeAsync(string employeeId) =>
        await _db.Assets
            .Include(a => a.Category)
            .Include(a => a.Custodian)
            .Include(a => a.Manager)
            .Where(a => (a.CustodianId == employeeId || a.ManagerId == employeeId) && a.Status != "scrapped")
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();

    public async Task<Asset?> GetByIdAsync(int id) =>
        await _db.Assets
            .Include(a => a.Category)
            .Include(a => a.Custodian)
            .Include(a => a.Manager)
            .FirstOrDefaultAsync(a => a.AssetId == id);

    public async Task<Asset> CreateAsync(CreateAssetRequest request, string createdBy)
    {
        var assetNo = !string.IsNullOrWhiteSpace(request.AssetNo)
            ? request.AssetNo.Trim()
            : await GenerateAssetNoAsync(request.CategoryId);

        var asset = new Asset
        {
            AssetNo = assetNo,
            CategoryId = request.CategoryId,
            AssetName = request.ComputerName ?? string.Empty,
            ComputerName = request.ComputerName,
            PurchaseDate = request.PurchaseDate,
            Spec = request.Spec,
            LanMac = request.LanMac,
            WifiMac = request.WifiMac,
            AssetType = request.AssetType,
            Purpose = request.Purpose,
            Site = request.Site,
            Department = request.Department,
            CustodianId = string.IsNullOrEmpty(request.CustodianId) ? null : request.CustodianId,
            ManagerId   = string.IsNullOrEmpty(request.ManagerId)   ? null : request.ManagerId,
            DispatchDate = request.DispatchDate,
            Notes = request.Notes,
            OfficeVersion = request.OfficeVersion,
            OsSerial = request.OsSerial,
            Status = request.Status,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Assets.Add(asset);
        await _db.SaveChangesAsync();

        return (await GetByIdAsync(asset.AssetId))!;
    }

    public async Task<Asset?> UpdateStatusAsync(int id, UpdateAssetRequest request)
    {
        var asset = await _db.Assets.FindAsync(id);
        if (asset is null) return null;

        if (!string.IsNullOrWhiteSpace(request.AssetNo))
            asset.AssetNo = request.AssetNo.Trim();

        asset.ComputerName  = request.ComputerName;
        asset.AssetName     = request.ComputerName ?? asset.AssetName;
        asset.PurchaseDate  = request.PurchaseDate;
        asset.Spec          = request.Spec;
        asset.LanMac        = request.LanMac;
        asset.WifiMac       = request.WifiMac;
        asset.AssetType     = request.AssetType;
        asset.Purpose       = request.Purpose;
        asset.Site          = request.Site;
        asset.Department    = request.Department;
        asset.CustodianId   = string.IsNullOrEmpty(request.CustodianId) ? null : request.CustodianId;
        asset.ManagerId     = string.IsNullOrEmpty(request.ManagerId)   ? null : request.ManagerId;
        asset.DispatchDate  = request.DispatchDate;
        asset.Notes         = request.Notes;
        asset.OfficeVersion = request.OfficeVersion;
        asset.OsSerial      = request.OsSerial;
        asset.Status        = request.Status;
        asset.UpdatedAt     = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return await GetByIdAsync(id);
    }

    private async Task<string> GenerateAssetNoAsync(int categoryId)
    {
        var category = await _db.AssetCategories.FindAsync(categoryId)
            ?? throw new InvalidOperationException("找不到資產類別");

        var deptCode = category.DeptInfoCode ?? "IT";
        var assetCode = category.AssetCode;
        var year = (DateTime.Now.Year % 100).ToString("D2");
        var prefix = $"{deptCode}-{assetCode}-{year}-";

        var count = await _db.Assets
            .CountAsync(a => a.AssetNo.StartsWith(prefix));

        return $"{prefix}{(count + 1):D4}";
    }
}
