import { db } from "@/lib/db";
import { placements, jobs, candidates, clients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function getPlacements() {
  return db.select({
    id: placements.id,
    signedDate: placements.signedDate,
    probationEndDate: placements.probationEndDate,
    totalFee: placements.totalFee,
    currency: placements.currency,
    jobTitle: jobs.title,
    candidateName: candidates.fullName,
    clientName: clients.name,
    invoiceUpfrontPaid: placements.invoiceUpfrontPaid,
    invoiceFinalPaid: placements.invoiceFinalPaid,
  })
  .from(placements)
  .leftJoin(jobs, eq(placements.jobId, jobs.id))
  .leftJoin(candidates, eq(placements.candidateId, candidates.id))
  .leftJoin(clients, eq(placements.clientId, clients.id));
}

export default async function PlacementsPage() {
  const allPlacements = await getPlacements();
  
  // Fake calculation for widget (In real app, filter where probationEndDate - current_date <= 30)
  const risks = allPlacements.filter(p => !p.invoiceFinalPaid);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Placements & Invoicing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <Card className="bg-destructive/10 border-destructive/20">
           <CardHeader className="pb-2">
             <CardTitle className="text-sm font-medium text-destructive">Probation Risks (&lt; 30 Days)</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold text-destructive">{risks.length}</div>
             <p className="text-xs mt-1 text-destructive/80">Candidates nearing probation end</p>
           </CardContent>
         </Card>
      </div>

      <div className="border rounded-md">
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role & Client</TableHead>
              <TableHead>Signed Date</TableHead>
              <TableHead>Probation Ends</TableHead>
              <TableHead>Total Fee</TableHead>
              <TableHead>Invoices (Upfront / Final)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allPlacements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No placements recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              allPlacements.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.candidateName}</TableCell>
                  <TableCell>
                    {p.jobTitle} <br/>
                    <span className="text-muted-foreground text-xs">{p.clientName}</span>
                  </TableCell>
                  <TableCell>{p.signedDate}</TableCell>
                  <TableCell>
                    {/* Simplified calculation format */}
                    <span className="font-medium">{p.probationEndDate}</span>
                  </TableCell>
                  <TableCell>{p.totalFee ? `${p.totalFee} ${p.currency || 'USD'}` : "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       <Badge variant={p.invoiceUpfrontPaid ? "default" : "secondary"}>
                         U: {p.invoiceUpfrontPaid ? "Paid" : "Pending"}
                       </Badge>
                       <Badge variant={p.invoiceFinalPaid ? "default" : "secondary"}>
                         F: {p.invoiceFinalPaid ? "Paid" : "Pending"}
                       </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
