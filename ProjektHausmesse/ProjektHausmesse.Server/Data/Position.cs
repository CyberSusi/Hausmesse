using System.ComponentModel.DataAnnotations.Schema;

namespace ProjektHausmesse.Server.Data;

[ComplexType]
public class Position
{
    public required decimal Latitude { get; set; }
    public required decimal Longitude { get; set; }
}
