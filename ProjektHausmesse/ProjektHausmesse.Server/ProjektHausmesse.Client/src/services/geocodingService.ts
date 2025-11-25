import { Position } from "@/models/Position.ts"

const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search"

class GeocodingService {
  public async search(address: string): Promise<Position | null> {
    if (!address.trim()) {
      return null
    }

    const url = `${NOMINATIM_API_URL}?format=json&q=${encodeURIComponent(address)}`

    try {
      const response: Response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Network response was not ok, status: ${response.status}`)
      }

      const data: any = await response.json()

      if (data && data.length > 0) {
        const location = data[0]
        return {
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        }
      }

      return null
    } catch (error) {
      console.error("Geocoding service error:", error)
      return null
    }
  }
}

export const geocodingService = new GeocodingService()
