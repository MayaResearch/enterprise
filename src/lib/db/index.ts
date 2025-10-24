import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = import.meta.env.DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

// Configure postgres client with optimized settings for serverless
const client = postgres(connectionString, {
  max: 1, // Limit connections in serverless environment
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 30, // Connection timeout 30s (generous for serverless cold starts)
  max_lifetime: 60 * 30, // Max connection lifetime 30 minutes
  prepare: false, // Disable prepared statements for better serverless compatibility
});

export const db = drizzle(client, { schema });

