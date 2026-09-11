using InventoryApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public AssetCategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.AssetCategories
            .Where(c => c.Status == "active")
            .OrderBy(c => c.AssetCode)
            .ToListAsync());
}
