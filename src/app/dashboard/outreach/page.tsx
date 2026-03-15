import { db } from "@/lib/db";
import { outreachLog, candidates, jobs } from "@/drizzle/schema";
import { eq, isNotNull, asc } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, AlertCircle } from "lucide-react";

async function getFollowUps() {
   // In a real query, we would filter for followUpDueAt <= NOW() and !followUpDone
   return db.select({
     id: outreachLog.id,
     channel: outreachLog.channel,
     dueDate: outreachLog.followUpDueAt,
     candidateName: candidates.fullName,
     currentCompany: candidates.currentCompany,
     jobTitle: jobs.title,
   })
   .from(outreachLog)
   .leftJoin(candidates, eq(outreachLog.candidateId, candidates.id))
   .leftJoin(jobs, eq(outreachLog.jobId, jobs.id))
   .where(eq(outreachLog.followUpDone, false))
   .orderBy(asc(outreachLog.followUpDueAt));
}

export default async function OutreachPage() {
  const followUps = await getFollowUps();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Outreach & Follow-ups</h1>

      <Card className="mb-8 border-destructive/20 outline-destructive/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive"/> 
            Urgent Follow-ups Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
           {followUps.length === 0 ? (
             <div className="text-muted-foreground text-sm italic">You are all caught up on follow-ups!</div>
           ) : (
             <div className="grid gap-4">
                {followUps.map(f => (
                   <div key={f.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/10 hover:bg-muted/30 transition-colors">
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                           {f.candidateName} 
                           <Badge variant="outline" className="text-xs">{f.channel}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                           {f.currentCompany} &bull; Sourced for: {f.jobTitle || "General Pipeline"}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="text-sm font-medium text-destructive">
                           Due: {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : 'Overdue'}
                         </div>
                         <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                           <CheckCircle2 className="w-4 h-4 mr-1"/> Mark Done
                         </Button>
                      </div>
                   </div>
                ))}
             </div>
           )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Outreach Templates Library</h2>
        <div className="border rounded-lg bg-muted/10 p-12 text-center text-muted-foreground">
          Templates CRUD interface goes here...
        </div>
      </div>
    </div>
  );
}
