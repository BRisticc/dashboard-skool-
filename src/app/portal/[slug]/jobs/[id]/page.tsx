import { getClientVisibleCandidates } from "@/lib/actions/portal";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default async function PortalJobPage({ params }: { params: { slug: string, id: string } }) {
  const visibleCandidates = await getClientVisibleCandidates(params.id);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold">Candidates for Review</h1>
        <p className="text-muted-foreground mt-1">
          Review shortlisted candidates and provide feedback to your headhunter.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleCandidates.length === 0 ? (
          <div className="col-span-2 text-center p-12 bg-muted/30 rounded-lg text-muted-foreground">
              No candidates are currently ready for your review. We&apos;ll notify you when new profiles are added.
          </div>
        ) : (
          visibleCandidates.map((c) => (
             <Card key={c.stageId} className="flex flex-col">
                <CardHeader className="pb-2 flex flex-row justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{c.fullName}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground pt-1">
                      {c.currentTitle} @ {c.currentCompany}
                    </p>
                  </div>
                   <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 font-bold text-sm ${
                      (c.fitScore || 0) >= 8 ? "border-green-500 text-green-500" :
                      (c.fitScore || 0) >= 5 ? "border-yellow-500 text-yellow-500" :
                      "border-red-500 text-red-500"
                    }`}>
                      {c.fitScore || "?"}
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm border-l-2 pl-3 border-muted-foreground/30 text-muted-foreground italic mb-4">
                    {c.fitNotes || "No summary provided by the headhunter yet."}
                  </p>

                  <div className="mb-2 text-sm font-medium">Your Feedback:</div>
                  <div className="flex gap-2">
                     <Button variant={c.clientStatus === 'interested' ? 'default' : 'outline'} size="sm" className="flex-1 w-full bg-green-500/10 hover:bg-green-500/20 text-green-700 border-green-500/20">
                       <CheckCircle className="w-4 h-4 mr-2" /> Interested
                     </Button>
                     <Button variant={c.clientStatus === 'not_a_fit' ? 'default' : 'outline'} size="sm" className="flex-1 w-full bg-red-500/10 hover:bg-red-500/20 text-red-700 border-red-500/20">
                       <XCircle className="w-4 h-4 mr-2" /> Reject
                     </Button>
                     <Button variant={c.clientStatus === 'hold' ? 'default' : 'outline'} size="sm" className="flex-1 w-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 border-yellow-500/20">
                       <Clock className="w-4 h-4 mr-2" /> Hold
                     </Button>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/10">
                   {c.cvUrl ? (
                     <Button variant="ghost" className="w-full text-sm">
                       <Download className="w-4 h-4 mr-2" /> Download Resume
                     </Button>
                   ) : (
                     <span className="text-sm text-muted-foreground text-center w-full">Resume not available</span>
                   )}
                </CardFooter>
             </Card>
          ))
        )}
      </div>
    </div>
  );
}
