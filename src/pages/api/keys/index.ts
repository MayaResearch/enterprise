import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';
import { memoryCache, cacheKeys } from '@/lib/cache/memoryCache';

export const prerender = false;

// Helper function to hash the API key for storage
function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// GET - List all API keys for the user
export const GET: APIRoute = async ({ locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try to get from cache first
    const cacheKey = cacheKeys.userApiKeys(user.id);
    const cachedKeys = memoryCache.get<any[]>(cacheKey);
    
    if (cachedKeys) {
      console.log('✅ Cache HIT for user:', user.email);
      return new Response(JSON.stringify(cachedKeys), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('❌ Cache MISS for user:', user.email, '- Fetching from DB');

    // Cache miss - fetch from database
    const keys = await db
      .select({
        id: apiKeys.id,
        label: apiKeys.label,
        keyHash: apiKeys.keyHash,
        isActive: apiKeys.isActive,
        rateLimit: apiKeys.rateLimit,
        credits: apiKeys.credits,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
        expiresAt: apiKeys.expiresAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, user.id))
      .orderBy(desc(apiKeys.createdAt));

    // Add keyPreview (last 4 chars of hash) to each key for display
    const keysWithPreview = keys.map(key => ({
      ...key,
      keyPreview: key.keyHash.slice(-4),
    }));

    // Store in cache for 5 minutes
    memoryCache.set(cacheKey, keysWithPreview, 5 * 60 * 1000);

    return new Response(JSON.stringify(keysWithPreview), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// POST - Create a new API key
export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { label } = body;

    if (!label || typeof label !== 'string' || !label.trim()) {
      return new Response(JSON.stringify({ error: 'Label is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a random API key
    const key = `maya_${crypto.randomBytes(32).toString('hex')}`;
    const keyHash = hashApiKey(key);
    const keyPreview = key.slice(-4);

    const [newKey] = await db
      .insert(apiKeys)
      .values({
        userId: user.id,
        label: label.trim(),
        keyHash,
        isActive: true,
        rateLimit: 60,
        credits: '0.00',
      })
      .returning({
        id: apiKeys.id,
        label: apiKeys.label,
        keyHash: apiKeys.keyHash,
        isActive: apiKeys.isActive,
        rateLimit: apiKeys.rateLimit,
        credits: apiKeys.credits,
        createdAt: apiKeys.createdAt,
      });

    // Invalidate cache for this user since we added a new key
    const cacheKey = cacheKeys.userApiKeys(user.id);
    memoryCache.delete(cacheKey);
    console.log('🗑️  Invalidated cache for user:', user.email);

    // Return the full key only once during creation, along with preview
    return new Response(JSON.stringify({
      ...newKey,
      key, // Full key returned only once
      keyPreview,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

