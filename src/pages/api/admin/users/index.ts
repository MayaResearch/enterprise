import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { memoryCache } from '@/lib/cache/memoryCache';

export const prerender = false;

const ADMIN_USERS_CACHE_KEY = 'admin:all-users';

// GET - List all users (admin only)
export const GET: APIRoute = async ({ locals, url }) => {
  try {
    const user = locals.user;
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if hard refresh is requested
    const forceRefresh = url.searchParams.get('refresh') === 'true';

    if (forceRefresh) {
      // Hard refresh: invalidate cache and force DB query
      memoryCache.delete(ADMIN_USERS_CACHE_KEY);
      console.log('🔄 Hard refresh requested for admin users');
    } else {
      // Try to get from cache first
      const cachedUsers = memoryCache.get<any[]>(ADMIN_USERS_CACHE_KEY);
      
      if (cachedUsers) {
        console.log('✅ Cache HIT for admin users list');
        return new Response(JSON.stringify(cachedUsers), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    console.log('❌ Cache MISS for admin users - Fetching from DB');

    // Fetch all users from database
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        isAdmin: users.isAdmin,
        permissionGranted: users.permissionGranted,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));

    // Store in cache indefinitely (we'll update directly on mutations)
    memoryCache.set(ADMIN_USERS_CACHE_KEY, allUsers);

    return new Response(JSON.stringify(allUsers), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

