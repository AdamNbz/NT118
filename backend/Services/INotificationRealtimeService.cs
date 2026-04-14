namespace Backend.Services;

public interface INotificationRealtimeService
{
    Task NotifyUserAsync(long userId, object payload, CancellationToken cancellationToken = default);
}
