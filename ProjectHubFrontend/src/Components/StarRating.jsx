// src/components/StarRating.jsx
// Interactive star rating component for ProjectDetailPage

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ratingService } from "../api/services";
import { useAuth } from "../context/AuthContext";

export default function StarRating({ projectId, initialRating = 0 }) {
  const { isLoggedIn }        = useAuth();
  const navigate              = useNavigate();
  const [average,  setAverage]  = useState(initialRating);
  const [myRating, setMyRating] = useState(0);
  const [hovered,  setHovered]  = useState(0);
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    ratingService
      .getMyRating(projectId)
      .then((res) => setMyRating(res.data.yourRating || 0))
      .catch(() => {});
  }, [projectId, isLoggedIn]);

  const handleRate = async (score) => {
    if (!isLoggedIn) { navigate("/login"); return; }
    setSaving(true);
    setMsg("");
    try {
      const res = await ratingService.rate(projectId, score);
      setMyRating(score);
      setAverage(res.data.averageRating);
      setMsg(myRating > 0 ? "Rating updated!" : "Thanks for rating!");
      setTimeout(() => setMsg(""), 2000);
    } catch {
      setMsg("Failed to save rating.");
    } finally {
      setSaving(false);
    }
  };

  const display = hovered || myRating;

  return (
    <div className="flex flex-col items-start gap-2">

      {/* Stars row */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={saving}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => handleRate(star)}
            className={`text-2xl transition-all duration-100 hover:scale-110 disabled:cursor-not-allowed ${
              star <= display
                ? "text-orange-400"
                : "text-gray-700 hover:text-orange-300"
            }`}
          >
            ★
          </button>
        ))}

        {/* Average label */}
        <span className="text-sm text-gray-400 ml-2">
          {average.toFixed(1)} avg
        </span>
      </div>

      {/* Feedback message */}
      {msg && (
        <p className="text-xs text-green-400">{msg}</p>
      )}

      {/* Prompt */}
      {!myRating && isLoggedIn && (
        <p className="text-xs text-gray-600">Click a star to rate this project</p>
      )}

      {myRating > 0 && (
        <p className="text-xs text-gray-500">
          Your rating: {myRating}/5 — click to update
        </p>
      )}

      {!isLoggedIn && (
        <p className="text-xs text-gray-600">
          <button
            onClick={() => navigate("/login")}
            className="text-orange-400 hover:text-orange-300"
          >
            Sign in
          </button>{" "}
          to rate this project
        </p>
      )}
    </div>
  );
}