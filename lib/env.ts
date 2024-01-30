const env = {
  databaseUrl: `${process.env.DATABASE_URL}`,
  appUrl: `${process.env.APP_URL}`,
  product: "anphatcore",
  redirectIfAuthenticated: "/dashboard",

  // SMTP configuration for NextAuth
  smtp: {
    service: process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM
  },

  // NextAuth configuration
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET
  },

  // Svix
  svix: {
    url: `${process.env.SVIX_URL}`,
    apiKey: `${process.env.SVIX_API_KEY}`
  },

  //Social login: Google
  google: {
    clientId: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`
  },

  // Retraced configuration
  retraced: {
    url: process.env.RETRACED_URL ? `${process.env.RETRACED_URL}/auditlog` : undefined,
    apiKey: process.env.RETRACED_API_KEY,
    projectId: process.env.RETRACED_PROJECT_ID
  },

  // Users will need to confirm their email before accessing the app feature
  confirmEmail: process.env.CONFIRM_EMAIL === "true",

  disableNonBusinessEmailSignup: process.env.DISABLE_NON_BUSINESS_EMAIL_SIGNUP === "true" ? true : false,

  authProviders: process.env.AUTH_PROVIDERS || "credentials",

  otel: {
    prefix: process.env.OTEL_PREFIX || "anphat.core"
  },

  hideLandingPage: process.env.HIDE_LANDING_PAGE === "true" ? true : false,

  darkModeEnabled: process.env.DARK_MODE === "false" ? false : true,

  teamFeatures: {
    webhook: process.env.FEATURE_TEAM_WEBHOOK === "false" ? false : true,
    apiKey: process.env.FEATURE_TEAM_API_KEY === "false" ? false : true,
    auditLog: process.env.FEATURE_TEAM_AUDIT_LOG === "false" ? false : true
  }
};

export default env;
