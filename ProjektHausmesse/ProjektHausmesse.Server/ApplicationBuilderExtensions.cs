namespace ProjektHausmesse.Server;

public static class ApplicationBuilderExtensions
{
    public static void UseSpaProxy(this IApplicationBuilder config) =>
        config.UseSpa(builder =>
        {
            builder.UseProxyToSpaDevelopmentServer(new UriBuilder("https", "localhost", 65298).Uri);
        });
}
