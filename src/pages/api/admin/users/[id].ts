import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { memoryCache } from '@/lib/cache/memoryCache';

export const prerender = false;

const ADMIN_USERS_CACHE_KEY = 'admin:all-users';

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

    // Update cache directly by modifying the specific user
    const cachedUsers = memoryCache.get<any[]>(ADMIN_USERS_CACHE_KEY);
    
    if (cachedUsers) {
      const updatedUsers = cachedUsers.map(u => 
        u.id === id ? { ...u, permissionGranted, updatedAt: updatedUser.createdAt } : u
      );
      memoryCache.set(ADMIN_USERS_CACHE_KEY, updatedUsers);
      console.log('✅ Updated cache for user:', id, updatedUser.email);
    } else {
      console.log('ℹ️ No cache to update for admin users');
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

