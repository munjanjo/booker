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

        // Robusnije preklapanje: (start < a.End) && (end > a.Start)
        var overlap = await db.Appointments.AnyAsync(a =>
            a.ServiceId == req.ServiceId &&
            a.Status == "Booked" &&
            start < a.EndUtc &&
            end > a.StartUtc
        );

        if (overlap) return Conflict("Time slot not available");

        var appt = new Appointment
        {
            FirebaseUid = uid,
            ServiceId = req.ServiceId,
            StartUtc = start,
            EndUtc = end,
            Status = "Booked" // ✅ inicijalni status
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

    // ✅ OVDJE treba stajati Cancel — UNUTAR klase
    [Authorize]
    [HttpPost("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var uid = User.FindFirst("user_id")?.Value;
        if (uid is null) return Unauthorized();

        var appt = await db.Appointments
            .Include(a => a.Service)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appt is null) return NotFound("Appointment not found");
        if (appt.FirebaseUid != uid) return Forbid();

        if (string.Equals(appt.Status, "Cancelled", StringComparison.OrdinalIgnoreCase))
            return Conflict("Already cancelled");

        if (string.Equals(appt.Status, "Completed", StringComparison.OrdinalIgnoreCase))
            return Conflict("Already completed");

        // Po želji: zabrani otkazivanje nakon početka
        if (DateTime.UtcNow >= appt.StartUtc)
            return BadRequest("Cannot cancel after start time");

        appt.Status = "Cancelled";
        await db.SaveChangesAsync();

        return Ok(new
        {
            appt.Id,
            appt.Status,
            appt.StartUtc,
            appt.EndUtc,
            ServiceName = appt.Service?.Name
        });
    }
}

public record CreateAppointmentRequest(int ServiceId, DateTime StartUtc);
