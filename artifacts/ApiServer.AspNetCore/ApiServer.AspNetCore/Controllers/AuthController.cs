using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using ApiServer.AspNetCore.Data;
using ApiServer.AspNetCore.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ApiServer.AspNetCore.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    private string GetAvatarInitials(string name)
    {
        var words = name.Trim().Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
        var initials = words.Take(2).Select(w => char.ToUpper(w[0]).ToString());
        return string.Join("", initials);
    }

    private object MakeUserResponse(User user)
    {
        return new
        {
            name = user.Name,
            username = user.Username,
            email = user.Email,
            plan = user.Plan,
            avatarInitials = GetAvatarInitials(user.Name),
            avatarColor = user.AvatarColor,
            createdAt = user.CreatedAt
        };
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrEmpty(req.Name) || string.IsNullOrEmpty(req.Username) || 
            string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
        {
            return BadRequest(new { error = "All fields are required." });
        }

        if (!Regex.IsMatch(req.Username, @"^[a-zA-Z0-9_]+$"))
        {
            return BadRequest(new { error = "Username may only contain letters, numbers, and underscores." });
        }

        if (req.Password.Length < 8)
        {
            return BadRequest(new { error = "Password must be at least 8 characters." });
        }

        if (await _db.Users.AnyAsync(u => u.Email == req.Email))
        {
            return Conflict(new { error = "This email is already registered." });
        }

        if (await _db.Users.AnyAsync(u => u.Username == req.Username))
        {
            return Conflict(new { error = "This username is already taken." });
        }

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(req.Password, 10);

        var user = new User
        {
            Name = req.Name,
            Username = req.Username,
            Email = req.Email,
            PasswordHash = passwordHash,
            IsVerified = true,
            CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateToken(user);
        return StatusCode(201, new { token, user = MakeUserResponse(user) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrEmpty(req.Email) || string.IsNullOrEmpty(req.Password))
        {
            return BadRequest(new { error = "Email and password are required." });
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
        {
            return Unauthorized(new { error = "Invalid email or password." });
        }

        var token = GenerateToken(user);
        return Ok(new { token, user = MakeUserResponse(user) });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMe()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("userId")?.Value;
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized(new { error = "Invalid token." });
        }

        var user = await _db.Users.FindAsync(userId);
        if (user == null)
        {
            return Unauthorized(new { error = "User not found." });
        }

        return Ok(MakeUserResponse(user));
    }

    [HttpPut("me")]
    [Authorize]
    public async Task<IActionResult> UpdateMe([FromBody] UpdateMeRequest req)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("userId")?.Value;
        if (!int.TryParse(userIdStr, out var userId))
        {
            return Unauthorized(new { error = "Invalid token." });
        }

        var user = await _db.Users.FindAsync(userId);
        if (user == null)
        {
            return NotFound(new { error = "User not found." });
        }

        if (!string.IsNullOrEmpty(req.Name))
            user.Name = req.Name;

        if (!string.IsNullOrEmpty(req.Username))
            user.Username = req.Username;

        await _db.SaveChangesAsync();
        return Ok(MakeUserResponse(user));
    }

    private string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secret = Environment.GetEnvironmentVariable("SESSION_SECRET") ?? "lumora-dev-secret-key-min-32-chars!";
        var key = Encoding.ASCII.GetBytes(secret);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim("userId", user.Id.ToString()) 
            }),
            Expires = DateTime.UtcNow.AddDays(30),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

public class RegisterRequest
{
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class UpdateMeRequest
{
    public string? Name { get; set; }
    public string? Username { get; set; }
}
