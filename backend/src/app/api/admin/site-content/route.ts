import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  extractLandingPageContent,
  mergeLandingPageContent,
  normalizeSiteContent,
} from '@/lib/site-content/normalize';
import { getSiteContent, resetSiteContent, saveSiteContent } from '@/lib/site-content/repository';
import type { LandingPageContent, SiteContent } from '@/lib/site-content/types';

async function getAdminUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function toAdminResponse(result: Awaited<ReturnType<typeof getSiteContent>>) {
  return {
    content: result.content,
    landing: extractLandingPageContent(result.content),
    updated_at: result.updated_at,
    updated_by: result.updated_by,
    source: result.source,
  };
}

/** Admin read — full site content document. */
export async function GET() {
  try {
    const result = await getSiteContent();
    return NextResponse.json(toAdminResponse(result));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Replace the entire site content document. */
export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as { content?: SiteContent };

    if (!body.content || typeof body.content !== 'object') {
      return NextResponse.json({ error: 'content object is required.' }, { status: 400 });
    }

    const userId = await getAdminUserId();
    const saved = await saveSiteContent(body.content, userId);
    return NextResponse.json(toAdminResponse(saved));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Partial update.
 * - `{ landing: { hero, pricing, ... } }` — الصفحة الرئيسية sections only
 * - `{ content: { ... } }` — any top-level SiteContent keys
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      content?: Partial<SiteContent>;
      landing?: Partial<LandingPageContent>;
    };

    const current = await getSiteContent();
    let nextContent: SiteContent;

    if (body.landing) {
      nextContent = mergeLandingPageContent(current.content, body.landing);
    } else if (body.content) {
      nextContent = normalizeSiteContent({ ...current.content, ...body.content });
    } else {
      return NextResponse.json({ error: 'Provide content or landing patch.' }, { status: 400 });
    }

    const userId = await getAdminUserId();
    const saved = await saveSiteContent(nextContent, userId);
    return NextResponse.json(toAdminResponse(saved));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/admin/site-content?action=reset — restore factory defaults. */
export async function POST(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action');

  if (action !== 'reset') {
    return NextResponse.json({ error: 'Unsupported action. Use ?action=reset' }, { status: 400 });
  }

  try {
    const userId = await getAdminUserId();
    const saved = await resetSiteContent(userId);
    return NextResponse.json(toAdminResponse(saved));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to reset site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
