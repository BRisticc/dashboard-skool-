"use server";

import { db } from "@/lib/db";
import { pipelineStages, candidates, jobs } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getJobById(jobId: string) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  return job;
}

export async function getCandidatesForJob(jobId: string) {
  return await db.select({
    stage: pipelineStages.stage,
    candidateId: candidates.id,
    fullName: candidates.fullName,
    currentCompany: candidates.currentCompany,
    currentTitle: candidates.currentTitle,
    fitScore: candidates.fitScore,
  })
  .from(pipelineStages)
  .leftJoin(candidates, eq(pipelineStages.candidateId, candidates.id))
  .where(eq(pipelineStages.jobId, jobId));
}
