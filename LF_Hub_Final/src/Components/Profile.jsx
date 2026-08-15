import { useEffect, useState } from "react";
import { api } from "../api";
import Sidebar from "./Sidebar";
import "../App.css";

const INITIAL_FORM = {
  displayName: "Aadil Meghwar",
  phone: "+92340 3304830",
  bio: "CS final Year  student. Usually at the library or labs.",
};

const INITIAL_PREFS = {
  matchAlerts: true,
  messages: true,
  weeklySummary: false,
};

const PREF_ITEMS = [
  {
    key: "matchAlerts",
    title: "Match alerts",
    subtitle: "When a potential match is found for your report",
  },
  {
    key: "messages",
    title: "Messages",
    subtitle: "When someone contacts you about an item",
  },
  {
    key: "weeklySummary",
    title: "Weekly summary",
    subtitle: "A weekly digest of views and matches",
  },
];

export default function Profile({ user, onNavigate, onSignOut }) {
  const currentUser = user || { name: "Aadil Meghwar", meta: "CS · final year", initials: "AK" };

  const [form, setForm] = useState(INITIAL_FORM);
  const [prefs, setPrefs] = useState(INITIAL_PREFS);
  const [savedMessage, setSavedMessage] = useState("");
  useEffect(() => { api.profile().then(r => { setForm({displayName:r.user.name, phone:r.user.phone||"", bio:r.user.bio||""}); setPrefs(r.prefs); }).catch(console.error); }, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePref(key) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSave() {
    try { await api.updateProfile({ ...form, prefs }); setSavedMessage("Changes saved."); }
    catch(e) { setSavedMessage(e.message); }
    setTimeout(() => setSavedMessage(""), 2500);
  }

  function handleSignOut() {
    // Profile only knows about in-app navigation via onNavigate. Actually
    // clearing the logged-in session lives in loginRegister.jsx (it owns
    // `authedUser`), so a real sign-out needs an `onSignOut` callback
    // threaded down the same way `onNavigate` is. Falls back to just
    // navigating to Dashboard if that prop isn't wired up yet.
    if (onSignOut) {
      onSignOut();
    } else if (onNavigate) {
      onNavigate("Dashboard");
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar active="Profile" onNavigate={onNavigate} user={user} />

      <main className="dashboard-main">
        <div className="dashboard-date">ACCOUNT</div>
        <h1 className="dashboard-greeting profile-title">Profile Settings</h1>

        <div className="profile-card">
          <div className="profile-avatar">{currentUser.initials}</div>

          <div className="profile-info">
            <div className="profile-name">{currentUser.name}</div>
            <div className="profile-meta">
              {currentUser.meta}
              {currentUser.rollNo ? ` · Roll No. ${currentUser.rollNo}` : " · Roll No. 2021CS0042"}
            </div>
            <div className="profile-email">{currentUser.email || "amal@university.edu"}</div>
          </div>

          <div className="profile-side">
            <span className="verified-badge">VERIFIED STUDENT</span>
            <span className="profile-member-since">Member since Jan 2024</span>
          </div>
        </div>

        <div className="stats-grid profile-stats">
          <div className="stat-card">
            <div className="stat-value red">2</div>
            <div className="stat-label center">Lost Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-value cyan">2</div>
            <div className="stat-label center">Found Reports</div>
          </div>
          <div className="stat-card">
            <div className="stat-value green">2</div>
            <div className="stat-label center">Reunited</div>
          </div>
          <div className="stat-card">
            <div className="stat-value purple">340</div>
            <div className="stat-label center">Karma Points</div>
          </div>
        </div>

        <div className="settings-section-title">
          <span className="section-heading">PERSONAL INFO</span>
          <div className="divider-line" />
        </div>

        <div className="report-card settings-card">
          <div className="field-row">
            <div>
              <label className="field-label">Display Name</label>
              <input
                type="text"
                className="field-input"
                value={form.displayName}
                onChange={(e) => updateField("displayName", e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Phone / WhatsApp</label>
              <input
                type="tel"
                className="field-input"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
              />
            </div>
          </div>

          <label className="field-label">Bio</label>
          <textarea
            className="field-textarea"
            rows={3}
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
          />
        </div>

        <div className="settings-section-title">
          <span className="section-heading">NOTIFICATION PREFERENCES</span>
          <div className="divider-line" />
        </div>

        <div className="report-card settings-card">
          {PREF_ITEMS.map((item, i) => (
            <div
              className={`pref-row ${i === PREF_ITEMS.length - 1 ? "" : "pref-row-divider"}`}
              key={item.key}
            >
              <div>
                <div className="pref-title">{item.title}</div>
                <div className="pref-subtitle">{item.subtitle}</div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={prefs[item.key]}
                  onChange={() => togglePref(item.key)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>

        <div className="profile-actions">
          <button type="button" className="btn-continue found" onClick={handleSave}>
            Save Changes
          </button>
          <button type="button" className="btn-signout" onClick={handleSignOut}>
            Sign Out
          </button>
          {savedMessage && <span className="saved-message">{savedMessage}</span>}
        </div>
      </main>
    </div>
  );
}