export default function {{Name}}Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">Sidebar</aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
