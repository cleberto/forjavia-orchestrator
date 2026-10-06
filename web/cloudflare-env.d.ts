declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    SURVEY_ADMIN_TOKEN?: string;
  }
}
