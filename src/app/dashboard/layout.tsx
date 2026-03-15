import Link from "next/link";
import { 
  Briefcase, 
  Users, 
  Building2, 
  Crosshair, 
  Send, 
  DollarSign, 
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 p-4 flex flex-col gap-2 relative">
        <h2 className="text-xl font-bold mb-6 px-4">Quantum Aurora</h2>
        
        <nav className="flex flex-col gap-1 flex-1 text-sm font-medium">
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard"><Briefcase className="w-4 h-4" /> Overview</Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard/jobs"><Briefcase className="w-4 h-4" /> Jobs / Campaigns</Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard/candidates"><Users className="w-4 h-4" /> Candidates</Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard/clients"><Building2 className="w-4 h-4" /> Clients</Link>
          </Button>
          
          <div className="my-4 border-t opacity-50" />
          
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard/poaching"><Crosshair className="w-4 h-4" /> Poaching Base</Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard/outreach"><Send className="w-4 h-4" /> Outreach</Link>
          </Button>
          <Button variant="ghost" className="justify-start gap-3" asChild>
            <Link href="/dashboard/placements"><DollarSign className="w-4 h-4" /> Placements</Link>
          </Button>
        </nav>
        
        <Button variant="ghost" className="justify-start gap-3 mt-auto" asChild>
            <Link href="/dashboard/settings"><Settings className="w-4 h-4" /> Settings</Link>
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
