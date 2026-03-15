"use server";

import { db } from "@/lib/db";
import { candidates, poachingCompanies } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getCandidates() {
  return await db.select({
    id: candidates.id,
    fullName: candidates.fullName,
    currentCompany: candidates.currentCompany,
    currentTitle: candidates.currentTitle,
    fitScore: candidates.fitScore,
    location: candidates.location,
    source: candidates.source,
    createdAt: candidates.createdAt,
  })
  .from(candidates);
}

export async function getCandidateById(candidateId: string) {
  const [candidate] = await db.select().from(candidates).where(eq(candidates.id, candidateId));
  return candidate;
}
