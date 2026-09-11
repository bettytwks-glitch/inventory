using InventoryApi.Data;
using InventoryApi.Models;
using InventoryApi.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;

    public EmployeesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] bool all = false)
    {
        var query = _db.Employees.AsQueryable();
        if (!all) query = query.Where(e => e.IsActive);
        var result = await query
            .OrderBy(e => e.Department)
            .ThenBy(e => e.Name)
            .Select(e => new { e.EmployeeId, e.AdAccount, e.Name, e.Department, e.IsActive, e.Role })
            .ToListAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateEmployeeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.EmployeeId) || string.IsNullOrWhiteSpace(request.AdAccount) || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new { message = "工號、帳號與姓名為必填" });

        if (await _db.Employees.AnyAsync(e => e.EmployeeId == request.EmployeeId))
            return Conflict(new { message = $"工號「{request.EmployeeId}」已存在" });

        if (await _db.Employees.AnyAsync(e => e.AdAccount == request.AdAccount))
            return Conflict(new { message = $"帳號「{request.AdAccount}」已存在" });

        var employee = new Employee
        {
            EmployeeId = request.EmployeeId,
            AdAccount  = request.AdAccount,
            Name       = request.Name,
            Department = request.Department,
            IsActive   = true,
            CreatedAt  = DateTime.UtcNow
        };

        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();
        return Ok(new { employee.EmployeeId, employee.Name, employee.Department });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateEmployeeRequest request)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound();
        emp.Name       = request.Name;
        emp.Department = request.Department;
        emp.AdAccount  = request.AdAccount;
        emp.IsActive   = request.IsActive;
        emp.Role       = request.Role == "admin" ? "admin" : "user";
        await _db.SaveChangesAsync();
        return Ok(new { emp.EmployeeId, emp.AdAccount, emp.Name, emp.Department, emp.IsActive, emp.Role });
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> SetRole(string id, [FromBody] SetRoleRequest request)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound();
        emp.Role = request.Role == "admin" ? "admin" : "user";
        await _db.SaveChangesAsync();
        return Ok(new { emp.EmployeeId, emp.Role });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deactivate(string id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound();
        emp.IsActive = false;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id}/activate")]
    public async Task<IActionResult> Activate(string id)
    {
        var emp = await _db.Employees.FindAsync(id);
        if (emp is null) return NotFound();
        emp.IsActive = true;
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
