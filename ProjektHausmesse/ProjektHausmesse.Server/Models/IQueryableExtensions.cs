namespace ProjektHausmesse.Server.Models;

public static class IQueryableExtensions
{
    public static Task PaginateAsync<T>(this IQueryable<T> query, int page, int pageSize) =>
        PaginatedData.CreateAsync(query, page, pageSize);
}
