import { SettingsTabs } from '@/features/{{name}}';

export function SettingsView() {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-4 text-3xl font-semibold">Settings</h1>
      <SettingsTabs />
    </main>
  );
}
