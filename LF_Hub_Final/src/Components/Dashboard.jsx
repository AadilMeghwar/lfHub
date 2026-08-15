import { useEffect, useState } from "react";
import { api } from "../api";
import Sidebar from "./Sidebar";
import BrowseItems from "./BrowseItems";
import ReportLost from "./ReportLost";
import ReportFound from "./ReportFound";
import MyItems from "./MyItems";
import Notifications from "./Notifications";
import Profile from "./Profile";
import { RiErrorWarningLine, RiCheckboxCircleLine } from "react-icons/ri";
import "../App.css";

const STATS = [
  { label: "Lost Reports", value: 142, note: "+12 this week", color: "red" },
  { label: "Found Reports", value: 118, note: "+9 this week", color: "cyan" },
  { label: "Reunited", value: 87, note: "61% resolution rate", color: "green" },
  { label: "Pending Match", value: 55, note: "24 high priority", color: "yellow" },
];

const RECENT_REPORTS = [
  { id: 1, title: "iPhone 14 Pro — Black", location: "Library, Floor 2", time: "2h ago", status: "LOST", urgent: true },
  { id: 2, title: "Blue Water Bottle", location: "Cafeteria", time: "3h ago", status: "FOUND" },
  { id: 3, title: "Laptop Bag — Dell", location: "Lecture Hall B", time: "5h ago", status: "LOST", urgent: true },
  { id: 4, title: "Student ID Card", location: "Parking Lot C", time: "6h ago", status: "FOUND" },
  { id: 5, title: "AirPods Pro (Case)", location: "Sports Complex", time: "8h ago", status: "LOST" },
  { id: 6, title: "Red Umbrella", location: "Main Gate", time: "10h ago", status: "FOUND" },
];

const AI_MATCHES = [
  { id: 1, lost: "iPhone 14 Pro", found: "Black smartphone", time: "1h ago", confidence: 94 },
  { id: 2, lost: "Dell Laptop Bag", found: "Dark laptop bag", time: "4h ago", confidence: 78 },
  { id: 3, lost: "AirPods Pro", found: "White earphone case", time: "7h ago", confidence: 65 },
];

function confidenceClass(pct) {
  if (pct >= 85) return "high";
  if (pct >= 70) return "mid";
  return "low";
}

// Every sidebar destination *other* than Dashboard itself. Dashboard is the
// entry point after login, so it doubles as the router: if currentView
// matches one of these, we hand off entirely; otherwise Dashboard renders
// its own content below.
const OTHER_SCREENS = {
  "Browse Items": BrowseItems,
  "Report Lost": ReportLost,
  "Report Found": ReportFound,
  "My Items": MyItems,
  Notifications: Notifications,
  Profile: Profile,
};

export default function Dashboard({ user, onSignOut }) {
  // Dashboard owns navigation state for the whole post-login app. Whatever
  // screen it hands off to receives `setCurrentView` as its `onNavigate`
  // prop, so a click from *any* screen's sidebar routes back through here —
  // there's no dependency on the parent (loginRegister.jsx) to wire this up.
  const [currentView, setCurrentView] = useState("Dashboard");
  const [data, setData] = useState({stats:{lost:0,found:0,reunited:0,pending:0},recent:[],matches:[]});
  useEffect(() => { api.dashboard().then(setData).catch(console.error); }, [currentView]);

  const ActiveScreen = OTHER_SCREENS[currentView];
  if (ActiveScreen) {
    return <ActiveScreen user={user} onNavigate={setCurrentView} onSignOut={onSignOut} />;
  }

  const currentUser = user || { name: "Amal", meta: "CS · Year 3", initials: "AK" };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
  <div className="dashboard-layout">
    <Sidebar
      active="Dashboard"
      onNavigate={setCurrentView}
      user={{
        name: "Amal Kumar",
        meta: currentUser.meta,
        initials: currentUser.initials,
      }}
    />

    <main className="dashboard-main">
      <div className="dashboard-header">
        <div className="dashboard-date">
          {today.toUpperCase()}
        </div>

        <h1 className="dashboard-greeting">
          Good morning, {currentUser.name}.
        </h1>

        <p className="dashboard-subtitle">
          Here's what's happening on campus today.
        </p>
      </div>

      <div className="stats-grid">
        {[
          {
            label: "Lost Reports",
            value: data.stats.lost,
            note: "from database",
            color: "red",
          },
          {
            label: "Found Reports",
            value: data.stats.found,
            note: "from database",
            color: "cyan",
          },
          {
            label: "Reunited",
            value: data.stats.reunited,
            note: "resolved reports",
            color: "green",
          },
          {
            label: "Pending Match",
            value: data.stats.pending,
            note: "active reports",
            color: "yellow",
          },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div className="stat-label">
              {stat.label}
            </div>

            <div className={`stat-value ${stat.color}`}>
              {stat.value}
            </div>

            <div className="stat-note">
              {stat.note}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">

        {/* ---------- Recent Reports ---------- */}
        <section className="content-col">
          <div className="section-heading">
            RECENT REPORTS
          </div>

          <div className="report-list">
            {data.recent.map((report) => (
              <div
                className="report-item"
                key={report.id}
              >
                <div
                  className={`report-icon ${
                    report.status === "LOST"
                      ? "lost"
                      : "found"
                  }`}
                >
                  {report.status === "LOST" ? (
                    <RiErrorWarningLine />
                  ) : (
                    <RiCheckboxCircleLine />
                  )}
                </div>

                <div className="report-info">
                  <div className="report-title-row">
                    <span className="report-title">
                      {report.title}
                    </span>

                    {report.urgent && (
                      <span className="tag urgent">
                        URGENT
                      </span>
                    )}
                  </div>

                  <div className="report-meta">
                    {report.location} · {report.time}
                  </div>
                </div>

                <span
                  className={`tag ${
                    report.status === "LOST"
                      ? "lost"
                      : "found"
                  }`}
                >
                  {report.status}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="view-all-btn"
          >
            View all items →
          </button>
        </section>

        {/* ---------- AI Matches + Quick Report ---------- */}
        <section className="content-col">
          <div className="section-heading">
            AI MATCHES
          </div>

          <div className="match-list">
            {data.matches.map((match) => (
              <div
                className="match-card"
                key={match.id}
              >
                <div className="match-top">
                  <span className="match-found-label">
                    MATCH FOUND
                  </span>

                  <span className="match-time">
                    {match.time}
                  </span>
                </div>

                <div className="match-names">
                  <span className="match-lost">
                    {match.lost}
                  </span>

                  <span className="match-arrow">
                    ↔
                  </span>

                  <span className="match-found">
                    {match.found}
                  </span>
                </div>

                <div className="match-progress-track">
                  <div
                    className={`match-progress-fill ${
                      confidenceClass(match.confidence)
                    }`}
                    style={{
                      width: `${match.confidence}%`,
                    }}
                  />
                </div>

                <div className="match-percent">
                  {match.confidence}%
                </div>
              </div>
            ))}
          </div>

          <div className="section-heading quick-report-heading">
            QUICK REPORT
          </div>

          <div className="quick-report-buttons">
            <button
              type="button"
              className="quick-btn lost"
              onClick={() => setCurrentView("Report Lost")}
            >
              <RiErrorWarningLine size={18} />
              I lost something
            </button>

            <button
              type="button"
              className="quick-btn found"
              onClick={() => setCurrentView("Report Found")}
            >
              <RiCheckboxCircleLine size={18} />
              I found something
            </button>
          </div>
        </section>

      </div>
    </main>
  </div>
);
}