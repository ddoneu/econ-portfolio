export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule)" }}>
      <div className="max-w-6xl mx-auto px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-sans text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--muted)" }}>
          © {new Date().getFullYear()} Dat Do
        </p>
        <p className="font-sans text-xs" style={{ color: "var(--muted)", opacity: 0.5 }}>
          Built with Next.js · Tailwind CSS
        </p>
      </div>
    </footer>
  );
}
