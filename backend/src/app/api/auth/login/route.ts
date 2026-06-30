import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createAdminClient } from '@/lib/supabase/server';

interface LoginBody {
  email?: string;
  password?: string;
}

export async function GET() {
  return NextResponse.json(
    { error: 'Use POST /api/auth/login with email and password.' },
    { status: 405 },
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as LoginBody;
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  let response = NextResponse.json({ success: true, is_admin: false });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return NextResponse.json({ error: error?.message || 'Invalid login credentials.' }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('users')
    .select('is_admin')
    .eq('id', data.user.id)
    .single();

  const isAdmin = Boolean(profile?.is_admin);
  const sessionCookies = response.cookies.getAll();
  response = NextResponse.json({ success: true, is_admin: isAdmin });
  sessionCookies.forEach(({ name, value }) => {
    response.cookies.set(name, value);
  });

  return response;
}
