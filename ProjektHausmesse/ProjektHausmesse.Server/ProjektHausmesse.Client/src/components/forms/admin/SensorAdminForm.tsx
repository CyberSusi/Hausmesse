import { backendService } from "@/api/backendService.ts"
import { AlertComponent } from "@/components/common/AlertComponent.tsx"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Container } from "@/models/Container.ts"
import { SensorFormDTO } from "@/models/dto/SensorFormDTO.ts"
import { Sensor } from "@/models/Sensor.ts"
import { Mode } from "@/types/mode.ts"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export interface SensorFormValues {
  name: string
  hardwareId: string
  containerId: string
  curDistance: number
  maxDistance: number
}

const defaultFormValues: SensorFormValues = {
  name: "",
  hardwareId: "",
  containerId: "",
  curDistance: 0,
  maxDistance: 0,
}

export function SensorAdminForm() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [containers, setContainers] = useState<Container[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>(Mode.Create)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<SensorFormValues>({ defaultValues: defaultFormValues })

  const loadSensors: () => Promise<void> = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await backendService.getAllSensors()
      setSensors(data)
    } catch (error: any) {
      toast.error(`Fehler beim Laden der Sensoren: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect((): void => {
    void loadSensors()
    backendService
      .getAllContainers()
      .then(setContainers)
      .catch(err => toast.error(`Fehler beim Laden der Container: ${err.message}`))
  }, [loadSensors])

  useEffect((): void => {
    if (!selectedId) {
      form.reset(defaultFormValues)
      return
    }
    const selectedItem: Sensor | undefined = sensors.find(sensor => sensor.id.toString() === selectedId)
    if (selectedItem) {
      form.reset({
        name: selectedItem.name ?? "",
        hardwareId: selectedItem.hardwareId,
        containerId: selectedItem.containerId?.toString() ?? "",
        curDistance: selectedItem.curDistance ?? 0,
        maxDistance: selectedItem.maxDistance ?? 0,
      })
    }
  }, [selectedId, sensors, form])

  useEffect(() => {
    if (mode === Mode.Create) {
      setSelectedId(null)
      form.reset(defaultFormValues)
    }
  }, [mode, form])

  const handleFormSubmit = async (data: SensorFormValues) => {
    if (mode === Mode.Delete) return
    setIsLoading(true)
    const dto: SensorFormDTO = {
      ...data,
      name: data.name,
      containerId: parseInt(data.containerId),
    }

    try {
      if (mode === Mode.Update && selectedId) {
        await backendService.updateSensor(parseInt(selectedId), dto)
        toast.success("Sensor erfolgreich aktualisiert.")
      } else {
        await backendService.createSensor(dto)
        toast.success("Sensor erfolgreich erstellt.")
        setMode(Mode.Create)
      }
      await loadSensors()
    } catch (error: any) {
      toast.error(`Fehler beim Speichern des Sensors: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    setIsLoading(true)
    try {
      await backendService.deleteSensor(parseInt(selectedId))
      toast.success("Sensor erfolgreich gelöscht.")
      await loadSensors()
      setMode(Mode.Create)
    } catch (error: any) {
      toast.error(`Fehler beim Löschen des Sensors: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Aktion</Label>
            <Select value={mode} onValueChange={value => setMode(value as Mode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Mode.Create}>Erstellen</SelectItem>
                <SelectItem value={Mode.Update}>Aktualisieren</SelectItem>
                <SelectItem value={Mode.Delete}>Löschen</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(mode === Mode.Update || mode === Mode.Delete) && (
            <div className="space-y-2">
              <Label>Sensor auswählen</Label>
              <Select value={selectedId ?? ""} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Sensor auswählen --" />
                </SelectTrigger>
                <SelectContent>
                  {sensors.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name ?? item.hardwareId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensorname</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading || mode === Mode.Delete} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hardwareId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hardware-ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading || mode === Mode.Delete} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="containerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Container zuweisen</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || mode === Mode.Delete}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Container auswählen..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {containers.map(container => (
                      <SelectItem key={container.id} value={container.id.toString()}>
                        {container.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max. Distanz</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={event => field.onChange(parseFloat(event.target.value) || 0)}
                    disabled={isLoading || mode === Mode.Delete}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="curDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aktuelle Distanz</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={event => field.onChange(parseFloat(event.target.value) || 0)}
                    disabled={isLoading || mode === Mode.Delete}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          {mode === Mode.Delete ? (
            <AlertComponent
              onConfirm={handleDelete}
              title="Sensor löschen?"
              description="Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden.">
              <Button type="button" variant="destructive" className="w-full" disabled={isLoading || !selectedId}>
                {isLoading ? "Wird gelöscht..." : "Löschung bestätigen"}
              </Button>
            </AlertComponent>
          ) : (
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading || (mode === Mode.Update && !form.formState.isDirty) || (mode === Mode.Update && !selectedId)
              }>
              {isLoading ? "Wird gespeichert..." : mode === Mode.Create ? "Sensor erstellen" : "Sensor aktualisieren"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
