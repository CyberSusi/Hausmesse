import { createFileRoute, redirect } from "@tanstack/react-router"
import { AdminPanelComponent } from "@/components/forms/admin/AdminPanelComponent.tsx"
import { AuthService } from "@/api/authService.ts"

export const Route = createFileRoute("/admin")({
  component: Admin,
  beforeLoad: async () => {
    if (!await AuthService.isAdmin()) {
      throw redirect({ to: "/login" })
    }
  },
})

function Admin() {
  return <AdminPanelComponent></AdminPanelComponent>
}