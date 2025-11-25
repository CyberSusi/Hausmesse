import {createFileRoute} from "@tanstack/react-router"
import MapComponent from "@/components/map/MapComponent.tsx"
import Sidebar from "@/components/shared/Sidebar.tsx";
import {Container} from "@/models/Container.ts";
import {Card, CardContent} from "@/components/ui/card.tsx";
import {backendService} from "@/api/backendService.ts";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

async function fetchContainers() {
  let containers: Container[] = await backendService.getAllContainers()
  await new Promise(resolve => setTimeout(resolve, 600)) // Simulate network delay
  return containers
}

function Dashboard() {
  const [hoverContainer, setHoverContainer] = useState<Container | null>(null)
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null)
  const {data} = useQuery({
    queryKey: ["containers"],
    queryFn: () => fetchContainers(),
    initialData: [],
  })

  return (
        <Card className={"flex w-full h-screen scale-90 py-0 m-5"}>
          <CardContent className={"p-0 flex flex-col sm:flex-row flex-grow"}>
            <Sidebar
              setHoverContainer={setHoverContainer}
              setSelectedContainer={setSelectedContainer}/>
            <MapComponent
              className={"w-full h-full"}
              containers={data}
              hoverContainer={hoverContainer}
              selectedContainer={selectedContainer}
              setSelectedContainer={setSelectedContainer}/>
          </CardContent>
        </Card>
  );
}
