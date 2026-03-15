import { getPoachingCompanies } from "@/lib/actions/poaching";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExternalLink, Crosshair } from "lucide-react";

export default async function PoachingBasePage() {
  const companies = await getPoachingCompanies();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Crosshair className="w-8 h-8"/> Poaching Base
          </h1>
          <p className="text-muted-foreground mt-1">Intelligence on target companies for active hiring campaigns.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/poaching/companies/new">Add Target Company</Link>
        </Button>
      </div>

      <div className="border rounded-md">
         <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>LinkedIn</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Signals</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No poaching companies added yet.
                </TableCell>
              </TableRow>
            ) : (
              companies.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.companyName}</TableCell>
                  <TableCell>
                    <a href={c.linkedinCompanyUrl} target="_blank" className="flex items-center gap-1 text-blue-500 hover:underline">
                      View <ExternalLink className="w-3 h-3"/>
                    </a>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.qualityTier === 1 ? "default" : c.qualityTier === 2 ? "secondary" : "outline"}>
                      Tier {c.qualityTier || "?"}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.industry || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                       {c.hadRecentLayoffs && <Badge variant="destructive" className="text-[10px]">Recent Layoffs</Badge>}
                       {(c.avgTenureMonths || 0) >= 18 && <Badge className="bg-orange-500 hover:bg-orange-600 text-[10px]">Prime Timing</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                       <Link href={`/dashboard/poaching/companies/${c.id}`}>Details</Link>
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
