import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { voices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ locals }) => {
  try {
    // Check admin permissions
    if (!locals.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch all voices (admin can see all)
    const allVoices = await db
      .select()
      .from(voices)
      .orderBy(voices.createdAt);

    return new Response(JSON.stringify(allVoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching voices:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch voices' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    // Check admin permissions
    if (!locals.user?.isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const testText = formData.get('testText') as string;
    const seed = formData.get('seed') as string;
    const imageFile = formData.get('image') as File;
    const audioFile = formData.get('audio') as File;

    if (!name || !imageFile || !audioFile) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // For now, store files as base64 data URLs
    // TODO: Implement Supabase Storage upload
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:${imageFile.type};base64,${imageBase64}`;

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioUrl = `data:${audioFile.type};base64,${audioBase64}`;

    // Generate a unique voice ID
    const timestamp = Date.now();
    const voiceId = `custom_voice_${timestamp}`;

    // Insert into database
    const [newVoice] = await db
      .insert(voices)
      .values({
        voiceId,
        name,
        description: description || null,
        imageUrl,
        previewUrl: audioUrl,
        category: 'custom',
        isPublic: false,
        createdById: locals.user.id,
      })
      .returning();

    return new Response(JSON.stringify(newVoice), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating voice:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create voice' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

