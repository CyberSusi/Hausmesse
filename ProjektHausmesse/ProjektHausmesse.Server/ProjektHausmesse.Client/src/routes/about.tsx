import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="w-full max-w-6xl mx-auto px-6 py-8 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            {/* Left: image panel with rounded corners (will stretch to match right column height) */}
            <div className="w-full rounded-xl overflow-hidden shadow-lg h-full">
              <div
                className="w-full h-full bg-center bg-cover"
                style={{ backgroundImage: "url('/glasses.jpg')" }}
              />
            </div>
            {/* Right: stacked text boxes with transparent green background and white text */}
            <div className="flex flex-col gap-3 h-full">
              <div className="bg-green-700/80 text-white rounded-xl p-6 shadow-md">
                <div className="text-left">
                  <h1 className="text-3xl font-bold mb-4">Unsere Idee</h1>
                  <p className="text-base text-white/80">
                    Wir sind eine kleine Gruppe von Schülern, die sich einer echten Challenge gestellt haben: <strong className="font-bold">volle Altglascontainer</strong> in unserer Stadt rechtzeitig erkennen und sinnvoll handeln.<br/>
                    Gläser stapeln sich, sammeln sich zu unübersichtlichen Haufen und können zu einer unschönen und potenziell <strong className="font-bold">gefährlichen Situation </strong>führen.<br/>
                    Aus der Idee entstand unser Projekt: eine Anwendung, die genau dieses Problem adressiert.<br/>
                    Mit unserem Sensor messen wir den Füllstand der Containern und übermitteln die Werte direkt an die App.<br/>
                    <span className="font-semibold">So bleiben Container sauber, zugänglich und sicher!</span>
                  </p>
                </div>
              </div>

              <div className="bg-green-700/80 text-white rounded-xl p-6 shadow-md">
              <div className="text-right">
                <h1 className="text-3xl font-bold mb-4">Unsere Motivation</h1>
                <p className="text-base text-white/80">
                  Unsere Mission ist es, <span className="font-semibold">Alltagsprobleme</span> durch <strong className="font-bold">einfache, praktikable Technologie</strong> greifbar zu machen.<br/>
                  Dabei legen wir Wert auf Transparenz, Zusammenarbeit und Lernbereitschaft. Die Sensoren liefern verlässliche Daten, die Nutzerinnen und Nutzer in Echtzeit sehen können, wodurch sich Abholungen besser planen lassen.<br/>
                </p>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <footer className="w-full">
        <div className="max-w-6xl mx-auto px-6 pb-8">
          <p className="text-center italic text-black/90 text-sm">
            Wir hoffen, dass unser Projekt Nachahmer findet und zeigt,<br/> wie engagierte Schüler*innen mit Kreativität und Teamgeist positive Veränderungen in der Community bewirken können.<br/>
            Vielen Dank fürs Vorbeischauen!
          </p>
        </div>
      </footer>
    </div>
  )
}
