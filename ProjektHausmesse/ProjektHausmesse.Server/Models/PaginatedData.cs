using Microsoft.EntityFrameworkCore;

namespace ProjektHausmesse.Server.Models;

public record PaginatedData
{
    public static async Task<PaginatedData<T>> CreateAsync<T>(
        IQueryable<T> query,
        int page,
        int pageSize
    )
    {
        return new PaginatedData<T>(
            await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(),
            await query.CountAsync()
        );
    }
}

public record PaginatedData<T>(List<T> Elements, int TotalElements) : PaginatedData;
