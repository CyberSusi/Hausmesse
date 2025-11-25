import { ContainerTimeSeriesChart } from "@/components/charts/ContainerTimeSeriesChart.tsx"
import { ContainerAdminForm } from "@/components/forms/admin/ContainerAdminForm.tsx"
import { SensorAdminForm } from "@/components/forms/admin/SensorAdminForm.tsx"
import { UserManagement } from "@/components/forms/admin/UserManagement.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Cpu, Package, Users } from "lucide-react"

export function AdminPanelComponent() {
  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-8 mt-4">
        <h1 className="text-3xl font-bold">Admin-Bereich</h1>
        <p className="text-muted-foreground">Verwalten Sie Container, Sensoren & Benutzer</p>
      </div>

      <Tabs defaultValue="containers" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="containers">
            <Package />
            <span className="hidden sm:inline">Container</span>
          </TabsTrigger>
          <TabsTrigger value="sensors">
            <Cpu />
            <span className="hidden sm:inline">Sensoren</span>
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 />
            <span className="hidden sm:inline">Statistiken</span>
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users />
            <span className="hidden sm:inline">Benutzer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="containers">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Container-Verwaltung</CardTitle>
              <CardDescription>Erstellen, aktualisieren oder löschen Sie Container.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ContainerAdminForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sensors">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Sensor-Verwaltung</CardTitle>
              <CardDescription>Erstellen, aktualisieren oder löschen Sie Sensoren.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <SensorAdminForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Statistiken</CardTitle>
              <CardDescription>Statistiken und Analysen</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ContainerTimeSeriesChart containers={[]} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Benutzer</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
