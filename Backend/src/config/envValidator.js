export function validateEnv() {
  const requiredVars = [
    "JWT_SECRET",
    "PORT",
    "CORS_ALLOW"
  ];

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}
