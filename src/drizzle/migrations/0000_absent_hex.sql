CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"phone" text,
	"linkedin_url" text,
	"current_company" text,
	"current_title" text,
	"current_tenure_months" integer,
	"location" text,
	"timezone" text,
	"source" text,
	"source_company_id" uuid,
	"cv_url" text,
	"photo_url" text,
	"fit_score" integer,
	"fit_notes" text,
	"tags" text[],
	"prompt_injection_notes" text,
	"is_blacklisted" boolean DEFAULT false,
	"blacklist_reason" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"company" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"portal_slug" text NOT NULL,
	"industry" text,
	"notes" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "clients_email_unique" UNIQUE("email"),
	CONSTRAINT "clients_portal_slug_unique" UNIQUE("portal_slug")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"commission_pct" numeric(5, 2) DEFAULT '26.00',
	"upfront_pct" numeric(5, 2) DEFAULT '5.00',
	"remainder_pct" numeric(5, 2) DEFAULT '95.00',
	"probation_days" integer DEFAULT 90,
	"salary_min" numeric(12, 2),
	"salary_max" numeric(12, 2),
	"currency" text DEFAULT 'USD',
	"location" text,
	"remote" boolean DEFAULT true,
	"status" text DEFAULT 'active',
	"priority" text DEFAULT 'medium',
	"target_geography" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"filled_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "outreach_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"candidate_id" uuid,
	"job_id" uuid,
	"channel" text,
	"template_name" text,
	"message_text" text,
	"sent_at" timestamp DEFAULT now(),
	"response_status" text DEFAULT 'no_reply',
	"response_text" text,
	"responded_at" timestamp,
	"follow_up_due_at" timestamp,
	"follow_up_done" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "outreach_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"channel" text,
	"subject" text,
	"body" text NOT NULL,
	"tags" text[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pipeline_stages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid,
	"candidate_id" uuid,
	"stage" text DEFAULT 'sourced',
	"admin_notes" text,
	"client_feedback" text,
	"client_status" text,
	"is_visible_to_client" boolean DEFAULT false,
	"presented_to_client_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pipeline_stages_job_id_candidate_id_unique" UNIQUE("job_id","candidate_id")
);
--> statement-breakpoint
CREATE TABLE "placements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid,
	"candidate_id" uuid,
	"client_id" uuid,
	"signed_date" date NOT NULL,
	"probation_end_date" date NOT NULL,
	"invoice_upfront_sent" boolean DEFAULT false,
	"invoice_upfront_paid" boolean DEFAULT false,
	"invoice_final_sent" boolean DEFAULT false,
	"invoice_final_paid" boolean DEFAULT false,
	"total_fee" numeric(12, 2),
	"upfront_amount" numeric(12, 2),
	"final_amount" numeric(12, 2),
	"currency" text DEFAULT 'USD',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "poaching_companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"linkedin_company_url" text NOT NULL,
	"website" text,
	"industry" text,
	"company_size" text,
	"hq_location" text,
	"quality_tier" integer,
	"avg_tenure_months" integer,
	"had_recent_layoffs" boolean DEFAULT false,
	"layoff_notes" text,
	"apify_scrape_url" text,
	"boolean_string" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "poaching_companies_linkedin_company_url_unique" UNIQUE("linkedin_company_url")
);
--> statement-breakpoint
CREATE TABLE "poaching_targets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poaching_company_id" uuid,
	"job_id" uuid,
	"client_id" uuid,
	"reason_fit" text,
	"priority" text DEFAULT 'medium',
	"sourcing_status" text DEFAULT 'not_started',
	"candidates_found" integer DEFAULT 0,
	"last_sourced_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "poaching_targets_poaching_company_id_job_id_unique" UNIQUE("poaching_company_id","job_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidates" ADD CONSTRAINT "candidates_source_company_id_poaching_companies_id_fk" FOREIGN KEY ("source_company_id") REFERENCES "public"."poaching_companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_log" ADD CONSTRAINT "outreach_log_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outreach_log" ADD CONSTRAINT "outreach_log_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "placements" ADD CONSTRAINT "placements_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poaching_targets" ADD CONSTRAINT "poaching_targets_poaching_company_id_poaching_companies_id_fk" FOREIGN KEY ("poaching_company_id") REFERENCES "public"."poaching_companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poaching_targets" ADD CONSTRAINT "poaching_targets_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poaching_targets" ADD CONSTRAINT "poaching_targets_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;