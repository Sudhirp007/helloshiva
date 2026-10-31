import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "helloshiva.db");
const db = new Database(dbPath);

// Enable WAL mode for ultra-lean memory and concurrency
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize Core Database Tables
export function initDb() {
  db.exec(`
    -- 1. Agency Inquiries
    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      source_page TEXT,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      status TEXT DEFAULT 'NEW',
      notes TEXT
    );

    -- 2. Feature Flags
    CREATE TABLE IF NOT EXISTS feature_flags (
      key TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL DEFAULT 0,
      description TEXT
    );

    -- 3. Keyword Opportunities
    CREATE TABLE IF NOT EXISTS keyword_opportunities (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      keyword TEXT NOT NULL,
      search_intent TEXT NOT NULL,
      topic_cluster TEXT NOT NULL,
      suggested_title TEXT NOT NULL,
      opportunity_explanation TEXT,
      competition_level TEXT DEFAULT 'Medium',
      research_source TEXT DEFAULT 'OctopusOn Adapter',
      status TEXT DEFAULT 'DISCOVERED'
    );

    -- 4. Editorial Calendar
    CREATE TABLE IF NOT EXISTS editorial_calendar (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      scheduled_date TEXT NOT NULL,
      theme TEXT NOT NULL,
      primary_keyword TEXT NOT NULL,
      supporting_keywords TEXT,
      search_intent TEXT NOT NULL,
      competitor_gap_notes TEXT,
      suggested_headline TEXT NOT NULL,
      content_format TEXT DEFAULT 'Comprehensive Guide',
      target_audience TEXT,
      suggested_internal_links TEXT,
      suggested_cta TEXT,
      status TEXT DEFAULT 'PROPOSED'
    );

    -- 5. Articles & Drafts
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      calendar_id TEXT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      meta_description TEXT,
      outline TEXT,
      content_markdown TEXT NOT NULL,
      current_version INTEGER DEFAULT 1,
      status TEXT DEFAULT 'DRAFT_READY',
      author TEXT DEFAULT 'HelloShiva Editorial'
    );

    -- 6. Article Version History
    CREATE TABLE IF NOT EXISTS article_versions (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      version_number INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_by TEXT NOT NULL,
      change_summary TEXT,
      content_markdown TEXT NOT NULL,
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    -- 7. SEO Audits
    CREATE TABLE IF NOT EXISTS seo_audits (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      audited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      checklist_results TEXT NOT NULL,
      recommendations TEXT,
      is_approved INTEGER DEFAULT 0,
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    -- 8. Social Distribution Posts
    CREATE TABLE IF NOT EXISTS social_posts (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      platform TEXT NOT NULL,
      content_text TEXT NOT NULL,
      hashtags TEXT,
      slide_data TEXT,
      status TEXT DEFAULT 'DRAFT',
      FOREIGN KEY(article_id) REFERENCES articles(id) ON DELETE CASCADE
    );

    -- 9. Content Activity Logs
    CREATE TABLE IF NOT EXISTS content_activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT DEFAULT 'admin',
      action TEXT NOT NULL,
      details TEXT
    );

    -- 10. Integration Settings
    CREATE TABLE IF NOT EXISTS integration_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default feature flags if empty
  const count = db.prepare("SELECT count(*) as cnt FROM feature_flags").get() as { cnt: number };
  if (count.cnt === 0) {
    const flags = [
      ["CONTENT_ENGINE_ENABLED", 1, "Master switch for the Content Engine"],
      ["SEO_RESEARCH_ENABLED", 1, "Enable keyword research providers"],
      ["KEYWORD_SCANNER_ENABLED", 1, "Enable periodic keyword scanner"],
      ["EDITORIAL_CALENDAR_ENABLED", 1, "Enable 7-day editorial calendar planning"],
      ["GEMINI_DRAFTING_ENABLED", 1, "Enable AI article drafting with Gemini API"],
      ["CONTENT_IMPROVEMENT_ENABLED", 1, "Enable existing article improvement analysis"],
      ["SEO_OPTIMIZATION_ENABLED", 1, "Enable SEO review checklist"],
      ["SOCIAL_DISTRIBUTION_ENABLED", 1, "Enable multi-channel social distribution"],
      ["SCHEDULED_RESEARCH_ENABLED", 0, "Enable background scheduled research"],
      ["AUTOMATIC_PUBLISHING_ENABLED", 0, "LOCKED: Automatic production publishing"],
    ];
    const insertFlag = db.prepare("INSERT INTO feature_flags (key, enabled, description) VALUES (?, ?, ?)");
    for (const [key, enabled, desc] of flags) {
      insertFlag.run(key, enabled, desc);
    }
  }
}

// Run init
initDb();

export default db;
