import { NextRequest, NextResponse } from 'next/server';
import { MoodProfile } from '@/types';
import { getMoodById } from '@/lib/moods';

export async function POST(request: NextRequest) {
  try {
    const { mood, genres = [], country, rollValue } = await request.json();

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood is required' },
        { status: 400 }
      );
    }

    const moodData = getMoodById(mood);
    if (!moodData) {
      return NextResponse.json(
        { error: 'Invalid mood' },
        { status: 400 }
      );
    }

    // Try using OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const OpenAI = (await import('openai')).default;
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `Generate a music discovery profile for the following mood: "${moodData.name}" (${moodData.description}).
${genres.length > 0 ? `User prefers these genres: ${genres.join(', ')}.` : ''}
${country ? `Include influences from: ${country}.` : ''}
${rollValue ? `Playlist discovery factor: ${rollValue}/20 (higher = more adventurous).` : ''}

Respond with ONLY a JSON object (no markdown, no code blocks) with this exact structure:
{
  "searchKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "playlistName": "Creative playlist name",
  "playlistDescription": "Engaging playlist description",
  "extraHints": ["hint1", "hint2"]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a music discovery assistant. Respond only with valid JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.8,
        });

        const response = completion.choices[0]?.message?.content;
        if (response) {
          const profile: MoodProfile = JSON.parse(response);
          return NextResponse.json(profile);
        }
      } catch (error) {
        console.error('OpenAI error, using fallback:', error);
        // Fall through to fallback
      }
    }

    // Fallback: use hardcoded templates
    const fallbackProfile: MoodProfile = {
      searchKeywords: moodData.fallbackKeywords,
      playlistName: `${moodData.name} ${genres.length > 0 ? genres[0] : 'Discovery'}`,
      playlistDescription: moodData.description,
      extraHints: [],
    };

    return NextResponse.json(fallbackProfile);
  } catch (error) {
    console.error('Mood profile error:', error);
    return NextResponse.json(
      { error: 'Failed to generate mood profile' },
      { status: 500 }
    );
  }
}
