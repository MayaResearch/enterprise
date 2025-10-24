import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { voices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { supabaseAdmin } from '@/lib/config/supabase';

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

    const contentType = request.headers.get('content-type');

    // Handle FormData (edit voice with image upload)
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const imageFile = formData.get('image') as File | null;

      if (!name || !name.trim()) {
        return new Response(JSON.stringify({ error: 'Voice name is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Build update object
      const updateData: any = {
        name: name.trim(),
        description: description?.trim() || null,
        updatedAt: new Date(),
      };

      // Handle image upload if provided
      if (imageFile) {
        const imageBuffer = await imageFile.arrayBuffer();
        const imagePath = `images/${id}_${Date.now()}.${imageFile.name.split('.').pop()}`;
        
        const { data: imageData, error: imageError } = await supabaseAdmin
          .storage
          .from('voice-assets')
          .upload(imagePath, imageBuffer, {
            contentType: imageFile.type,
            upsert: true,
          });

        if (imageError) {
          console.error('Image upload error:', imageError);
          return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('voice-assets')
          .getPublicUrl(imagePath);

        updateData.imageUrl = publicUrl;
      }

      // Update the voice
      const [updatedVoice] = await db
        .update(voices)
        .set(updateData)
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
    }

    // Handle JSON (toggle isPublic)
    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== 'boolean') {
      return new Response(JSON.stringify({ error: 'isPublic must be a boolean' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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

