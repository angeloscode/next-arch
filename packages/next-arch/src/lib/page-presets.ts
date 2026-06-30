export type PagePreset = 'auth' | 'dashboard' | 'crud' | 'profile' | 'settings' | 'blank';

export const PAGE_PRESETS: PagePreset[] = [
  'auth',
  'dashboard',
  'crud',
  'profile',
  'settings',
  'blank',
];

export const DEFAULT_PAGE_PRESET: PagePreset = 'blank';

export const PAGE_PRESET_LABELS: Record<PagePreset, string> = {
  auth: 'auth — login/register/logout flow',
  dashboard: 'dashboard — layout with sidebar + analytics',
  crud: 'crud — list + create/edit/delete',
  profile: 'profile — user profile page',
  settings: 'settings — tabbed settings page',
  blank: 'blank — minimal page structure',
};
