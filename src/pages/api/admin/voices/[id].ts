import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { voices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const PATCH: APIRoute = async ({ locals, params, request }) => {
  try {
    // Check admin permissions
    if (!locals.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Voice ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await request.json();
    const { isPublic } = body;

    // Update the voice
    const [updatedVoice] = await db
      .update(voices)
      .set({
        isPublic: isPublic,
        updatedAt: new Date(),
      })
      .where(eq(voices.id, id))
      .returning();

    if (!updatedVoice) {
      return new Response(JSON.stringify({ error: 'Voice not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(updatedVoice), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating voice:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update voice' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  try {
    // Check admin permissions
    if (!locals.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { id } = params;
    if (!id) {
      return new Response(JSON.stringify({ error: 'Voice ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Delete the voice
    const [deletedVoice] = await db
      .delete(voices)
      .where(eq(voices.id, id))
      .returning();

    if (!deletedVoice) {
      return new Response(JSON.stringify({ error: 'Voice not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting voice:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete voice' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

