// src/components/CommentsSection.jsx
// Drop this inside ProjectDetailPage below the main content

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { commentService } from "../api/services";
import { useAuth } from "../context/AuthContext";

export default function CommentsSection({ projectId }) {
  const { isLoggedIn, user } = useAuth();
  const navigate             = useNavigate();

  const [comments,  setComments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [newText,   setNewText]   = useState("");
  const [posting,   setPosting]   = useState(false);
  const [error,     setError]     = useState("");

  useEffect(() => {
    commentService
      .getAll(projectId)
      .then((res) => setComments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId]);

  const handlePost = async () => {
    if (!newText.trim()) return;
    setPosting(true);
    setError("");
    try {
      const res = await commentService.add(projectId, newText.trim());
      setComments((prev) => [res.data, ...prev]);
      setNewText("");
    } catch {
      setError("Failed to post comment.");
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentService.delete(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError("Failed to delete comment.");
    }
  };

  return (
    <div className="bg-[#16161f] border border-white/10 rounded-2xl p-6 mt-6">

      <h2
        className="text-base font-bold mb-5"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        💬 Comments ({comments.length})
      </h2>

      {/* ── Post a comment ── */}
      {isLoggedIn ? (
        <div className="mb-6">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Share your thoughts or ask a question..."
            rows={3}
            className="w-full bg-[#0a0a0f] border border-white/10 focus:border-orange-500/50 text-white text-sm rounded-xl px-4 py-3 outline-none resize-none transition-all placeholder:text-gray-600 mb-2"
          />
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              disabled={posting || !newText.trim()}
              className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all"
            >
              {posting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-white/5 rounded-xl px-4 py-3 text-sm text-gray-400">
          <button
            onClick={() => navigate("/login")}
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Sign in
          </button>{" "}
          to leave a comment.
        </div>
      )}

      {/* ── Comments list ── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-600 text-sm py-8">
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              projectId={projectId}
              currentUserId={user?.id}
              isLoggedIn={isLoggedIn}
              onDelete={handleDelete}
              onReplyAdded={(reply) =>
                setComments((prev) =>
                  prev.map((c) =>
                    c.id === comment.id
                      ? { ...c, replies: [...(c.replies || []), reply] }
                      : c
                  )
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Single comment card with reply support ──
function CommentCard({ comment, projectId, currentUserId, isLoggedIn, onDelete, onReplyAdded }) {
  const [showReply,  setShowReply]  = useState(false);
  const [replyText,  setReplyText]  = useState("");
  const [posting,    setPosting]    = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const replies = comment.replies || [];

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      const res = await commentService.reply(projectId, comment.id, replyText.trim());
      onReplyAdded(res.data);
      setReplyText("");
      setShowReply(false);
      setShowReplies(true);
    } catch {
      // silent fail
    } finally {
      setPosting(false);
    }
  };

  const initials = comment.user?.name
    ? comment.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : comment.user?.username?.slice(0, 2)?.toUpperCase() ?? "?";

  const avatarColors = ["bg-orange-500","bg-indigo-500","bg-cyan-500","bg-pink-500"];
  const avatarBg = avatarColors[(comment.user?.id ?? 0) % avatarColors.length];

  return (
    <div className="border border-white/10 rounded-xl p-4">

      {/* Comment header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${avatarBg} flex items-center justify-center text-white text-xs font-bold`}>
            {initials}
          </div>
          <div>
            <span className="text-sm font-medium text-white">
              {comment.user?.name || comment.user?.username}
            </span>
            <span className="text-xs text-gray-600 ml-2">
              {comment.createdAt
                ? new Date(comment.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })
                : ""}
            </span>
          </div>
        </div>

        {/* Delete button — only own comments */}
        {currentUserId && comment.user?.id === currentUserId && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-gray-600 hover:text-red-400 text-xs transition-colors"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Content */}
      <p className="text-sm text-gray-300 leading-relaxed mb-3 ml-9">
        {comment.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-9">
        {isLoggedIn && (
          <button
            onClick={() => setShowReply((p) => !p)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            ↩ Reply
          </button>
        )}
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies((p) => !p)}
            className="text-xs text-gray-500 hover:text-white transition-colors"
          >
            {showReplies ? "▲ Hide" : `▼ ${replies.length} repl${replies.length === 1 ? "y" : "ies"}`}
          </button>
        )}
      </div>

      {/* Reply input */}
      {showReply && (
        <div className="mt-3 ml-9">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            rows={2}
            className="w-full bg-[#0a0a0f] border border-white/10 focus:border-indigo-500/50 text-white text-sm rounded-xl px-3 py-2 outline-none resize-none transition-all placeholder:text-gray-600 mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowReply(false)}
              className="text-xs text-gray-500 hover:text-white px-3 py-1.5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={posting || !replyText.trim()}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
            >
              {posting ? "..." : "Reply"}
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <div className="mt-3 ml-9 space-y-3 border-l-2 border-white/10 pl-4">
          {replies.map((reply) => (
            <div key={reply.id} className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-300 font-medium">
                  {reply.user?.name || reply.user?.username}
                </span>
                <span className="text-xs text-gray-600">
                  {reply.createdAt
                    ? new Date(reply.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short",
                      })
                    : ""}
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}