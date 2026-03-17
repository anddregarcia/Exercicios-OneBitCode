export function PageHelp({ text }: { text: string }) {
  return (
    <div className="rounded-lg border bg-blue-50 p-3 text-sm text-blue-900">
      <span className="mr-2">ℹ️</span>
      {text}
    </div>
  );
}
