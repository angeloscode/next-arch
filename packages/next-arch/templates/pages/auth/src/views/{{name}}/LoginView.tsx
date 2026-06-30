import { LoginForm } from '@/features/{{name}}';

export function LoginView() {
  return (
    <main className="w-full max-w-md space-y-4 rounded-xl border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-semibold">Вход</h1>
      <LoginForm />
    </main>
  );
}
