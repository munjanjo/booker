using Domain.Entities;
using Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace App.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController(AppDbContext db) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest req)
    {
        var uid = User.FindFirst("user_id")?.Value;
        if (uid is null) return Unauthorized();

        var service = await db.Services.FindAsync(req.ServiceId);
        if (service is null || !service.IsActive) return BadRequest("Invalid service");

        var start = req.StartUtc;
        var end = start.AddMinutes(service.DurationMinutes);

        var overlap = await db.Appointments.AnyAsync(a =>
            a.ServiceId == req.ServiceId &&
            a.Status == "Booked" &&
            ((start >= a.StartUtc && start < a.EndUtc) || (end > a.StartUtc && end <= a.EndUtc)));

        if (overlap) return Conflict("Time slot not available");

        var appt = new Appointment
        {
            FirebaseUid = uid,
            ServiceId = req.ServiceId,
            StartUtc = start,
            EndUtc = end
        };

        db.Appointments.Add(appt);
        await db.SaveChangesAsync();
        return Ok(appt);
    }
    

    [Authorize]
    [HttpGet("mine")]
    public async Task<IActionResult> Mine()
    {
        var uid = User.FindFirst("user_id")?.Value!;
        var list = await db.Appointments
            .Include(a => a.Service)
            .Where(a => a.FirebaseUid == uid)
            .OrderByDescending(a => a.StartUtc)
            .ToListAsync();
        return Ok(list);
    }
}

public record CreateAppointmentRequest(int ServiceId, DateTime StartUtc);
