import { useState, useEffect } from "react";
import { NAV_LINKS } from "../data/landingData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-12 py-4 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0f]/95" : "bg-[#0a0a0f]/70"
      }`}
    >
      {/* Logo */}
      <Logo />

      {/* Nav Links */}
      <ul className="flex gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all duration-200 hover:-translate-y-0.5">
        Upload Project →
      </button>
    </nav>
  );
}

// ── Logo ─────────────────────────────────────────────────────
export function Logo({ className = "text-xl" }) {
  return (
    <div className={`font-bold tracking-tight ${className}`} style={{ fontFamily: "'Syne', sans-serif" }}>
      Project<span className="text-orange-500">Hub</span>
    </div>
  );
}