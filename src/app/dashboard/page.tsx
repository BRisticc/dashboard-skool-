import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Building, AlertCircle } from "lucide-react";

export default function DashboardOverviewPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Platform Overview</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,024</div>
            <p className="text-xs text-muted-foreground mt-1">Sourced across 12 jobs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 text-destructive">
            <CardTitle className="text-sm font-medium text-destructive">Action Needed</CardTitle>
            <AlertCircle className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">7</div>
            <p className="text-xs text-destructive mt-1">Follow-ups overdue</p>
          </CardContent>
        </Card>
      </div>
      
      {/* 
        This is where Probation countdown and Followup feed components go 
        according to the spec.
       */}
       <div className="h-64 border rounded-lg bg-muted/20 flex items-center justify-center text-muted-foreground w-full">
         Platform widgets to be implemented (Probation Tracker / Follow-ups)
       </div>
    </div>
  );
}
