// ─── landingData.js ──────────────────────────────────────────
//  All static content lives here.
//  To update text/data, only edit this file.
// ─────────────────────────────────────────────────────────────

export const NAV_LINKS = ["Browse", "Departments", "Ideas Board", "About"];

export const STATS = [
  { value: "1,240+", color: "text-orange-400",  label: "Projects Uploaded"   },
  { value: "38",     color: "text-indigo-400",   label: "Departments"         },
  { value: "5,800+", color: "text-cyan-400",     label: "Students Registered" },
  { value: "12",     color: "text-green-400",    label: "Colleges"            },
];

export const FLOATING_TAGS = [
  { color: "bg-orange-500", label: "Final Year Projects" },
  { color: "bg-indigo-500", label: "Mini Projects"       },
  { color: "bg-cyan-500",   label: "Research Papers"     },
  { color: "bg-green-500",  label: "Idea Board"          },
  { color: "bg-pink-500",   label: "Open Source"         },
];

export const PROJECTS = [
  {
    icon: "🤖",
    iconBg: "bg-orange-500/10",
    year: "2024 • CSE",
    title: "AI-Based Attendance System",
    desc: "Face recognition attendance using OpenCV and Python. Reduces manual effort by 90% and integrates with college ERP.",
    tags: [
      { label: "Python",  style: "bg-orange-500/15 text-orange-300" },
      { label: "OpenCV",  style: "bg-indigo-500/15 text-indigo-300" },
      { label: "AI/ML",   style: "bg-cyan-500/15   text-cyan-300"   },
    ],
    avatarBg: "bg-orange-500",
    initials: "RK",
    author: "Rahul Kumar",
    rating: "⭐ 4.8 · 142 saves",
  },
  {
    icon: "🌾",
    iconBg: "bg-indigo-500/10",
    year: "2024 • IT",
    title: "Smart Irrigation System",
    desc: "IoT-based irrigation using soil moisture sensors and NodeMCU. Reduces water usage by 60% with automated control.",
    tags: [
      { label: "IoT",     style: "bg-indigo-500/15 text-indigo-300" },
      { label: "NodeMCU", style: "bg-green-500/15  text-green-300"  },
      { label: "Arduino", style: "bg-cyan-500/15   text-cyan-300"   },
    ],
    avatarBg: "bg-indigo-500",
    initials: "PS",
    author: "Priya Shah",
    rating: "⭐ 4.6 · 98 saves",
  },
  {
    icon: "🏥",
    iconBg: "bg-cyan-500/10",
    year: "2023 • CSE",
    title: "Hospital Management System",
    desc: "Full stack web app managing patient records, appointments, and billing. Built with React and Spring Boot.",
    tags: [
      { label: "React",       style: "bg-indigo-500/15 text-indigo-300" },
      { label: "Spring Boot", style: "bg-orange-500/15 text-orange-300" },
      { label: "MySQL",       style: "bg-green-500/15  text-green-300"  },
    ],
    avatarBg: "bg-cyan-500",
    initials: "AM",
    author: "Arjun Mehta",
    rating: "⭐ 4.9 · 210 saves",
  },
];

export const HOW_IT_WORKS = [
  { num: "01", icon: "🎓", title: "Register with College Email",  desc: "Sign up using your college Google account. Your branch and year are auto-detected." },
  { num: "02", icon: "📤", title: "Upload Your Project",          desc: "Add title, description, tech stack, GitHub link, and demo images."                   },
  { num: "03", icon: "🔍", title: "Juniors Discover It",          desc: "Students from next batches find, bookmark, and get inspired by your work."            },
  { num: "04", icon: "💬", title: "Discuss & Collaborate",        desc: "Juniors comment and ask questions. Seniors mentor the next batch."                    },
];

export const FEATURES = [
  { icon: "🔎", title: "Smart Search & Filters",  desc: "Filter by department, year, tech stack, or project type. Find exactly what you need in seconds."          },
  { icon: "💡", title: "Idea Board",               desc: "Post project ideas you couldn't finish. Let someone else pick it up and give you full credit."            },
  { icon: "🏅", title: "Faculty Verified Badge",   desc: "Projects that were officially graded get a verified badge for extra credibility."                        },
  { icon: "👤", title: "Student Portfolio",        desc: "Your profile becomes a portfolio showing all your projects — great for internships and placements."       },
  { icon: "🔖", title: "Bookmarks & Saves",        desc: "Save projects you want to refer back to. Build your personal collection of references."                  },
  { icon: "📊", title: "Batch Leaderboard",        desc: "See which students and batches contribute the most. Healthy competition drives quality."                  },
];

export const FOOTER_LINKS = ["About", "Contact", "Privacy", "GitHub"];