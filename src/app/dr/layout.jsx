import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { AlertTriangle,Info,Search } from "lucide-react";

export default function DrLayout({ children }) {
  return (
    <div className="flex h-screen">

      
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="m-4">☰ Menu</Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-6 ">
          <SheetTitle className="text-xl font-bold mb-6">DR Dashboard</SheetTitle>
          <ul className="space-y-4">
            <li>
              <Link href="/dr/ptidinp" className="flex items-center gap-2 text-black hover:text-gray-700 text-xl hover:scale-105">
                <Search size={20} /> Patient ID Input
              </Link>
            </li>
            
            <li>
              <Link href="/dr/ptinfoDash" className="flex items-center gap-2 text-black hover:text-gray-700 text-xl hover:scale-105">
                <Info size={20} /> Patient Information
              </Link>
            </li>
            <li>
              <Link href="/dr/emergency" className="flex items-center gap-2 text-red-700 hover:text-red-500 text-xl hover:scale-105">
                <AlertTriangle size={20} /> Emergency Info
              </Link>
            </li>
          </ul>
        </SheetContent>
      </Sheet>

      
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
