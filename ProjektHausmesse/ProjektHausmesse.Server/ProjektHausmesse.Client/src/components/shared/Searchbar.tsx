import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils.ts"
import { useQuery } from "@tanstack/react-query"
import { ComponentProps, useState } from "react"
import { csvReaderService } from "@/services/csvReaderService.ts"

type SearchbarProps = ComponentProps<"input"> & {
  search: string
  onChange: (value: any) => void
}

const FREIBURG_STREET_NAMES_CSV = "/standorteInFreiburg.csv"

async function fetchSuggestions(query: string): Promise<string[]> {
  if (!query) return []
  // implement API request to service like google or something similar
  const streetNamesInFreiburg = await csvReaderService.getStreetNames(FREIBURG_STREET_NAMES_CSV);
  const uniqueStreetNames = [...new Set(streetNamesInFreiburg)];
  return uniqueStreetNames.filter(street => street.toLowerCase().includes(query.toLowerCase()))
}

export default function Searchbar({ className, onChange, search }: SearchbarProps) {
  const [showSuggestions, setShowSuggestions] = useState(true)
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["searchSuggestions", search],
    queryFn: () => fetchSuggestions(search),
    enabled: showSuggestions,
    initialData: [],
  })

  function selectSuggestion(suggestion: string): void {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  function handleInputChange(search: string) {
    if (!showSuggestions) {
      setShowSuggestions(true)
    }
    onChange(search)
  }

  return (
    <div>
      <Command className="relative bg-accent focus-within:ring-2 focus-within:ring-green-500 overflow-visible rounded-b-none rounded-t-md">
        <CommandInput
          value={search}
          onValueChange={handleInputChange}
          className={cn(className, "w-full mb-0")}
          placeholder={"Search for a street."}
        />
        {search.length > 0 && showSuggestions && (
          <CommandList className={"absolute top-10 w-full z-10 text-black backdrop-blur-2xl rounded-b-md"}>
            {isLoading && <CommandItem disabled>Laden...</CommandItem>}
            <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
            {suggestions.map((suggestion, index) => (
              <CommandItem
                key={index}
                onSelect={() => selectSuggestion(suggestion)}
                className={"m-2 ring-amber-500 cursor-pointer hover:bg-gray-100"}>
                {suggestion}
              </CommandItem>
            ))}
          </CommandList>
        )}
      </Command>
    </div>
  )
}
