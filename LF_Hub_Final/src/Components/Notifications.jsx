import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import Sidebar from "./Sidebar";
import { RiDiamondLine, RiRecordCircleLine, RiAlarmWarningLine, RiArrowRightLine } from "react-icons/ri";
import "../App.css";

const TYPE_ICON = {
  match: RiDiamondLine,
  message: RiRecordCircleLine,
  summary: RiRecordCircleLine,
  expiry: RiAlarmWarningLine,
};

// Where each CTA sends you when clicked — reuses the same onNavigate
// contract every other screen uses to talk to Dashboard's router.
const CTA_DESTINATION = {
  match: "Browse Items",
  message: "Browse Items",
  summary: "My Items",
  expiry: "My Items",
};

export default function Notifications({ user, onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => { api.notifications().then(r=>setNotifications(r.notifications)).catch(console.error); }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function markRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }

  function handleCtaClick(e, notif) {
    e.stopPropagation();
    markRead(notif.id);
    if (onNavigate) onNavigate(CTA_DESTINATION[notif.type] || "Dashboard");
  }

  return (
    <div className="dashboard-layout">
      <Sidebar active="Notifications" onNavigate={onNavigate} user={user} notificationCount={unreadCount} />

      <main className="dashboard-main">
        <div className="notif-header">
          <div>
            <div className="dashboard-date">INBOX</div>
            <div className="notif-title-row">
              <h1 className="dashboard-greeting notif-title">Notifications</h1>
              {unreadCount > 0 && <span className="notif-count-badge">{unreadCount}</span>}
            </div>
          </div>
          <button type="button" className="mark-all-read-btn" onClick={markAllRead}>
            Mark all as read
          </button>
        </div>

        <div className="notif-list">
          {notifications.map((n) => {
            const Icon = TYPE_ICON[n.type];
            return (
              <div
                className={`notif-card ${n.unread ? "unread" : ""}`}
                key={n.id}
                onClick={() => markRead(n.id)}
              >
                <div className={`notif-icon ${n.type}`}>
                  <Icon size={18} />
                </div>

                <div className="notif-body">
                  <div className="notif-top-row">
                    <div className="notif-title-line">
                      <span className="notif-card-title">{n.title}</span>
                      {n.unread && <span className="notif-dot" />}
                    </div>
                    <span className="notif-time">{n.time}</span>
                  </div>

                  <p className="notif-text">{n.text}</p>

                  <button
                    type="button"
                    className={`notif-cta ${n.type}`}
                    onClick={(e) => handleCtaClick(e, n)}
                  >
                    {n.cta} <RiArrowRightLine size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}