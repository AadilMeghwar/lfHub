import { RiFocus2Line, RiDiamondLine, RiCheckboxBlankLine, RiRecordCircleLine } from "react-icons/ri";
import { BsCircle, BsCircleFill } from "react-icons/bs";
import Profile from "./Profile";

// Single source of truth for the sidebar's nav entries.
// When new screens are built, just point them at the matching "name" here
// so the active-highlight logic keeps working.
//
// Icons intentionally reuse the same geometric set as the login screen's
// brand bullets (RiDiamondLine / RiFocus2Line / BsCircleFill) instead of
// literal warning/check/bell icons, to keep the nav visually consistent
// with the rest of the app.
const NAV_ITEMS = [
  { name: "Dashboard", icon: RiFocus2Line },
  { name: "Browse Items", icon: RiDiamondLine },
  { name: "Report Lost", icon: BsCircle },
  { name: "Report Found", icon: BsCircleFill },
  { name: "My Items", icon: RiCheckboxBlankLine },
  { name: "Notifications", icon: RiRecordCircleLine, badgeKey: "notifications" },
];

const DEFAULT_USER = { name: "Aadil Meghwar", meta: "CS final year", initials: "AK" };

export default function Sidebar({ active = "Dashboard", onNavigate, user, notificationCount = 3 }) {
  // Merge so screens can pass a partial user object (e.g. just a name)
  // without losing the fallback meta/initials.
  const currentUser = { ...DEFAULT_USER, ...user };

  const badgeCounts = { notifications: notificationCount };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <img src="/LFicon.svg" alt="LF_Hub logo" width="26" height="26" />
          </div>
          <div>
            <div className="sidebar-logo-text">LF_Hub</div>
            <div className="sidebar-logo-sub">LOST &amp; FOUND</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ name, icon: Icon, badgeKey }) => {
            const isActive = name === active;
            const badge = badgeKey ? badgeCounts[badgeKey] : null;
            return (
              <button
                key={name}
                type="button"
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                onClick={() => onNavigate && onNavigate(name)}
              >
                <Icon size={16} />
                <span>{name}</span>
                {badge ? <span className="sidebar-badge">{badge}</span> : null}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        className={`sidebar-user ${active === "Profile" ? "active" : ""}`}
        onClick={() => onNavigate && onNavigate("Profile")}
      >
        <div className="sidebar-avatar">{currentUser.initials}</div>
        <div>
          <div className="sidebar-user-name">{currentUser.name}</div>
          <div className="sidebar-user-meta">{currentUser.meta}</div>
        </div>
      </button>
    </aside>
  );
}