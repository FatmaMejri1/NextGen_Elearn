/** Legacy keys from the old localStorage CMS — safe to delete once Supabase is the source of truth. */
const LEGACY_STORAGE_KEYS = ['ng-site-content'] as const;

export function clearLegacyLocalStorage(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  for (const key of LEGACY_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}
