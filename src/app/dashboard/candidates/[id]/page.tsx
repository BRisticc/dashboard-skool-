import { getCandidateById } from "@/lib/actions/candidates";

export default async function CandidateProfilePage({ params }: { params: { id: string } }) {
  const candidate = await getCandidateById(params.id);

  if (!candidate) {
    return <div className="p-8">Candidate not found</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{candidate.fullName}</h1>
          <p className="text-xl text-muted-foreground mt-2">
            {candidate.currentTitle} @ {candidate.currentCompany}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-muted-foreground">Fit Score</span>
            <div className={`text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full border-4 ${
              (candidate.fitScore || 0) >= 8 ? "border-green-500 text-green-500" :
              (candidate.fitScore || 0) >= 5 ? "border-yellow-500 text-yellow-500" :
              "border-red-500 text-red-500"
            }`}>
              {candidate.fitScore || "?"}
            </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-4">
        <div className="space-y-4">
           <h3 className="text-lg font-semibold border-b pb-2">Details</h3>
           <div className="grid grid-cols-2 gap-2 text-sm">
             <span className="text-muted-foreground">Location</span>
             <span>{candidate.location || "-"}</span>
             <span className="text-muted-foreground">Contact</span>
             <span>{candidate.email || candidate.phone || "-"}</span>
             <span className="text-muted-foreground">LinkedIn</span>
             <span>{candidate.linkedinUrl ? <a href={candidate.linkedinUrl} target="_blank" className="text-blue-500 underline">Profile</a> : "-"}</span>
             <span className="text-muted-foreground">Source</span>
             <span>{candidate.source || "-"}</span>
           </div>
        </div>

        <div className="space-y-4">
           <h3 className="text-lg font-semibold border-b pb-2">Notes</h3>
           <p className="text-sm min-h-24 bg-muted/30 p-4 rounded border">
             {candidate.fitNotes || "No notes available."}
           </p>
        </div>
      </div>
    </div>
  );
}
