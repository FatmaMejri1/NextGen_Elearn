import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

interface RegisterBody {
  fullName?: string;
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RegisterBody;
  const fullName = body.fullName?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!fullName || !email || !password) {
    return NextResponse.json(
      { error: 'Full name, email, and password are required.' },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: 'Password must contain at least 6 characters.' },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(
    {
      message: 'Account created successfully.',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    },
    { status: 201 },
  );
}
