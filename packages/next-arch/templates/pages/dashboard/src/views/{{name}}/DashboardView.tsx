import { AnalyticsCard } from '@/features/{{name}}';

export function DashboardView() {
  return (
    <main className="grid gap-4 p-8 md:grid-cols-2">
      <AnalyticsCard title="Users" value="1,234" />
      <AnalyticsCard title="Revenue" value="$12,340" />
    </main>
  );
}
