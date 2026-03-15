import { pgTable, text, timestamp, boolean, uuid, integer, numeric, date, unique } from "drizzle-orm/pg-core";

// ============================================================
// BetterAuth required tables
// To be generated/populated by BetterAuth, but we define them here 
// manually for Drizzle to know about them and build relations properly.
// ============================================================
export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
    role: text("role"), // custom role field "admin" | "client"
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

// ============================================================
// TABLE: clients
// ============================================================
export const clients = pgTable("clients", {
  id:           uuid("id").primaryKey().defaultRandom(),
  userId:       text("user_id").references(() => user.id),  // BetterAuth user for portal login
  name:         text("name").notNull(),
  company:      text("company").notNull(),
  email:        text("email").unique().notNull(),
  phone:        text("phone"),
  portalSlug:   text("portal_slug").unique().notNull(),     // /portal/[slug]
  industry:     text("industry"),
  notes:        text("notes"),
  isActive:     boolean("is_active").default(true),
  createdAt:    timestamp("created_at").defaultNow(),
});

// ============================================================
// TABLE: jobs
// ============================================================
export const jobs = pgTable("jobs", {
  id:               uuid("id").primaryKey().defaultRandom(),
  clientId:         uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  title:            text("title").notNull(),
  description:      text("description"),
  commissionPct:    numeric("commission_pct", { precision: 5, scale: 2 }).default("26.00"),
  upfrontPct:       numeric("upfront_pct", { precision: 5, scale: 2 }).default("5.00"),
  remainderPct:     numeric("remainder_pct", { precision: 5, scale: 2 }).default("95.00"),
  probationDays:    integer("probation_days").default(90),
  salaryMin:        numeric("salary_min", { precision: 12, scale: 2 }),
  salaryMax:        numeric("salary_max", { precision: 12, scale: 2 }),
  currency:         text("currency").default("USD"),
  location:         text("location"),
  remote:           boolean("remote").default(true),
  status:           text("status").default("active"),       // active | paused | filled | cancelled
  priority:         text("priority").default("medium"),     // high | medium | low
  targetGeography:  text("target_geography"),               // "Asia" | "MENA" | "Global"
  notes:            text("notes"),
  createdAt:        timestamp("created_at").defaultNow(),
  filledAt:         timestamp("filled_at"),
});

// ============================================================
// TABLE: poaching_companies
// ============================================================
export const poachingCompanies = pgTable("poaching_companies", {
  id:                  uuid("id").primaryKey().defaultRandom(),
  companyName:         text("company_name").notNull(),
  linkedinCompanyUrl:  text("linkedin_company_url").unique().notNull(), // PRIMARY SOURCING ID
  website:             text("website"),
  industry:            text("industry"),
  companySize:         text("company_size"),               // "11-50" | "51-200" | "201-500" | "500+"
  hqLocation:          text("hq_location"),
  qualityTier:         integer("quality_tier"),            // 1 | 2 | 3
  avgTenureMonths:     integer("avg_tenure_months"),       // poaching timing signal
  hadRecentLayoffs:    boolean("had_recent_layoffs").default(false),
  layoffNotes:         text("layoff_notes"),
  apifyScrapeUrl:      text("apify_scrape_url"),           // saved Apify actor URL
  booleanString:       text("boolean_string"),             // saved Boolean search string
  notes:               text("notes"),
  createdAt:           timestamp("created_at").defaultNow(),
});

// ============================================================
// TABLE: candidates
// ============================================================
export const candidates = pgTable("candidates", {
  id:                   uuid("id").primaryKey().defaultRandom(),
  fullName:             text("full_name").notNull(),
  email:                text("email"),
  phone:                text("phone"),
  linkedinUrl:          text("linkedin_url"),
  currentCompany:       text("current_company"),
  currentTitle:         text("current_title"),
  currentTenureMonths:  integer("current_tenure_months"),
  location:             text("location"),
  timezone:             text("timezone"),
  source:               text("source"),        // "Sales Navigator"|"Apify"|"Manual"|"Referral"
  sourceCompanyId:      uuid("source_company_id").references(() => poachingCompanies.id),
  cvUrl:                text("cv_url"),         // Uploadthing URL
  photoUrl:             text("photo_url"),
  fitScore:             integer("fit_score"),   // 1-10
  fitNotes:             text("fit_notes"),
  tags:                 text("tags").array(),   // ["senior","async","asia-based"]
  promptInjectionNotes: text("prompt_injection_notes"),  // LinkedIn manipulation detection
  isBlacklisted:        boolean("is_blacklisted").default(false),
  blacklistReason:      text("blacklist_reason"),
  createdAt:            timestamp("created_at").defaultNow(),
});

// ============================================================
// TABLE: pipeline_stages
// ============================================================
export const pipelineStages = pgTable("pipeline_stages", {
  id:                   uuid("id").primaryKey().defaultRandom(),
  jobId:                uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
  candidateId:          uuid("candidate_id").references(() => candidates.id, { onDelete: "cascade" }),
  stage:                text("stage").default("sourced"),
  adminNotes:           text("admin_notes"),
  clientFeedback:       text("client_feedback"),
  clientStatus:         text("client_status"),   // interested | not_a_fit | hold | pending
  isVisibleToClient:    boolean("is_visible_to_client").default(false),  // admin controls
  presentedToClientAt:  timestamp("presented_to_client_at"),
  createdAt:            timestamp("created_at").defaultNow(),
  updatedAt:            timestamp("updated_at").defaultNow(),
}, (t) => ({
  uniq: unique().on(t.jobId, t.candidateId),
}));

// ============================================================
// TABLE: outreach_log
// ============================================================
export const outreachLog = pgTable("outreach_log", {
  id:              uuid("id").primaryKey().defaultRandom(),
  candidateId:     uuid("candidate_id").references(() => candidates.id, { onDelete: "cascade" }),
  jobId:           uuid("job_id").references(() => jobs.id),
  channel:         text("channel"),              // "email" | "linkedin" | "phone"
  templateName:    text("template_name"),
  messageText:     text("message_text"),
  sentAt:          timestamp("sent_at").defaultNow(),
  responseStatus:  text("response_status").default("no_reply"),
  responseText:    text("response_text"),
  respondedAt:     timestamp("responded_at"),
  followUpDueAt:   timestamp("follow_up_due_at"),
  followUpDone:    boolean("follow_up_done").default(false),
});

// ============================================================
// TABLE: placements
// ============================================================
export const placements = pgTable("placements", {
  id:                   uuid("id").primaryKey().defaultRandom(),
  jobId:                uuid("job_id").references(() => jobs.id),
  candidateId:          uuid("candidate_id").references(() => candidates.id),
  clientId:             uuid("client_id").references(() => clients.id),
  signedDate:           date("signed_date").notNull(),
  probationEndDate:     date("probation_end_date").notNull(),   // signed + 90 days
  invoiceUpfrontSent:   boolean("invoice_upfront_sent").default(false),
  invoiceUpfrontPaid:   boolean("invoice_upfront_paid").default(false),
  invoiceFinalSent:     boolean("invoice_final_sent").default(false),
  invoiceFinalPaid:     boolean("invoice_final_paid").default(false),
  totalFee:             numeric("total_fee", { precision: 12, scale: 2 }),
  upfrontAmount:        numeric("upfront_amount", { precision: 12, scale: 2 }),
  finalAmount:          numeric("final_amount", { precision: 12, scale: 2 }),
  currency:             text("currency").default("USD"),
  notes:                text("notes"),
  createdAt:            timestamp("created_at").defaultNow(),
});

// ============================================================
// TABLE: poaching_targets
// ============================================================
export const poachingTargets = pgTable("poaching_targets", {
  id:                  uuid("id").primaryKey().defaultRandom(),
  poachingCompanyId:   uuid("poaching_company_id").references(() => poachingCompanies.id, { onDelete: "cascade" }),
  jobId:               uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
  clientId:            uuid("client_id").references(() => clients.id, { onDelete: "cascade" }),
  reasonFit:           text("reason_fit"),
  priority:            text("priority").default("medium"),     // high | medium | low
  sourcingStatus:      text("sourcing_status").default("not_started"),
  candidatesFound:     integer("candidates_found").default(0),
  lastSourcedDate:     date("last_sourced_date"),
  notes:               text("notes"),
  createdAt:           timestamp("created_at").defaultNow(),
}, (t) => ({
  uniq: unique().on(t.poachingCompanyId, t.jobId),
}));

// ============================================================
// TABLE: outreach_templates
// ============================================================
export const outreachTemplates = pgTable("outreach_templates", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  channel:   text("channel"),                // "email" | "linkedin"
  subject:   text("subject"),
  body:      text("body").notNull(),
  tags:      text("tags").array(),           // ["EA","luxury","follow-up"]
  createdAt: timestamp("created_at").defaultNow(),
});
