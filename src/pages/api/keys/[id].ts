import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { apiKeys } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { memoryCache, cacheKeys } from '@/lib/cache/memoryCache';

export const prerender = false;

// PATCH - Update an API key (toggle isActive status, update credits, etc.)
export const PATCH: APIRoute = async ({ locals, request, params }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Key ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { isActive, credits, rateLimit } = body;

    // Build update object based on what fields are provided
    const updateData: any = {};
    if (typeof isActive === 'boolean') {
      updateData.isActive = isActive;
    }
    if (typeof credits === 'number') {
      updateData.credits = credits.toString();
    }
    if (typeof rateLimit === 'number') {
      updateData.rateLimit = rateLimit;
    }

    if (Object.keys(updateData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const [updatedKey] = await db
      .update(apiKeys)
      .set(updateData)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)))
      .returning({
        id: apiKeys.id,
        label: apiKeys.label,
        keyHash: apiKeys.keyHash,
        isActive: apiKeys.isActive,
        rateLimit: apiKeys.rateLimit,
        credits: apiKeys.credits,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
      });

    if (!updatedKey) {
      return new Response(JSON.stringify({ error: 'API key not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update cache directly by modifying the specific key
    const cacheKey = cacheKeys.userApiKeys(user.id);
    const cachedKeys = memoryCache.get<any[]>(cacheKey);
    
    if (cachedKeys) {
      const updatedKeys = cachedKeys.map(key => 
        key.id === id ? { ...key, ...updateData } : key
      );
      memoryCache.set(cacheKey, updatedKeys);
      console.log('✅ Updated cache for key:', id, 'user:', user.email);
    } else {
      console.log('ℹ️  No cache to update for user:', user.email);
    }

    // Add keyPreview for display
    const response = {
      ...updatedKey,
      keyPreview: updatedKey.keyHash.slice(-4),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// DELETE - Delete an API key
export const DELETE: APIRoute = async ({ locals, params }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Key ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await db
      .delete(apiKeys)
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, user.id)))
      .returning({ id: apiKeys.id });

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'API key not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update cache directly by removing the deleted key
    const cacheKey = cacheKeys.userApiKeys(user.id);
    const cachedKeys = memoryCache.get<any[]>(cacheKey);
    
    if (cachedKeys) {
      const updatedKeys = cachedKeys.filter(key => key.id !== id);
      memoryCache.set(cacheKey, updatedKeys);
      console.log('✅ Removed key from cache:', id, 'user:', user.email);
    } else {
      console.log('ℹ️  No cache to update for user:', user.email);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

