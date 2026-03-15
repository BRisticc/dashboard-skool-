"use server";

import { db } from "@/lib/db";
import { jobs, clients } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getJobs() {
  return await db.select({
    id: jobs.id,
    title: jobs.title,
    clientName: clients.name,
    status: jobs.status,
    salaryMin: jobs.salaryMin,
    salaryMax: jobs.salaryMax,
    location: jobs.location,
    createdAt: jobs.createdAt,
  })
  .from(jobs)
  .leftJoin(clients, eq(jobs.clientId, clients.id));
}

// Just a basic scaffold for creating
export async function createJob(data: typeof jobs.$inferInsert) {
  return await db.insert(jobs).values(data).returning();
}
