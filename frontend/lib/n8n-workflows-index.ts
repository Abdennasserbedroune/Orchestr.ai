// Static index of n8n workflows from github.com/Zie619/n8n-workflows
// Each entry maps to an agent slug and links to the raw JSON in that repo.
// Raw URL pattern: https://raw.githubusercontent.com/Zie619/n8n-workflows/main/workflows/<filename>

export interface N8nWorkflow {
  id: string
  name: string
  agent_slug: string
  integrations: string[]
  raw_url: string
}

const BASE = 'https://raw.githubusercontent.com/Zie619/n8n-workflows/main/workflows'

export const N8N_WORKFLOWS_INDEX: N8nWorkflow[] = [
  // ── quill (Content Writer) ────────────────────────────────────────────────
  {
    id: 'quill-001',
    name: 'OpenAI + WordPress: Auto-publish blog post',
    agent_slug: 'quill',
    integrations: ['OpenAI', 'WordPress'],
    raw_url: `${BASE}/openai_wordpress_auto_publish_blog_post.json`,
  },
  {
    id: 'quill-002',
    name: 'OpenAI + Twitter: Generate & post social thread',
    agent_slug: 'quill',
    integrations: ['OpenAI', 'Twitter'],
    raw_url: `${BASE}/openai_twitter_generate_post_social_thread.json`,
  },
  {
    id: 'quill-003',
    name: 'OpenAI + Buffer: Schedule weekly content calendar',
    agent_slug: 'quill',
    integrations: ['OpenAI', 'Buffer'],
    raw_url: `${BASE}/openai_buffer_schedule_weekly_content_calendar.json`,
  },
  {
    id: 'quill-004',
    name: 'OpenAI + Mailchimp: Write & send email campaign',
    agent_slug: 'quill',
    integrations: ['OpenAI', 'Mailchimp'],
    raw_url: `${BASE}/openai_mailchimp_write_send_email_campaign.json`,
  },

  // ── nexus (Sales Strategist) ──────────────────────────────────────────────
  {
    id: 'nexus-001',
    name: 'HubSpot + Lemlist: Enrich leads & launch sequence',
    agent_slug: 'nexus',
    integrations: ['HubSpot', 'Lemlist'],
    raw_url: `${BASE}/hubspot_lemlist_enrich_leads_launch_sequence.json`,
  },
  {
    id: 'nexus-002',
    name: 'Apollo + Gmail: Personalised cold outreach at scale',
    agent_slug: 'nexus',
    integrations: ['Apollo', 'Gmail'],
    raw_url: `${BASE}/apollo_gmail_personalised_cold_outreach.json`,
  },
  {
    id: 'nexus-003',
    name: 'HubSpot + Slack: Alert on deal stage change',
    agent_slug: 'nexus',
    integrations: ['HubSpot', 'Slack'],
    raw_url: `${BASE}/hubspot_slack_alert_deal_stage_change.json`,
  },
  {
    id: 'nexus-004',
    name: 'LinkedIn + HubSpot: Sync new connections to CRM',
    agent_slug: 'nexus',
    integrations: ['LinkedIn', 'HubSpot'],
    raw_url: `${BASE}/linkedin_hubspot_sync_new_connections_crm.json`,
  },

  // ── atlas (Ops Commander) ─────────────────────────────────────────────────
  {
    id: 'atlas-001',
    name: 'Slack + Gmail: Route support emails to channels',
    agent_slug: 'atlas',
    integrations: ['Slack', 'Gmail'],
    raw_url: `${BASE}/slack_gmail_route_support_emails_channels.json`,
  },
  {
    id: 'atlas-002',
    name: 'Schedule + Webhook: Daily ops digest to Slack',
    agent_slug: 'atlas',
    integrations: ['Schedule', 'Webhook', 'Slack'],
    raw_url: `${BASE}/schedule_webhook_daily_ops_digest_slack.json`,
  },
  {
    id: 'atlas-003',
    name: 'Notion + Airtable: Sync project status bidirectionally',
    agent_slug: 'atlas',
    integrations: ['Notion', 'Airtable'],
    raw_url: `${BASE}/notion_airtable_sync_project_status.json`,
  },
  {
    id: 'atlas-004',
    name: 'Google Sheets + Slack: Weekly KPI report automation',
    agent_slug: 'atlas',
    integrations: ['Google Sheets', 'Slack'],
    raw_url: `${BASE}/google_sheets_slack_weekly_kpi_report.json`,
  },

  // ── scout (Market Researcher) ─────────────────────────────────────────────
  {
    id: 'scout-001',
    name: 'SerpAPI + Notion: Competitor SERP tracking',
    agent_slug: 'scout',
    integrations: ['SerpAPI', 'Notion'],
    raw_url: `${BASE}/serpapi_notion_competitor_serp_tracking.json`,
  },
  {
    id: 'scout-002',
    name: 'Twitter + Slack: Brand mention monitoring',
    agent_slug: 'scout',
    integrations: ['Twitter', 'Slack'],
    raw_url: `${BASE}/twitter_slack_brand_mention_monitoring.json`,
  },
  {
    id: 'scout-003',
    name: 'RSS + OpenAI + Notion: Industry news digest',
    agent_slug: 'scout',
    integrations: ['RSS', 'OpenAI', 'Notion'],
    raw_url: `${BASE}/rss_openai_notion_industry_news_digest.json`,
  },

  // ── ledger (Finance Analyst) ──────────────────────────────────────────────
  {
    id: 'ledger-001',
    name: 'Stripe + Google Sheets: Revenue dashboard sync',
    agent_slug: 'ledger',
    integrations: ['Stripe', 'Google Sheets'],
    raw_url: `${BASE}/stripe_google_sheets_revenue_dashboard_sync.json`,
  },
  {
    id: 'ledger-002',
    name: 'Xero + Slack: Overdue invoice alert',
    agent_slug: 'ledger',
    integrations: ['Xero', 'Slack'],
    raw_url: `${BASE}/xero_slack_overdue_invoice_alert.json`,
  },
  {
    id: 'ledger-003',
    name: 'QuickBooks + Notion: Monthly P&L export',
    agent_slug: 'ledger',
    integrations: ['QuickBooks', 'Notion'],
    raw_url: `${BASE}/quickbooks_notion_monthly_pl_export.json`,
  },
  {
    id: 'ledger-004',
    name: 'Stripe + Gmail: Automatic payment receipt emails',
    agent_slug: 'ledger',
    integrations: ['Stripe', 'Gmail'],
    raw_url: `${BASE}/stripe_gmail_automatic_payment_receipt.json`,
  },

  // ── pulse (HR Manager) ────────────────────────────────────────────────────
  {
    id: 'pulse-001',
    name: 'Typeform + Notion: Applicant intake to database',
    agent_slug: 'pulse',
    integrations: ['Typeform', 'Notion'],
    raw_url: `${BASE}/typeform_notion_applicant_intake_database.json`,
  },
  {
    id: 'pulse-002',
    name: 'Google Calendar + Slack: Interview schedule reminder',
    agent_slug: 'pulse',
    integrations: ['Google Calendar', 'Slack'],
    raw_url: `${BASE}/google_calendar_slack_interview_schedule_reminder.json`,
  },
  {
    id: 'pulse-003',
    name: 'Greenhouse + Notion: Onboarding checklist trigger',
    agent_slug: 'pulse',
    integrations: ['Greenhouse', 'Notion'],
    raw_url: `${BASE}/greenhouse_notion_onboarding_checklist_trigger.json`,
  },

  // ── forge (Tech Architect) ────────────────────────────────────────────────
  {
    id: 'forge-001',
    name: 'GitHub + Linear: Auto-create tickets from PR comments',
    agent_slug: 'forge',
    integrations: ['GitHub', 'Linear'],
    raw_url: `${BASE}/github_linear_auto_create_tickets_pr_comments.json`,
  },
  {
    id: 'forge-002',
    name: 'GitHub + Slack: Deploy notification on main push',
    agent_slug: 'forge',
    integrations: ['GitHub', 'Slack'],
    raw_url: `${BASE}/github_slack_deploy_notification_main_push.json`,
  },
  {
    id: 'forge-003',
    name: 'Postman + Notion: API test results to docs',
    agent_slug: 'forge',
    integrations: ['Postman', 'Notion'],
    raw_url: `${BASE}/postman_notion_api_test_results_docs.json`,
  },
  {
    id: 'forge-004',
    name: 'Vercel + Slack: Build failure alert with diff summary',
    agent_slug: 'forge',
    integrations: ['Vercel', 'Slack'],
    raw_url: `${BASE}/vercel_slack_build_failure_alert_diff_summary.json`,
  },
]
