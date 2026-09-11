using System.Security.Claims;
using InventoryApi.Data;
using InventoryApi.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _assetService;
    private readonly AppDbContext _db;

    public AssetsController(IAssetService assetService, AppDbContext db)
    {
        _assetService = assetService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _assetService.GetAllAsync());

    [HttpGet("mine")]
    public async Task<IActionResult> GetMine()
    {
        var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        return Ok(await _assetService.GetByEmployeeAsync(employeeId));
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetCount() =>
        Ok(new { count = await _db.Assets.CountAsync() });

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var asset = await _assetService.GetByIdAsync(id);
        return asset is null ? NotFound() : Ok(asset);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateAssetRequest request)
    {
        var asset = await _assetService.UpdateStatusAsync(id, request);
        return asset is null ? NotFound() : Ok(asset);
    }

    [HttpPut("{id:int}/inventory")]
    public async Task<IActionResult> ToggleInventory(int id, [FromBody] InventoryRequest request)
    {
        var asset = await _db.Assets.FindAsync(id);
        if (asset is null) return NotFound();
        asset.Inventoried = request.Inventoried;
        asset.UpdatedAt   = DateTime.UtcNow;
        if (request.Inventoried)
        {
            var name = User.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
            asset.InventoriedAt = DateTime.Now;
            asset.InventoriedBy = name;
        }
        else
        {
            asset.InventoriedAt = null;
            asset.InventoriedBy = null;
        }
        await _db.SaveChangesAsync();
        return Ok(new { asset.AssetId, asset.Inventoried, asset.InventoriedAt, asset.InventoriedBy });
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAssetRequest request)
    {
        var employeeId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
        var asset = await _assetService.CreateAsync(request, employeeId);
        return CreatedAtAction(nameof(GetById), new { id = asset.AssetId }, asset);
    }
}
