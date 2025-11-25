import { backendService } from "@/api/backendService.ts"
import { AlertComponent } from "@/components/common/AlertComponent.tsx"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Container } from "@/models/Container.ts"
import { ContainerFormDTO } from "@/models/dto/ContainerFormDTO.ts"
import { Sensor } from "@/models/Sensor.ts"
import { Mode } from "@/types/mode.ts"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AddressSearchComponent } from "@/components/common/AddressSearchComponent.tsx"

export interface ContainerFormValues {
  name: string
  latitude: number
  longitude: number
  sensorId: string
}

const defaultFormValues: ContainerFormValues = {
  name: "",
  latitude: 0,
  longitude: 0,
  sensorId: "",
}

export function ContainerAdminForm() {

  const [containers, setContainers] = useState<Container[]>([])
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>(Mode.Create)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<ContainerFormValues>({ defaultValues: defaultFormValues })

  const loadContainers: () => Promise<void> = useCallback(async () => {
    setIsLoading(true)
    try {
      const data: Container[] = await backendService.getAllContainers()
      setContainers(data)
    } catch (error: any) {
      toast.error(`Fehler beim Laden der Container: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect((): void => {
    void loadContainers()
    backendService
      .getAllSensors()
      .then(setSensors)
      .catch(err => toast.error(`Fehler beim Laden der Sensoren: ${err.message}`))
  }, [loadContainers])

  useEffect(() => {
    if (!selectedId) {
      form.reset(defaultFormValues)
      return
    }
    const selectedItem: Container | undefined = containers.find(container => container.id.toString() === selectedId)
    if (selectedItem) {
      form.reset({
        name: selectedItem.name,
        latitude: selectedItem.position.latitude,
        longitude: selectedItem.position.longitude,
        sensorId: selectedItem.sensor.id.toString(),
      })
    }
  }, [selectedId, containers, form])

  useEffect((): void => {
    if (mode === Mode.Create) {
      setSelectedId(null)
      form.reset(defaultFormValues)
    }
  }, [mode, form])

  const handleFormSubmit = async (data: ContainerFormValues) => {
    if (mode === Mode.Delete) return
    setIsLoading(true)
    const dto: ContainerFormDTO = {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      sensorId: parseInt(data.sensorId),
    }

    try {
      if (mode === Mode.Update && selectedId) {
        await backendService.updateContainer(parseInt(selectedId), dto)
        toast.success("Container erfolgreich aktualisiert.")
      } else {
        await backendService.createContainer(dto)
        toast.success("Container erfolgreich erstellt.")
        setMode(Mode.Create)
      }
      await loadContainers()
    } catch (error: any) {
      toast.error(`Fehler beim Speichern des Containers: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete: () => Promise<void> = async () => {
    if (!selectedId) return
    setIsLoading(true)
    try {
      await backendService.deleteContainer(parseInt(selectedId))
      toast.success("Container erfolgreich gelöscht.")
      await loadContainers()
      setMode(Mode.Create)
    } catch (error: any) {
      toast.error(`Fehler beim Löschen des Containers: ${error.message}`)
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
              <Label>Container auswählen</Label>
              <Select value={selectedId ?? ""} onValueChange={setSelectedId}>
                <SelectTrigger>
                  <SelectValue placeholder="-- Container auswählen --" />
                </SelectTrigger>
                <SelectContent>
                  {containers.map(item => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-6 pt-4 border-t">
          <div className="space-y-2">
            <Label htmlFor="address-search">Adresssuche</Label>
            <AddressSearchComponent
              onCoordinatesFound={(latitude, longitude) => {
                form.setValue("latitude", latitude, { shouldDirty: true })
                form.setValue("longitude", longitude, { shouldDirty: true })
              }}
              disabled={isLoading || mode === Mode.Delete}
            />
          </div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isLoading || mode === Mode.Delete} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breitengrad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading || mode === Mode.Delete}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Längengrad</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="any"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    disabled={isLoading || mode === Mode.Delete}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sensorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading || mode === Mode.Delete}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sensor auswählen..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sensors.map(sensor => (
                      <SelectItem key={sensor.id} value={sensor.id.toString()}>
                        {sensor.name ?? sensor.hardwareId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <div className="pt-4">
          {mode === Mode.Delete ? (
            <AlertComponent
              onConfirm={handleDelete}
              title="Container löschen?"
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
              {isLoading
                ? "Wird gespeichert..."
                : mode === Mode.Create
                  ? "Container erstellen"
                  : "Container aktualisieren"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
