import { ProfileCard } from '@/features/{{name}}';

export function ProfileView() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <ProfileCard name="Demo User" email="demo@example.com" />
    </main>
  );
}
