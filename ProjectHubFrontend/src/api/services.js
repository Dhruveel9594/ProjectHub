// src/api/services.js

import api from "./axiosConfig";

// ══════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login:    (data) => api.post("/auth/login",    data),
  logout:   (data) => api.post("/auth/logout",   data),
  refresh:  (data) => api.post("/auth/refresh",  data),
};

// ══════════════════════════════════════════════
//  USER
// ══════════════════════════════════════════════
export const userService = {
  getById:    (id)       => api.get(`/user/${id}`),
  updateUser: (id, data) => api.put(`/user/${id}`, data),
  myProjects: (id)       => api.get(`/user/${id}/projects`),
};

// ══════════════════════════════════════════════
//  PROJECTS
// ══════════════════════════════════════════════
export const projectService = {
  getAll:   (params) => api.get("/projects", { params }),
  getById:  (id)     => api.get(`/projects/${id}`),
  create:   (data)   => api.post("/projects", data),
  update:   (id, data) => api.put(`/projects/${id}`, data),
  delete:   (id)     => api.delete(`/projects/${id}`),
  search:   (q)      => api.get("/projects/search", { params: { q } }),
  trending: ()       => api.get("/projects/trending"),
};

// ══════════════════════════════════════════════
//  BOOKMARKS
// ══════════════════════════════════════════════
export const bookmarkService = {
  // Toggle bookmark — returns { bookmarked: true/false }
  toggle:       (projectId) => api.post(`/bookmarks/project/${projectId}`),

  // Check if current user bookmarked a project
  getStatus:    (projectId) => api.get(`/bookmarks/project/${projectId}/status`),

  // Get all projects bookmarked by current user
  getMyBookmarks: ()        => api.get("/bookmarks/my"),
};

// ══════════════════════════════════════════════
//  COMMENTS
// ══════════════════════════════════════════════
export const commentService = {
  // Get all comments for a project
  getAll:    (projectId)                    => api.get(`/comments/project/${projectId}`),

  // Post a new comment
  add:       (projectId, content)           => api.post(`/comments/project/${projectId}`, { content }),

  // Reply to a comment
  reply:     (projectId, parentId, content) =>
    api.post(`/comments/project/${projectId}/reply/${parentId}`, { content }),

  // Delete own comment
  delete:    (commentId)                    => api.delete(`/comments/${commentId}`),
};

// ══════════════════════════════════════════════
//  RATINGS
// ══════════════════════════════════════════════
export const ratingService = {
  // Rate a project (score 1-5). Updates if already rated.
  rate:       (projectId, score)  => api.post(`/ratings/project/${projectId}`, { score }),

  // Get current user's rating for a project
  getMyRating: (projectId)        => api.get(`/ratings/project/${projectId}/my`),

  // Get average rating
  getAverage:  (projectId)        => api.get(`/ratings/project/${projectId}/average`),
};