import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import MapComponent from "@/components/map/MapComponent.tsx"
import { useNavigate } from "@tanstack/react-router"

const LandingPageComponent = () => {
  const navigate = useNavigate();

  const handleFindContainer = () => {
    void navigate({ to: '/dashboard' });
  };

  const handleDemo = () => {
    window.open('', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden">
      <div className="max-w-screen-xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 px-6 py-12 lg:py-0">
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <h1 className="mt-6 max-w-[17ch] text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">
            Freiburg Altglas Radar
          </h1>
          <p className="mt-6 max-w-[60ch] text-base sm:text-lg">
            Finde innerhalb von Sekunden in Freiburg den nächsten leeren Altglascontainer.
            Schnell und einfach, ohne lange Suche. Probiere es jetzt aus!
          </p>
          <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button size="lg" className="rounded-full text-sm sm:text-base" onClick={handleFindContainer}>
              Finde jetzt einen leeren Container <ArrowUpRight className="!h-5 !w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-sm sm:text-base shadow-none"
              onClick={handleDemo}>
              <CirclePlay className="!h-5 !w-5" />Demo
            </Button>
          </div>
        </div>
        <div className="w-full h-64 sm:h-80 lg:h-96 xl:h-[500px] order-1 lg:order-2">
          <MapComponent containers={[]} />
        </div>
      </div>
    </div>
  );
};

export default LandingPageComponent;