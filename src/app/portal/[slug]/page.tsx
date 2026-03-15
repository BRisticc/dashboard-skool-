import { getClientPortalJobs } from "@/lib/actions/portal";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

export default async function ClientPortalIndex({ params }: { params: { slug: string } }) {
  const data = await getClientPortalJobs(params.slug);

  if (!data) return <div className="p-8 text-center mt-20">Portal Not Found</div>;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <div className="flex items-center gap-4 mb-8 border-b pb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
           {data.client.name.charAt(0)}
        </div>
        <div>
           <h1 className="text-3xl font-bold">{data.client.name} Portal</h1>
           <p className="text-muted-foreground">{data.client.company}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
         <Briefcase className="w-5 h-5"/> Active Hiring Campaigns
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.jobs.map(job => (
          <Link href={`/portal/${params.slug}/jobs/${job.id}`} key={job.id}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <CardTitle>{job.title}</CardTitle>
                <div className="text-sm text-muted-foreground pt-1">{job.location || "Remote"}</div>
              </CardHeader>
              <CardContent>
                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>{job.status}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {data.jobs.length === 0 && (
          <div className="text-center p-12 bg-muted/30 rounded-lg text-muted-foreground">
              No active campaigns at the moment.
          </div>
      )}
    </div>
  );
}
