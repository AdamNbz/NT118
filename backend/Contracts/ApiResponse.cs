namespace Backend.Contracts;

public interface IApiResponse
{
    bool Success { get; }
    string Message { get; }
    string? TraceId { get; }
}

public record ApiResponse(bool Success, string Message, object? Data = null, object? Errors = null, string? TraceId = null) : IApiResponse;

public record ApiResponse<T>(bool Success, string Message, T? Data = default, object? Errors = null, string? TraceId = null) : IApiResponse;

public static class ApiResponses
{
    public static ApiResponse<T> Ok<T>(T data, string message = "Success", string? traceId = null) =>
        new(true, message, data, null, traceId);

    public static ApiResponse Ok(string message = "Success", object? data = null, string? traceId = null) =>
        new(true, message, data, null, traceId);

    public static ApiResponse Fail(string message, object? errors = null, string? traceId = null) =>
        new(false, message, null, errors, traceId);

    public static ApiResponse Validation(object errors, string? traceId = null) =>
        new(false, "Validation failed", null, errors, traceId);
}
