"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import ContainerMultiSelect from "./ContainerMultiSelect.tsx"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart.tsx"
import { Button } from "@/components/ui/button.tsx"
import { Container } from "@/models/Container.ts"

interface ContainerTimeSeriesChartProps {
  containers: Container[]
}

export function ContainerTimeSeriesChart({ containers }: ContainerTimeSeriesChartProps) {
  const [chartData, setChartData] = useState<any[]>([])
  const [chartConfig, setChartConfig] = useState<ChartConfig>({})
  const [selectedContainerIds, setSelectedContainerIds] = useState<number[]>([])

  useEffect(() => {
    processData(containers, selectedContainerIds)
  }, [containers, selectedContainerIds])

  const processData = (containers: Container[], filterIds: number[]) => {
    const filteredContainers = containers.filter(container => filterIds.includes(container.id))

    const allMeasurements: Array<{
      date: Date
      distance: number
      containerId: number
      containerName: string
    }> = []

    filteredContainers.forEach(container => {
      container.sensor.measurements.forEach(measurement => {
        allMeasurements.push({
          date: new Date(measurement.date),
          distance: measurement.distance,
          containerId: container.id,
          containerName: container.name,
        })
      })
    })

    const groupedByDate = allMeasurements.reduce(
      (acc, item) => {
        const dateKey = item.date.toISOString().split("T")[0]

        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey }
        }

        acc[dateKey][`container-${item.containerId}`] = item.distance

        return acc
      },
      {} as Record<string, any>,
    )

    const processedData = Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    setChartData(processedData)

    const config: ChartConfig = {}
    filteredContainers.forEach((container, index) => {
      config[`container-${container.id}`] = {
        label: container.name,
        color: `var(--chart-${(index % 5) + 1})`,
      }
    })

    setChartConfig(config)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Container auswählen:</label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedContainerIds([])}
            disabled={selectedContainerIds.length === 0}
          >
            Alle abwählen
          </Button>
        </div>
        <ContainerMultiSelect
          containers={containers}
          selectedContainerIds={selectedContainerIds}
          onSelectionChange={setSelectedContainerIds}
        />
      </div>

      <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
        <LineChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            domain={["dataMin", "dataMax"]}
            width={80}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend content={<ChartLegendContent />} />

          {Object.keys(chartConfig).map(containerKey => (
            <Line
              key={containerKey}
              dataKey={containerKey}
              type="monotone"
              stroke={`var(--color-${containerKey})`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ChartContainer>
      {selectedContainerIds.length === 0 && (
        <div className="flex items-center justify-center h-full -mt-48 text-muted-foreground">
          Bitte wählen Sie mindestens einen Container aus, um die Daten anzuzeigen.
        </div>
      )}
    </div>
  )
}