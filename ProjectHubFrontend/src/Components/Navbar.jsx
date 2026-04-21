// src/components/Navbar.jsx

import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/services";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#profile-menu")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const accessToken  = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      await authService.logout({ accessToken, refreshToken });
    } catch {
      // still logout even if API call fails
    }
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: "Browse",      path: "/browse"      },
    { label: "Departments", path: "/departments"  },
    { label: "Ideas Board", path: "/ideas"        },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0f]/95" : "bg-[#0a0a0f]/70"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <Logo />
      </Link>

      {/* Nav links */}
      <ul className="hidden md:flex gap-7 list-none">
        {navLinks.map(({ label, path }) => (
          <li key={label}>
            <Link
              to={path}
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === path
                  ? "text-orange-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <Link
              to="/create-project"
              className="hidden md:block bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:-translate-y-0.5"
            >
              + Upload Project
            </Link>

            {/* Profile dropdown */}
            <div className="relative" id="profile-menu">
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white text-sm font-bold hover:bg-indigo-400 transition-colors"
              >
                {user?.username?.charAt(0)?.toUpperCase() ?? "U"}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-[#16161f] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-semibold text-white truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    to="/create-project"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    📤 Upload Project
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors border-t border-white/10"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-all hover:-translate-y-0.5"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export function Logo({ className = "text-xl" }) {
  return (
    <div
      className={`font-bold tracking-tight ${className}`}
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      Project<span className="text-orange-500">Hub</span>
    </div>
  );
}