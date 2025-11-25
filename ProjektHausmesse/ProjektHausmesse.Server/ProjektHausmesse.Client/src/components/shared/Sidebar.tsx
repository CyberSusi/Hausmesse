import { backendService } from "@/api/backendService.ts"
import ContainerPanel from "@/components/shared/ContainerPanel.tsx"
import Searchbar from "@/components/shared/Searchbar.tsx"
import SkeletonContainer from "@/components/shared/SkeletonContainer.tsx"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils.ts"
import { Container } from "@/models/Container.ts"
import { useQuery } from "@tanstack/react-query"
import { ComponentProps, useState } from "react"

/**
 * Dient dazu Parameter zu definieren, die dem Component während der Implementierung übergeben werden können.
 * @params ComponentProps<"div"> - Ermöglicht, dass zudem alle Arten von Props verwendet werden können,
 * die dem HTML-Tag <div> übergeben werden können.
 */
type SidebarProps = ComponentProps<"div"> & {
  setHoverContainer: (container: Container | null) => void
  setSelectedContainer: (container: Container | null) => void
}

/**
 * Sendet eine Anfrage ans backend mit einem optionalen Parameter und erhählt ein Container Array zurück.
 * @param query stellt den Suchwert
 */
async function fetchSearchResults(query?: string): Promise<Container[]> {
  let containers: Container[] = await backendService.getAllContainers(query ? { name: query } : undefined)
  await new Promise(resolve => setTimeout(resolve, 600)) // Simulate network delay
  return containers
}

/**
 * Wrappet die Searchbar und die ContainerPanel
 * @param setHoverContainer - Container, über den gerade gehovert wird
 * @param setSelectedContainer - Container, der ausgewählt wurde
 * @param className - Styles für die den Card-Tag
 * @privateRemarks export default - Sorgt dafür, dass das Komponent an anderen Stellen einfach verwendet werden kann
 */
export default function Sidebar({ setHoverContainer, setSelectedContainer, className }: SidebarProps) {
  /**
   * Ermöglicht die Suche via Input und setzt den Input als Search,
   * wird später im HTML und in der folgenden query verwendet
  */
  const [search, setSearch] = useState("")

  /**
   * Erstellt eine Query um nach der search zu suchen und fetchSearchResult aufzurufen,
   * initial wird ein leeres Array verwendet.
   */
  const { data, isLoading } = useQuery({ //
    queryKey: ["searchResults", search],
    queryFn: () => fetchSearchResults(search),
    initialData: [],
  })

  /**
   * @type Card - Wrapper für die Sidebar
   * @type CardHeader - Wird für die Searchbar-Komponente verwendet
   * @type Searchbar - Erhält und verändert die search
   * @type CardContent - Wrapper für ScrollArea und ContainerPanel
   * @type ScrollArea - Bereich, in welchen die gefundenen ContainerPanel gerendert werden
   * @type SkeletonContainer - Platzhalter während der Anfrage an die API
   * @type ContainerPanel - Wrapper für Container MetaData
   */
  return (
    <>
      <Card className={cn(className, "w-full sm:w-80 h-1/2 sm:h-full mb-0 flex")}>
        <CardHeader>
          <Searchbar
            className={"w-64 mb-8 rounded-t-2xl rounded-b-none"}
            search={search}
            onChange={value => setSearch(typeof value === "string" ? value : value.target.value)}
          />
          <CardTitle className={cn("text-xl mt-5")}>Container:</CardTitle>
        </CardHeader>
        <CardContent className={"flex flex-col flex-grow h-2/3 sm:h-full justify-center items-center"}>
          {data.length === 0 && <p>Keine Container mit Sensor gefunden.</p>}
          <ScrollArea className={"h-full w-auto mt-0 rounded-md"}>
            {isLoading ? (
              <SkeletonContainer />
            ) : (
              data
                .filter(c => c.sensor)
                .map((container: Container) => (
                  <ContainerPanel
                    className={""}
                    setSelectedContainer={setSelectedContainer}
                    setHoverContainer={setHoverContainer}
                    key={container.id}
                    container={container}
                  />
                ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
