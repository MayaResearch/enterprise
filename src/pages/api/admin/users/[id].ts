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
    const { permissionGranted, isAdmin } = body;

    // Validate that at least one field is being updated
    if (typeof permissionGranted !== 'boolean' && typeof isAdmin !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Invalid request - must update either permissionGranted or isAdmin' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build update object dynamically
    const updateData: any = { updatedAt: new Date() };
    if (typeof permissionGranted === 'boolean') {
      updateData.permissionGranted = permissionGranted;
    }
    if (typeof isAdmin === 'boolean') {
      updateData.isAdmin = isAdmin;
    }

    // Update in public.users database
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
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
    
    // 2. Invalidate the admin users list cache (force fresh fetch on next request)
    const allUsersCacheKey = cacheKeys.allUsers();
    memoryCache.delete(allUsersCacheKey);
    console.log('✅ Invalidated admin users list cache');

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Error updating user permission:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

