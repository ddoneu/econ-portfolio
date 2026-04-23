import { Mail, Link } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" style={{ borderTop: "1px solid var(--rule)" }}>
      <div className="max-w-6xl mx-auto px-8 py-24">
        <SectionHeading>Contact</SectionHeading>
        <p
          className="font-sans text-base mt-4 max-w-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Open to research collaborations, internships, and conversations about
          finance, economics, and data.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:do.dat@northeastern.edu"
            className="font-sans inline-flex items-center gap-3 text-sm font-semibold text-white bg-[#2251FF] hover:bg-[#1840e0] transition-colors duration-150 rounded-[2px]"
            style={{ padding: "0.75rem 1.75rem" }}
          >
            <Mail size={15} />
            do.dat@northeastern.edu
          </a>
          <a
            href="https://linkedin.com/in/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans inline-flex items-center gap-3 text-sm font-semibold rounded-[2px] hover:text-white hover:bg-[#2251FF] transition-colors duration-150"
            style={{
              padding: "0.75rem 1.75rem",
              color: "#2251FF",
              border: "1px solid #2251FF",
            }}
          >
            <Link size={15} />
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="w-10 h-0.5 bg-[#2251FF] mb-4" />
      <h2
        className="font-display font-bold tracking-tight"
        style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", color: "var(--heading)" }}
      >
        {children}
      </h2>
    </div>
  );
}
