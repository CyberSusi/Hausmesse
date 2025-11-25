import {Card, CardContent} from "@/components/ui/card.tsx"
import {Container} from "@/models/Container.ts"
import {ComponentProps} from "react"
import {cn} from "@/lib/utils.ts"

type ContainerPanelProps = ComponentProps<"div"> & {
  container: Container
  setHoverContainer: (container: Container | null) => void
  setSelectedContainer: (container: Container | null) => void
};

export default function ContainerPanel({container, className, setHoverContainer, setSelectedContainer}: ContainerPanelProps) {

  function onHoverIn(): void {
    setHoverContainer(container)
  }

  function onHoverOut(): void {
    setHoverContainer(null)
  }

  function onClick(): void {
    setSelectedContainer(container)
  }

  function getBgClassByCapacity(capacity: number) {
    if (capacity >= 90) return "bg-red-400";
    if (capacity >= 50) return "bg-yellow-300";
    return "bg-green-300";
  }

  function getCapacity(): number {
    return (container.sensor.curDistance / container.sensor.maxDistance) * 100
  }

  return (
      <>
        <Card
            onClick={onClick}
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            className={cn(
                "max-w-72 my-5 mx-1 shadow-md rounded-md hover:scale-105 transition-all duration-200",
                getBgClassByCapacity(container.capacity),
                className,
            )}>
          <CardContent>
            <p className={"p-1 leading-none font-semibold"}>{container.name}</p>
            <p className={"p-1 leading-none"}>zu {getCapacity().toFixed(0)} % gefüllt</p>
            <p className={"p-1 leading-none"}>
              Letztes Update:
              <span className={"block mt-1"}>{container.sensor.lastUpdate}</span>
            </p>
          </CardContent>
        </Card>
      </>
  )
}
