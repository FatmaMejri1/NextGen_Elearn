import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ProgressBody {
  lesson_id?: string;
  position_seconds?: number;
  completed?: boolean;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('progress')
    .select('user_id, lesson_id, position_seconds, completed, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data ?? [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as ProgressBody;
  if (!body.lesson_id) {
    return NextResponse.json({ error: 'Lesson ID is required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('progress')
    .upsert({
      user_id: user.id,
      lesson_id: body.lesson_id,
      position_seconds: Number(body.position_seconds ?? 0),
      completed: Boolean(body.completed),
      updated_at: new Date().toISOString(),
    })
    .select('user_id, lesson_id, position_seconds, completed, updated_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
