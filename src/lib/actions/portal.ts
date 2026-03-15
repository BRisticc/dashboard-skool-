"use server";

import { db } from "@/lib/db";
import { pipelineStages, jobs, clients, candidates } from "@/drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function getClientPortalJobs(slug: string) {
  // Assuming a single client row maps to this slug
  const [client] = await db.select().from(clients).where(eq(clients.portalSlug, slug));
  if (!client) return null;

  const clientJobs = await db.select().from(jobs).where(eq(jobs.clientId, client.id));
  return { client, jobs: clientJobs };
}

export async function getClientVisibleCandidates(jobId: string) {
  return await db.select({
    stageId: pipelineStages.id,
    candidateId: candidates.id,
    fullName: candidates.fullName,
    currentTitle: candidates.currentTitle,
    currentCompany: candidates.currentCompany,
    fitScore: candidates.fitScore,
    fitNotes: candidates.fitNotes,
    cvUrl: candidates.cvUrl,
    clientStatus: pipelineStages.clientStatus,
  })
  .from(pipelineStages)
  .leftJoin(candidates, eq(pipelineStages.candidateId, candidates.id))
  .where(and(eq(pipelineStages.jobId, jobId), eq(pipelineStages.isVisibleToClient, true)));
}

export async function submitClientFeedback(stageId: string, status: string, notes: string) {
  return await db.update(pipelineStages)
    .set({ clientStatus: status, clientFeedback: notes })
    .where(eq(pipelineStages.id, stageId))
    .returning();
}
