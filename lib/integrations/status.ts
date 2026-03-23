export type IntegrationConfig = {
  configured: boolean;
  mode: "read" | "write" | "read_write";
  required: string[];
};

export function getIntegrationStatus() {
  const status: Record<string, IntegrationConfig> = {
    google_sheets: {
      configured: Boolean(process.env.GOOGLE_API_KEY),
      mode: "read",
      required: ["GOOGLE_API_KEY"],
    },
    google_calendar: {
      configured: Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET),
      mode: "read_write",
      required: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"],
    },
    gmail: {
      configured: Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET),
      mode: "read_write",
      required: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"],
    },
    google_docs_slides: {
      configured: Boolean(process.env.GOOGLE_OAUTH_CLIENT_ID && process.env.GOOGLE_OAUTH_CLIENT_SECRET),
      mode: "read_write",
      required: ["GOOGLE_OAUTH_CLIENT_ID", "GOOGLE_OAUTH_CLIENT_SECRET"],
    },
    salesforce: {
      configured: Boolean(process.env.SF_INSTANCE_URL && process.env.SF_ACCESS_TOKEN),
      mode: "read_write",
      required: ["SF_INSTANCE_URL", "SF_ACCESS_TOKEN"],
    },
    slack: {
      configured: Boolean(process.env.SLACK_WEBHOOK_URL),
      mode: "write",
      required: ["SLACK_WEBHOOK_URL"],
    },
  };
  return status;
}

