"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "About",    href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills" },
  { label: "Contact",  href: "#contact" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "var(--nav-bg)", borderBottom: "1px solid var(--rule)" }}
    >
      <nav className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#about"
          className="font-sans text-sm font-semibold tracking-widest uppercase"
          style={{ color: "var(--heading)" }}
        >
          Dat Do
        </a>

        <div className="flex items-center gap-10">
          {/* Nav links — small caps */}
          <ul className="hidden sm:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-xs font-semibold tracking-widest uppercase transition-colors duration-150 hover:text-[#2251FF]"
                  style={{ color: "var(--muted)" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="p-1.5 transition-colors hover:text-electric"
              style={{ color: "var(--muted)" }}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
