function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function numberEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Environment variable ${name} must be a positive integer`);
  }
  return parsed;
}

export function validateEnvironment(
  environment: Record<string, unknown>,
): Record<string, unknown> {
  for (const name of [
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ]) {
    if (!environment[name]) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
  }
  return environment;
}

export default () => ({
  port: numberEnv('PORT', 3000),
  database: {
    dbType: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: numberEnv('DB_PORT', 5432),
    username: requiredEnv('DB_USERNAME'),
    password: requiredEnv('DB_PASSWORD'),
    databaseName: requiredEnv('DB_DATABASE'),
  },
  cloudinary: {
    cloudName: requiredEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: requiredEnv('CLOUDINARY_API_KEY'),
    apiSecret: requiredEnv('CLOUDINARY_API_SECRET'),
  },
  jwt: {
    secret: requiredEnv('JWT_SECRET'),
    expireIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  khalti: {
    secretKey: process.env.KHALTI_SECRET_KEY || '',
    verifyUrl:
      process.env.KHALTI_VERIFY_URL ||
      'https://dev.khalti.com/api/v2/payment/verify/',
  },
});
