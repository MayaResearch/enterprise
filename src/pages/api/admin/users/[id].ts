import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { memoryCache, cacheKeys } from '@/lib/cache/memoryCache';

export const prerender = false;

// PATCH - Update user permissions (admin only)
export const PATCH: APIRoute = async ({ locals, request, params }) => {
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

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { permissionGranted } = body;

    if (typeof permissionGranted !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Invalid permission value' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update in public.users database
    const [updatedUser] = await db
      .update(users)
      .set({ 
        permissionGranted,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        isAdmin: users.isAdmin,
        permissionGranted: users.permissionGranted,
        createdAt: users.createdAt,
      });

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update cache: 1) User's own data cache, 2) Admin users list cache
    
    // 1. Update the user's own data cache (for middleware and /api/user/me)
    const userDataCacheKey = cacheKeys.userData(id);
    memoryCache.set(userDataCacheKey, {
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      avatarUrl: null, // Not in updatedUser
      isAdmin: updatedUser.isAdmin,
      permissionGranted: updatedUser.permissionGranted,
    });
    console.log('✅ Updated user data cache for:', updatedUser.email);
    
    // 2. Update the admin users list cache
    const allUsersCacheKey = cacheKeys.allUsers();
    const cachedUsers = memoryCache.get<any[]>(allUsersCacheKey);
    
    if (cachedUsers) {
      const updatedUsers = cachedUsers.map(u => 
        u.id === id ? { ...u, permissionGranted, updatedAt: updatedUser.createdAt } : u
      );
      memoryCache.set(allUsersCacheKey, updatedUsers);
      console.log('✅ Updated admin users list cache');
    }

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user permission:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

