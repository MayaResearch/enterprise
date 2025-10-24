import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

// Create admin client with service role key
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase admin credentials');
}

const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

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

    // Update in local database
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
      });

    if (!updatedUser) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Also update in Supabase auth user metadata
    if (supabaseAdmin) {
      try {
        // First, get the current user to preserve existing metadata
        const { data: authUser, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(id);
        
        if (getUserError) {
          console.error('Error fetching user from Supabase:', getUserError);
        } else {
          // Merge with existing metadata to preserve other fields
          const currentMetadata = authUser.user.user_metadata || {};
          
          const { error: supabaseError } = await supabaseAdmin.auth.admin.updateUserById(
            id,
            {
              user_metadata: {
                ...currentMetadata,
                permission_granted: permissionGranted,
                is_admin: updatedUser.isAdmin, // Also sync is_admin
              },
            }
          );

          if (supabaseError) {
            console.error('Error updating Supabase user metadata:', supabaseError);
          } else {
            console.log('✅ Successfully updated Supabase user metadata for:', updatedUser.email);
          }
        }
      } catch (error) {
        console.error('Error updating Supabase:', error);
      }
    } else {
      console.warn('⚠️ Supabase admin client not available - metadata not synced');
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

