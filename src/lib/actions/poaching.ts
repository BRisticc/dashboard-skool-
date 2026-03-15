"use server";

import { db } from "@/lib/db";
import { poachingCompanies } from "@/drizzle/schema";

export async function getPoachingCompanies() {
  return await db.select().from(poachingCompanies);
}
