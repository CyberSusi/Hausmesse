import { backendService } from "@/api/backendService.ts"
import { Skeleton } from "@/components/ui/skeleton.tsx"
import { Container } from "@/models/Container.ts"
import { useQuery } from "@tanstack/react-query"
import React from "react"
import { CartesianGrid, Label, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface PopupChartProps {
  container: Container
}

async function fetchMeasurements(containerId: number) {
  return await backendService.getAllMeasurementsByContainerId(containerId)
}

const PopupChart: React.FC<PopupChartProps> = ({ container }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["containerId", container.id],
    queryFn: () => fetchMeasurements(container.id),
    initialData: [],
  })

  const chartData = data.map(measurement => ({
    date: new Date(measurement.date).toLocaleDateString(),
    time: new Date(measurement.date).toTimeString().substring(0, 9),
    distance: measurement.distance,
    fillLevel: ((container.sensor.curDistance / container.sensor.maxDistance) * 100).toFixed(1),
  }))

  return (
    <div className={"w-56 sm:w-96 h-56 mt-5"}>
      <h1 className={"mb-3 font-semibold"}>Tag: <span className={"font-normal"}> {chartData[0]?.date}</span></h1>
      <ResponsiveContainer width="100%" height="100%">
        {isLoading ? (
          <Skeleton />
        ) : (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" fontSize={10} angle={-45} textAnchor="end" height={90}>
              <Label value={"Uhrzeit"} position={"insideBottom"} offset={30}/>
            </XAxis>
            <YAxis width={32} fontSize={10}>
              <Label value={"Füllstand in %"} angle={-90} offset={10} position={"insideBottomLeft"} />
            </YAxis>
            <Tooltip
              formatter={(value, name) => [
                name === "distance" ? `${value}cm` : `${value}%`,
                name === "distance" ? "Distance" : "Fill Level",
              ]}
            />
            <Line type="monotone" dataKey="distance" stroke="#000" strokeWidth={1} dot={{ r: 2 }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default PopupChart
