import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { geocodingService } from "@/services/geocodingService.ts"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface AddressSearchProps {
  onCoordinatesFound: (latitude: number, longitude: number) => void
  disabled?: boolean
  placeholder?: string
}

export function AddressSearchComponent({ onCoordinatesFound, disabled = false, placeholder = "Friedrichstraße 51, 79098 Freiburg im Breisgau" }: AddressSearchProps) {
  const [addressQuery, setAddressQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      void searchAddress()
    }
  }

  const searchAddress = async (): Promise<void> => {
    if (!addressQuery.trim()) return
    setIsSearching(true)
    try {
      const coordinates = await geocodingService.search(addressQuery)
      if (coordinates) {
        onCoordinatesFound(coordinates.latitude, coordinates.longitude)
        toast.success("Koordinaten gefunden und aktualisiert.")
      } else {
        toast.error("Kein Ort für diese Adresse gefunden.")
      }
    } catch (error) {
      toast.error("Fehler bei der Adresssuche.")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Input
          id="address-search"
          placeholder={placeholder}
          value={addressQuery}
          onChange={e => setAddressQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isSearching}
        />
        <Button
          type="button"
          onClick={searchAddress}
          disabled={disabled || isSearching || !addressQuery.trim()}>
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Suchen"}
        </Button>
      </div>
    </div>
  )
}
