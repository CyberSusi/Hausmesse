import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"


export default function Navbar() {
  return (
    <NavigationMenu aria-label="Main navigation" className="w-full px-6 bg-green-700/80 border-b text-white ">
      <a href="/" aria-label="Home" className="inline-flex items-center !no-underline !hover:no-underline !focus:no-underline">
        <img src="/logonobg.png" alt="Altglas Radar Logo" className="h-10 w-auto"  />
      </a>
        <NavigationMenuList className="flex space-x-8 p-4">
           <NavigationMenuItem>
            <a href="/dashboard" className="!no-underline !focus:no-underline !hover:no-underline !visited:no-underline">Karte</a>
          </NavigationMenuItem>
           <NavigationMenuItem>
            <a href="/login" className="!no-underline !focus:no-underline !hover:no-underline !visited:no-underline">Admin</a>
          </NavigationMenuItem>
           <NavigationMenuItem>
            <a href="/about" className="!no-underline !focus:no-underline !hover:no-underline !visited:no-underline">Über uns</a>
          </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
  );
}