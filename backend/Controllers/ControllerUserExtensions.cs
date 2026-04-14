using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

internal static class ControllerUserExtensions
{
    public static bool TryGetCurrentUserId(this ControllerBase controller, out long userId)
    {
        var sub = controller.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
            ?? controller.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return long.TryParse(sub, out userId);
    }

    public static bool IsAdmin(this ControllerBase controller) =>
        controller.User.IsInRole("admin");
}
