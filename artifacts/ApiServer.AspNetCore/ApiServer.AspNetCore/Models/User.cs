using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ApiServer.AspNetCore.Models;

[Table("users")]
public class User
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("name")]
    public string Name { get; set; } = null!;

    [Required]
    [Column("username")]
    public string Username { get; set; } = null!;

    [Required]
    [Column("email")]
    public string Email { get; set; } = null!;

    [Required]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = null!;

    [Required]
    [Column("plan")]
    public string Plan { get; set; } = "Free";

    [Required]
    [Column("avatar_color")]
    public string AvatarColor { get; set; } = "#A78B75";

    [Required]
    [Column("is_verified")]
    public bool IsVerified { get; set; } = false;

    [Required]
    [Column("created_at")]
    public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");
}
