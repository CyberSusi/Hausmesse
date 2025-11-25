import { Position } from "@/models/Position.ts"
import { Sensor } from "@/models/Sensor.ts"

export interface Container {
  id: number
  name: string
  capacity: number
  position: Position
  sensor: Sensor
}
