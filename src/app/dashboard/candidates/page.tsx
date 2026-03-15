import { getCandidates } from "@/lib/actions/candidates";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CandidatesPage() {
  const allCandidates = await getCandidates();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Candidates Database</h1>
        <Button asChild>
          <Link href="/dashboard/candidates/new">Add Candidate</Link>
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Fit Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCandidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No candidates found.
                </TableCell>
              </TableRow>
            ) : (
              allCandidates.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.fullName}</TableCell>
                  <TableCell>
                    {c.currentTitle} <span className="text-muted-foreground">at</span> {c.currentCompany}
                  </TableCell>
                  <TableCell>{c.location || "Unknown"}</TableCell>
                  <TableCell>{c.source}</TableCell>
                  <TableCell>
                    {c.fitScore ? (
                       <Badge variant={c.fitScore >= 8 ? "default" : c.fitScore >= 5 ? "secondary" : "destructive"}>
                        {c.fitScore}/10
                      </Badge>
                    ) : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/candidates/${c.id}`}>View Profile</Link>
                    </Button>
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
