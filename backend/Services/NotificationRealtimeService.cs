using Backend.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Backend.Services;

public class NotificationRealtimeService(IHubContext<NotificationHub> hubContext) : INotificationRealtimeService
{
    public Task NotifyUserAsync(long userId, object payload, CancellationToken cancellationToken = default)
    {
        var group = NotificationHub.BuildUserGroup(userId.ToString());
        return hubContext.Clients.Group(group).SendAsync("notification.created", payload, cancellationToken);
    }
}
