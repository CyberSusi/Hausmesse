import LandingPageComponent from "@/components/landing-page/LandingPageComponent.tsx"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {

  return (
      <div>
        <LandingPageComponent/>
      </div>
  );
}
