import { NextRequest, NextResponse } from 'next/server';
import { generateBunnySignedUrl } from '@/lib/bunny';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  const { lessonId } = await params;
  const libraryId = process.env.BUNNY_LIBRARY_ID;

  if (!libraryId) {
    return NextResponse.json({ error: 'BUNNY_LIBRARY_ID is not configured.' }, { status: 500 });
  }

  const supabase = createAdminClient();
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('id, title, bunny_video_id')
    .eq('id', lessonId)
    .single();

  if (error || !lesson) {
    return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 });
  }

  if (!lesson.bunny_video_id) {
    return NextResponse.json({ error: 'This lesson does not have a Bunny.net video ID.' }, { status: 404 });
  }

  const signedVideo = generateBunnySignedUrl(libraryId, lesson.bunny_video_id);
  return NextResponse.json({ lessonId, title: lesson.title, ...signedVideo });
}
