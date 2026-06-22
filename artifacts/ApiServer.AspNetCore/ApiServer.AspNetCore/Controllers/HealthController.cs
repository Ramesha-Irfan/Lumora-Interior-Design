using Microsoft.AspNetCore.Mvc;

namespace ApiServer.AspNetCore.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet("/healthz")]
    [HttpGet("/api/healthz")]
    public IActionResult GetHealth()
    {
        return Ok(new { status = "ok" });
    }
}
