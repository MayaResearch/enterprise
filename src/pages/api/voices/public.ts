import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { voices } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  try {
    // Fetch only public voices
    const publicVoices = await db
      .select()
      .from(voices)
      .where(eq(voices.isPublic, true))
      .orderBy(voices.createdAt);

    return new Response(JSON.stringify(publicVoices), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching public voices:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch public voices' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

