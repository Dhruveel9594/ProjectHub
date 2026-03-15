import { Logo } from "./Navbar";
import { FOOTER_LINKS } from "../data/landingData";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-12 py-7 flex items-center justify-between text-sm text-gray-500">
      <Logo className="text-lg" />

      <div className="flex gap-7">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="hover:text-white transition-colors duration-200"
          >
            {link}
          </a>
        ))}
      </div>

      <p>© 2025 ProjectHub. Made for students 🎓</p>
    </footer>
  );
}