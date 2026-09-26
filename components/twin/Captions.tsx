export default function Captions({ text, visible }: { text: string; visible: boolean }) {
  if (!visible || !text) return null;

  return (
    <p
      aria-live="polite"
      className="mx-auto max-w-xl rounded-xl bg-accent/10 px-4 py-3 text-center text-sm text-foreground"
    >
      {text}
    </p>
  );
}
