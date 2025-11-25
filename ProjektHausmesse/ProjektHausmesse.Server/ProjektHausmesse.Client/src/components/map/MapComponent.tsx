import PopupChart from "@/components/map/PopupChart.tsx"
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx"
import { cn } from "@/lib/utils.ts"
import { Container } from "@/models/Container.ts"
import type { LatLngExpression, Map as LeafletMap } from "leaflet"
import L from "leaflet"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import "leaflet/dist/leaflet.css"
import React, { useEffect, useRef } from "react"
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet"

interface MapComponentProps {
  containers: Container[]
  hoverContainer: Container | null
  selectedContainer: Container | null
  setSelectedContainer: (container: Container | null) => void
  center?: LatLngExpression
  className?: string
}

const freiburg: LatLngExpression = [47.999008, 7.842104]
const defaultZoom: number = 13
const searchZoom: number = 16

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -30],
  shadowSize: [41, 41],
})

const activeIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [30, 51],
  iconAnchor: [17, 51],
  popupAnchor: [1, -30],
  shadowSize: [51, 51],
})

function MapUpdater({ center }: { center?: LatLngExpression }) {
  const map: LeafletMap = useMap()

  useEffect(() => {
    if (center) {
      map.setView(center, searchZoom)
    }
  }, [center, map])

  return null
}

const MapComponent: React.FC<MapComponentProps> = ({
  containers,
  hoverContainer,
  selectedContainer,
  setSelectedContainer,
  center,
  className,
}) => {
  const markerRefs = useRef<Record<string, L.Marker | null>>({})

  useEffect(() => {
    if (selectedContainer && markerRefs.current[selectedContainer.id.toString()]) {
      markerRefs.current[selectedContainer.id.toString()]?.openPopup()
    }
  }, [selectedContainer])

  function getCapacity(container: Container): number {
    return (container.sensor.curDistance / container.sensor.maxDistance) * 100
  }
  return (
    <MapContainer center={center || freiburg} zoom={defaultZoom} className={cn(className, "h-full rounded-md")}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater center={center} />
      {containers.map((container: Container) => (
        <Marker
          key={container.id}
          ref={el => {
            markerRefs.current[container.id.toString()] = el
          }}
          eventHandlers={{
            popupclose: () => {
              setSelectedContainer(null)
            },
          }}
          icon={hoverContainer?.id === container.id ? activeIcon : defaultIcon}
          position={[container.position.latitude, container.position.longitude]}>
          <Popup maxWidth={500} minWidth={245}>
            <Card className={"border-none shadow-none w-56 sm:w-96"}>
              <CardHeader className={"p-0"}>
                <h1 className={"text-xl mb-0 font-semibold"}>Container Details</h1>
              </CardHeader>
              <CardContent className={" !px-2 flex flex-col justify-start"}>
                <h1 className={"font-semibold"}>
                  Standort: <span className={"font-normal"}>{container.name}</span>
                </h1>
                <h1 className={"font-semibold"}>
                  Füllstand: <span className={"font-normal"}> {getCapacity(container).toFixed(0)} %</span>
                </h1>
                <PopupChart container={container} />
              </CardContent>
            </Card>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapComponent
