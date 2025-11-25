import { Outlet, createRootRoute } from "@tanstack/react-router"
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/layout/navbar.tsx"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <div className="overflow-y-scroll">
        <Navbar />
        <div className="max-w-9xl max-h-fit px-5 flex flex-col justify-center items-center">
          <Outlet />
        </div>
      </div>
      <Toaster position="top-right" />
    </>
  )
}
