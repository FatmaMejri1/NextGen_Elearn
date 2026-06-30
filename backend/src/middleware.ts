import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { createAdminClient } from './lib/supabase/server';
import { generateDeviceFingerprint, validateDevice } from './lib/device';

export const runtime = 'nodejs';
function addCorsHeaders(response: NextResponse, request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = new Set([
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'http://localhost:4201',
    'http://127.0.0.1:4201',
  ]);

  if (origin && allowedOrigins.has(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Vary', 'Origin');
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function middleware(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return addCorsHeaders(new NextResponse(null, { status: 204 }), request);
  }

  // 1. Refresh session and get the authenticated user
  const { supabaseResponse, user } = await updateSession(request);

  const path = request.nextUrl.pathname;

  // Bypass authentication for public auth routes (e.g. login)
  if (
    path.startsWith('/api/auth/login') ||
    path.startsWith('/api/auth/logout') ||
    path.startsWith('/api/auth/register')
  ) {
    return addCorsHeaders(supabaseResponse, request);
  }

  // Protect course video, progress, and administrative APIs
  if (
    path.startsWith('/api/admin') ||
    path.startsWith('/api/video') ||
    path.startsWith('/api/progress') ||
    path.startsWith('/api/user')
  ) {
    if (!user) {
      return addCorsHeaders(
        NextResponse.json({ error: 'Unauthorized: Session required' }, { status: 401 }),
        request,
      );
    }

    const adminClient = createAdminClient();

    // Fetch user details (is_admin, email)
    const { data: profile, error } = await adminClient
      .from('users')
      .select('is_admin, email')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return addCorsHeaders(
        NextResponse.json({ error: 'Forbidden: Profile not found' }, { status: 403 }),
        request,
      );
    }

    // 2. Admin Route Protection
    if (path.startsWith('/api/admin')) {
      if (!profile.is_admin) {
        return addCorsHeaders(
          NextResponse.json({ error: 'Forbidden: Admin access only' }, { status: 403 }),
          request,
        );
      }
    }

    // 3. Device Locking Guard (only applies to non-admin students)
    if (!profile.is_admin) {
      // Retrieve client IP and User-Agent
      const ip = (request as any).ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
      const ua = request.headers.get('user-agent') || '';
      const currentFingerprint = await generateDeviceFingerprint(ip, ua);

      const deviceValidation = await validateDevice(
        user.id,
        profile.email || user.email || '',
        currentFingerprint,
        adminClient
      );

      if (!deviceValidation.valid) {
        return addCorsHeaders(
          NextResponse.json(
            { error: deviceValidation.message || 'Device lock active' },
            { status: 403 },
          ),
          request,
        );
      }
    }
  }

  return addCorsHeaders(supabaseResponse, request);
}

// Apply middleware to API paths
export const config = {
  matcher: ['/api/:path*'],
};
