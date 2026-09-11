using InventoryApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FaCategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FaCategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _db.FaCategories.OrderBy(x => x.MajorCategory).ThenBy(x => x.MinorCategory).ToListAsync());
}
