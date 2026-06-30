import { createAdminClient } from '@/lib/supabase/server';
import { defaultSiteContent } from './defaults';
import { normalizeSiteContent } from './normalize';
import { SITE_CONTENT_ROW_ID, type SiteContent } from './types';

interface SiteContentRow {
  id: string;
  content: Partial<SiteContent> | null;
  updated_at: string;
  updated_by: string | null;
}

export interface SiteContentResponse {
  content: SiteContent;
  updated_at: string | null;
  updated_by: string | null;
  source: 'database' | 'defaults';
}

export async function getSiteContent(): Promise<SiteContentResponse> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('id, content, updated_at, updated_by')
    .eq('id', SITE_CONTENT_ROW_ID)
    .maybeSingle();

  if (error) {
    if (isMissingSiteContentTable(error)) {
      return {
        content: defaultSiteContent(),
        updated_at: null,
        updated_by: null,
        source: 'defaults',
      };
    }
    throw new Error(error.message);
  }

  if (!data) {
    return {
      content: defaultSiteContent(),
      updated_at: null,
      updated_by: null,
      source: 'defaults',
    };
  }

  const row = data as SiteContentRow;
  const stored = row.content ?? {};
  const isEmpty = !stored || Object.keys(stored).length === 0;

  return {
    content: normalizeSiteContent(stored),
    updated_at: row.updated_at,
    updated_by: row.updated_by,
    source: isEmpty ? 'defaults' : 'database',
  };
}

export async function saveSiteContent(
  content: SiteContent,
  updatedBy?: string | null,
): Promise<SiteContentResponse> {
  const supabase = createAdminClient();
  const normalized = normalizeSiteContent(content);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('site_content')
    .upsert(
      {
        id: SITE_CONTENT_ROW_ID,
        content: normalized,
        updated_at: now,
        updated_by: updatedBy ?? null,
      },
      { onConflict: 'id' },
    )
    .select('id, content, updated_at, updated_by')
    .single();

  if (error) {
    if (isMissingSiteContentTable(error)) {
      throw new Error(
        'site_content table is missing. Run: npm run db:site-content in the backend folder.',
      );
    }
    throw new Error(error.message);
  }

  const row = data as SiteContentRow;

  return {
    content: normalizeSiteContent(row.content ?? normalized),
    updated_at: row.updated_at,
    updated_by: row.updated_by,
    source: 'database',
  };
}

function isMissingSiteContentTable(error: { code?: string; message?: string }): boolean {
  const message = error.message?.toLowerCase() ?? '';
  return (
    error.code === '42P01' ||
    error.code === 'PGRST205' ||
    (message.includes('site_content') &&
      (message.includes('does not exist') || message.includes('could not find')))
  );
}

export async function resetSiteContent(updatedBy?: string | null): Promise<SiteContentResponse> {
  return saveSiteContent(defaultSiteContent(), updatedBy);
}
