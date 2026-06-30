import { NextResponse } from 'next/server';
import { extractLandingPageContent } from '@/lib/site-content/normalize';
import { getSiteContent } from '@/lib/site-content/repository';

/** Public read — landing page + site content for the marketing site. */
export async function GET() {
  try {
    const result = await getSiteContent();

    return NextResponse.json({
      content: result.content,
      landing: extractLandingPageContent(result.content),
      updated_at: result.updated_at,
      source: result.source,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
