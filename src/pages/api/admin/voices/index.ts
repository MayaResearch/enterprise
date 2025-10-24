import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { voices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { supabaseAdmin } from '@/lib/config/supabase';

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
    const voiceDescription = formData.get('voiceDescription') as string;
    const voiceText = formData.get('voiceText') as string;
    const imageFile = formData.get('image') as File;
    const audioFile = formData.get('audio') as File;

    if (!name || !imageFile || !audioFile) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: name, image, audio' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate a unique voice ID
    const timestamp = Date.now();
    const voiceId = `custom_voice_${timestamp}`;
    const userId = locals.user.id;

    // Upload image to Supabase Storage
    const imageExt = imageFile.name.split('.').pop() || 'jpg';
    const imagePath = `voices/${userId}/${voiceId}/avatar.${imageExt}`;
    const imageBuffer = await imageFile.arrayBuffer();
    
    const { data: imageData, error: imageError } = await supabaseAdmin.storage
      .from('voice-assets')
      .upload(imagePath, imageBuffer, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (imageError) {
      console.error('Error uploading image:', imageError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload image' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get public URL for image
    const { data: imageUrlData } = supabaseAdmin.storage
      .from('voice-assets')
      .getPublicUrl(imagePath);
    const imageUrl = imageUrlData.publicUrl;

    // Upload audio to Supabase Storage
    const audioExt = audioFile.name.split('.').pop() || 'mp3';
    const audioPath = `voices/${userId}/${voiceId}/preview.${audioExt}`;
    const audioBuffer = await audioFile.arrayBuffer();
    
    const { data: audioData, error: audioError } = await supabaseAdmin.storage
      .from('voice-assets')
      .upload(audioPath, audioBuffer, {
        contentType: audioFile.type,
        upsert: false,
      });

    if (audioError) {
      console.error('Error uploading audio:', audioError);
      // Clean up uploaded image
      await supabaseAdmin.storage.from('voice-assets').remove([imagePath]);
      return new Response(
        JSON.stringify({ error: 'Failed to upload audio' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Get public URL for audio
    const { data: audioUrlData } = supabaseAdmin.storage
      .from('voice-assets')
      .getPublicUrl(audioPath);
    const audioUrl = audioUrlData.publicUrl;

    // Insert into database
    const [newVoice] = await db
      .insert(voices)
      .values({
        voiceId,
        name,
        description: description || null,
        voiceDescription: voiceDescription || null,
        voiceText: voiceText || null,
        imageUrl,
        previewUrl: audioUrl,
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

