import path from "path";
import fs from "fs";

interface TableData {
  enquiries: any[];
  feature_flags: any[];
  keyword_opportunities: any[];
  editorial_calendar: any[];
  articles: any[];
  article_versions: any[];
  seo_audits: any[];
  social_posts: any[];
  content_activity_logs: any[];
  integration_settings: any[];
}

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const jsonDbPath = path.join(dbDir, "helloshiva.json");

// In-Memory store with file-sync
class JsonDatabase {
  private data: TableData;

  constructor() {
    this.data = this.loadData();
    this.seedDefaults();
  }

  private loadData(): TableData {
    try {
      if (fs.existsSync(jsonDbPath)) {
        const raw = fs.readFileSync(jsonDbPath, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to parse jsonDbPath, initializing fresh store:", e);
    }
    return {
      enquiries: [],
      feature_flags: [],
      keyword_opportunities: [],
      editorial_calendar: [],
      articles: [],
      article_versions: [],
      seo_audits: [],
      social_posts: [],
      content_activity_logs: [],
      integration_settings: [],
    };
  }

  private save() {
    try {
      const tempPath = `${jsonDbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), "utf-8");
      fs.renameSync(tempPath, jsonDbPath);
    } catch (e) {
      console.error("Failed to persist JSON DB:", e);
    }
  }

  private seedDefaults() {
    if (!this.data.feature_flags || this.data.feature_flags.length === 0) {
      this.data.feature_flags = [
        { key: "CONTENT_ENGINE_ENABLED", enabled: 1, description: "Master switch for the Content Engine" },
        { key: "SEO_RESEARCH_ENABLED", enabled: 1, description: "Enable keyword research providers" },
        { key: "KEYWORD_SCANNER_ENABLED", enabled: 1, description: "Enable periodic keyword scanner" },
        { key: "EDITORIAL_CALENDAR_ENABLED", enabled: 1, description: "Enable 7-day editorial calendar planning" },
        { key: "GEMINI_DRAFTING_ENABLED", enabled: 1, description: "Enable AI article drafting with Gemini API" },
        { key: "CONTENT_IMPROVEMENT_ENABLED", enabled: 1, description: "Enable existing article improvement analysis" },
        { key: "SEO_OPTIMIZATION_ENABLED", enabled: 1, description: "Enable SEO review checklist" },
        { key: "SOCIAL_DISTRIBUTION_ENABLED", enabled: 1, description: "Enable multi-channel social distribution" },
        { key: "SCHEDULED_RESEARCH_ENABLED", enabled: 0, description: "Enable background scheduled research" },
        { key: "AUTOMATIC_PUBLISHING_ENABLED", enabled: 0, description: "LOCKED: Automatic production publishing" },
      ];
      this.save();
    }
  }

  public pragma(_query: string) {
    return this;
  }

  public exec(_query: string) {
    return this;
  }

  public prepare(query: string) {
    const trimmed = query.trim().replace(/\s+/g, " ");

    return {
      all: (...params: any[]) => this.executeAll(trimmed, params),
      get: (...params: any[]) => this.executeGet(trimmed, params),
      run: (...params: any[]) => this.executeRun(trimmed, params),
    };
  }

  private executeAll(sql: string, params: any[]): any[] {
    const s = sql.toLowerCase();

    // 1. SELECT * FROM enquiries ORDER BY created_at DESC
    if (s.includes("from enquiries")) {
      return [...(this.data.enquiries || [])].sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      );
    }

    // 2. SELECT * FROM articles ORDER BY updated_at DESC
    if (s.includes("from articles")) {
      let list = [...(this.data.articles || [])];
      if (s.includes("status = 'approved'")) {
        list = list.filter((a) => a.status === "APPROVED");
      }
      list.sort((a, b) => (b.updated_at || "").localeCompare(a.updated_at || ""));
      if (s.includes("limit 5")) {
        return list.slice(0, 5);
      }
      return list;
    }

    // 3. SELECT * FROM editorial_calendar ORDER BY scheduled_date ASC
    if (s.includes("from editorial_calendar")) {
      const list = [...(this.data.editorial_calendar || [])].sort((a, b) =>
        (a.scheduled_date || "").localeCompare(b.scheduled_date || "")
      );
      if (s.includes("limit 5")) {
        return list.slice(0, 5);
      }
      return list;
    }

    // 4. SELECT * FROM keyword_opportunities
    if (s.includes("from keyword_opportunities")) {
      return [...(this.data.keyword_opportunities || [])]
        .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
        .slice(0, 50);
    }

    // 5. SELECT * FROM feature_flags
    if (s.includes("from feature_flags")) {
      return [...(this.data.feature_flags || [])];
    }

    // 6. SELECT * FROM integration_settings
    if (s.includes("from integration_settings")) {
      return [...(this.data.integration_settings || [])];
    }

    // 7. SELECT * FROM social_posts
    if (s.includes("from social_posts")) {
      return [...(this.data.social_posts || [])];
    }

    return [];
  }

  private executeGet(sql: string, params: any[]): any {
    const s = sql.toLowerCase();

    // Counts: SELECT count(*) as cnt FROM ...
    if (s.includes("count(*) as cnt from")) {
      if (s.includes("from keyword_opportunities")) {
        return { cnt: (this.data.keyword_opportunities || []).length };
      }
      if (s.includes("from editorial_calendar")) {
        return { cnt: (this.data.editorial_calendar || []).length };
      }
      if (s.includes("from articles")) {
        if (s.includes("status = 'approved'")) {
          return { cnt: (this.data.articles || []).filter((a) => a.status === "APPROVED").length };
        }
        return { cnt: (this.data.articles || []).length };
      }
      if (s.includes("from social_posts")) {
        return { cnt: (this.data.social_posts || []).length };
      }
      if (s.includes("from enquiries")) {
        return { cnt: (this.data.enquiries || []).length };
      }
      if (s.includes("from feature_flags")) {
        return { cnt: (this.data.feature_flags || []).length };
      }
      return { cnt: 0 };
    }

    // SELECT value FROM integration_settings WHERE key = ...
    if (s.includes("from integration_settings where key =")) {
      const keyVal = params[0] || (sql.match(/key = '([^']+)'/i)?.[1] ?? "");
      const setting = (this.data.integration_settings || []).find((s) => s.key === keyVal);
      return setting ? { value: setting.value } : undefined;
    }

    const all = this.executeAll(sql, params);
    return all.length > 0 ? all[0] : undefined;
  }

  private executeRun(sql: string, params: any[]): { changes: number; lastInsertRowid: number } {
    const s = sql.toLowerCase();
    let changes = 0;

    // 1. INSERT INTO enquiries
    if (s.includes("insert into enquiries")) {
      const [
        id, name, email, phone, company, service, message,
        source_page, referrer, utm_source, utm_medium, utm_campaign
      ] = params;
      this.data.enquiries.push({
        id,
        created_at: new Date().toISOString(),
        name, email, phone, company, service, message,
        source_page, referrer, utm_source, utm_medium, utm_campaign,
        status: "NEW",
        notes: "",
      });
      changes = 1;
    }

    // 2. UPDATE enquiries
    else if (s.includes("update enquiries")) {
      if (s.includes("set status = ? where id = ?")) {
        const [status, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) {
          item.status = status;
          changes = 1;
        }
      } else if (s.includes("set notes = ? where id = ?")) {
        const [notes, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) {
          item.notes = notes;
          changes = 1;
        }
      }
    }

    // 3. DELETE FROM editorial_calendar WHERE status = 'PROPOSED'
    else if (s.includes("delete from editorial_calendar where status = 'proposed'")) {
      const before = this.data.editorial_calendar.length;
      this.data.editorial_calendar = this.data.editorial_calendar.filter(
        (e) => e.status !== "PROPOSED"
      );
      changes = before - this.data.editorial_calendar.length;
    }

    // 4. INSERT INTO editorial_calendar
    else if (s.includes("insert into editorial_calendar")) {
      const [
        id, scheduled_date, theme, primary_keyword, supporting_keywords,
        search_intent, competitor_gap_notes, suggested_headline, content_format,
        target_audience, suggested_internal_links, suggested_cta, status
      ] = params;
      this.data.editorial_calendar.push({
        id,
        created_at: new Date().toISOString(),
        scheduled_date, theme, primary_keyword, supporting_keywords,
        search_intent, competitor_gap_notes, suggested_headline, content_format,
        target_audience, suggested_internal_links, suggested_cta,
        status: status || "PROPOSED",
      });
      changes = 1;
    }

    // 5. UPDATE editorial_calendar
    else if (s.includes("update editorial_calendar")) {
      if (s.includes("set status = ? where id = ?")) {
        const [status, id] = params;
        const item = this.data.editorial_calendar.find((c) => c.id === id);
        if (item) {
          item.status = status;
          changes = 1;
        }
      } else if (s.includes("set scheduled_date = ? where id = ?")) {
        const [date, id] = params;
        const item = this.data.editorial_calendar.find((c) => c.id === id);
        if (item) {
          item.scheduled_date = date;
          changes = 1;
        }
      }
    }

    // 6. INSERT INTO articles
    else if (s.includes("insert into articles")) {
      const [id, calendar_id, title, slug, meta_description, outline, content_markdown, current_version, status] = params;
      this.data.articles.push({
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        calendar_id, title, slug, meta_description, outline, content_markdown,
        current_version: current_version || 1,
        status: status || "DRAFT_READY",
        author: "HelloShiva Editorial",
      });
      changes = 1;
    }

    // 7. INSERT INTO article_versions
    else if (s.includes("insert into article_versions")) {
      const [id, article_id, version_number, created_by, change_summary, content_markdown] = params;
      this.data.article_versions.push({
        id, article_id, version_number,
        created_at: new Date().toISOString(),
        created_by, change_summary, content_markdown,
      });
      changes = 1;
    }

    // 8. INSERT INTO keyword_opportunities
    else if (s.includes("insert into keyword_opportunities")) {
      const [id, keyword, search_intent, topic_cluster, suggested_title, explanation, comp, src] = params;
      this.data.keyword_opportunities.push({
        id,
        created_at: new Date().toISOString(),
        keyword, search_intent, topic_cluster, suggested_title,
        opportunity_explanation: explanation,
        competition_level: comp || "Medium",
        research_source: src || "OctopusOn Adapter",
        status: "DISCOVERED",
      });
      changes = 1;
    }

    // 9. INSERT INTO seo_audits
    else if (s.includes("insert into seo_audits")) {
      const [id, article_id, checklist_results, recommendations, is_approved] = params;
      this.data.seo_audits.push({
        id, article_id,
        audited_at: new Date().toISOString(),
        checklist_results, recommendations,
        is_approved: is_approved ? 1 : 0,
      });
      changes = 1;
    }

    // 10. INSERT INTO social_posts
    else if (s.includes("insert into social_posts")) {
      const [id, article_id, platform, content_text, hashtags, slide_data] = params;
      this.data.social_posts.push({
        id, article_id, platform, content_text, hashtags, slide_data,
        status: "DRAFT",
      });
      changes = 1;
    }

    // 11. UPDATE feature_flags
    else if (s.includes("update feature_flags set enabled = ? where key = ?")) {
      const [enabled, key] = params;
      const flag = this.data.feature_flags.find((f) => f.key === key);
      if (flag) {
        flag.enabled = enabled ? 1 : 0;
        changes = 1;
      }
    }

    // 12. UPSERT integration_settings
    else if (s.includes("integration_settings")) {
      const [key, value] = params;
      const existing = this.data.integration_settings.find((s) => s.key === key);
      if (existing) {
        existing.value = value;
        existing.updated_at = new Date().toISOString();
      } else {
        this.data.integration_settings.push({
          key,
          value,
          updated_at: new Date().toISOString(),
        });
      }
      changes = 1;
    }

    if (changes > 0) {
      this.save();
    }

    return { changes, lastInsertRowid: Date.now() };
  }
}

// Singleton instance
const db = new JsonDatabase();

export function initDb() {
  // Handled automatically by constructor
}

export default db;
