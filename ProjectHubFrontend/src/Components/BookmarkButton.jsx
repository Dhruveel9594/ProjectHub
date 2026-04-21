// src/components/BookmarkButton.jsx
// Drop this anywhere you want a bookmark toggle button

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { bookmarkService } from "../api/services";
import { useAuth } from "../context/AuthContext";

export default function BookmarkButton({ projectId, initialCount = 0 }) {
  const { isLoggedIn }          = useAuth();
  const navigate                = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [count,      setCount]      = useState(initialCount);
  const [loading,    setLoading]    = useState(false);

  // Fetch initial bookmark status if user is logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    bookmarkService
      .getStatus(projectId)
      .then((res) => setBookmarked(res.data.bookmarked))
      .catch(() => {});
  }, [projectId, isLoggedIn]);

  const handleToggle = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const res = await bookmarkService.toggle(projectId);
      const added = res.data.bookmarked;
      setBookmarked(added);
      setCount((c) => added ? c + 1 : Math.max(0, c - 1));
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
        bookmarked
          ? "bg-orange-500/15 border-orange-500/50 text-orange-300 hover:bg-orange-500/25"
          : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
      }`}
    >
      <span>{bookmarked ? "🔖" : "🔖"}</span>
      <span>{bookmarked ? "Saved" : "Save"}</span>
      <span className={`text-xs ${bookmarked ? "text-orange-400" : "text-gray-600"}`}>
        {count}
      </span>
    </button>
  );
}