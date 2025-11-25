namespace ProjektHausmesse.Server.Data;

public class ContainerEntity
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required Position Position { get; set; }

    public SensorEntity? Sensor { get; set; }
}
