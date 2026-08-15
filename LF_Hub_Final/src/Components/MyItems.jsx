import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import Sidebar from "./Sidebar";
import { RiRecordCircleLine, RiAddLine } from "react-icons/ri";
import "../App.css";

export default function MyItems({ user, onNavigate }) {
  const [reports, setReports] = useState([]);
  useEffect(() => { api.reports("mine=true").then(r=>setReports(r.reports)).catch(console.error); }, []);
  const [filter, setFilter] = useState("ALL"); // "ALL" | "LOST" | "FOUND"

  const counts = useMemo(
    () => ({
      all: reports.length,
      lost: reports.filter((r) => r.type === "LOST").length,
      found: reports.filter((r) => r.type === "FOUND").length,
      resolved: reports.filter((r) => r.status === "RESOLVED").length,
    }),
    [reports]
  );

  const filteredReports = useMemo(() => {
    if (filter === "ALL") return reports;
    return reports.filter((r) => r.type === filter);
  }, [reports, filter]);

  function markResolved(id) {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "RESOLVED" } : r))
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar active="My Items" onNavigate={onNavigate} user={user} />

      <main className="dashboard-main">
        <div className="dashboard-date">MY ACTIVITY</div>
        <h1 className="dashboard-greeting myitems-title">My Reports</h1>

        <div className="stats-grid my-items-stats">
          <div className="stat-card">
            <div className="stat-label">Lost Reports</div>
            <div className="stat-value red">{counts.lost}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Found Reports</div>
            <div className="stat-value cyan">{counts.found}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Resolved</div>
            <div className="stat-value green">{counts.resolved}</div>
          </div>
        </div>

        <div className="my-items-toolbar">
          <div className="filter-pills">
            <button
              type="button"
              className={`filter-pill all ${filter === "ALL" ? "active" : ""}`}
              onClick={() => setFilter("ALL")}
            >
              ALL ({counts.all})
            </button>
            <button
              type="button"
              className={`filter-pill lost ${filter === "LOST" ? "active" : ""}`}
              onClick={() => setFilter("LOST")}
            >
              LOST ({counts.lost})
            </button>
            <button
              type="button"
              className={`filter-pill found ${filter === "FOUND" ? "active" : ""}`}
              onClick={() => setFilter("FOUND")}
            >
              FOUND ({counts.found})
            </button>
          </div>

          <div className="report-cta-buttons">
            <button
              type="button"
              className="btn-cta lost"
              onClick={() => onNavigate && onNavigate("Report Lost")}
            >
              <RiAddLine size={16} /> Report Lost
            </button>
            <button
              type="button"
              className="btn-cta found"
              onClick={() => onNavigate && onNavigate("Report Found")}
            >
              <RiAddLine size={16} /> Report Found
            </button>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="empty-state">No reports in this filter yet.</div>
        ) : (
          <div className="items-list">
            {filteredReports.map((report) => (
              <div className="my-item-row" key={report.id}>
                <div className={`item-icon ${report.type === "LOST" ? "lost" : "found"}`}>
                  <RiRecordCircleLine size={20} />
                </div>

                <div className="item-row-info">
                  <div className="item-row-title-line">
                    <span className="item-title">{report.item_name}</span>
                    <span className={`tag ${report.status === "ACTIVE" ? "active" : "resolved"}`}>
                      {report.status}
                    </span>
                    <span className={`tag ${report.type === "LOST" ? "lost" : "found"}`}>
                      {report.type}
                    </span>
                  </div>
                  <div className="item-desc">
                    {report.location} · {new Date(report.report_date).toLocaleDateString()}
                  </div>
                </div>

                <div className="item-stats-mini">
                  <div className="item-stats-mini-value matches">{report.matches}</div>
                  <div className="item-stats-mini-label">matches</div>
                </div>

                <div className="item-stats-mini">
                  <div className="item-stats-mini-value">{report.views}</div>
                  <div className="item-stats-mini-label">views</div>
                </div>

                <div className="my-item-actions">
                  <button type="button" className="btn-view">
                    View
                  </button>\n                  <button type="button" className="btn-view" onClick={() => api.deleteReport(report.id).then(() => setReports(prev => prev.filter(r => r.id !== report.id))).catch(console.error)}>Delete</button>
                  {report.status === "ACTIVE" && (
                    <button
                      type="button"
                      className="btn-mark-resolved"
                      onClick={() => markResolved(report.id)}
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}