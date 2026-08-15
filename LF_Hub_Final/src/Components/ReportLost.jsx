import { useState } from "react";
import { api } from "../api";
import Sidebar from "./Sidebar";
import {
  RiCheckLine,
  RiArrowRightLine,
  RiArrowLeftLine,
  RiAlarmWarningLine,
  RiCheckboxCircleFill,
} from "react-icons/ri";
import "../App.css";

const CATEGORIES = ["Electronics", "Bags", "Documents", "Accessories", "Clothing", "Keys", "Other"];

const STEPS = [
  { id: 1, label: "Item Info" },
  { id: 2, label: "Location & Time" },
  { id: 3, label: "Contact & Submit" },
];

const TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "Not sure"];

const EMPTY_FORM = {
  itemName: "",
  category: "",
  description: "",
  brand: "",
  color: "",
  location: "",
  date: "",
  time: "",
  locationDetails: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  urgent: false,
};

export default function ReportLost({ user, onNavigate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...EMPTY_FORM, contactName: user?.name || "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: null }));
  }

  function validateStep(current) {
    const nextErrors = {};
    if (current === 1) {
      if (!form.itemName.trim()) nextErrors.itemName = "Item name is required.";
      if (!form.category) nextErrors.category = "Pick a category.";
      if (!form.description.trim()) nextErrors.description = "A short description helps matching.";
    }
    if (current === 2) {
      if (!form.location.trim()) nextErrors.location = "Location is required.";
      if (!form.date) nextErrors.date = "Date lost is required.";
    }
    if (current === 3) {
      if (!form.contactEmail.trim()) nextErrors.contactEmail = "We need an email to notify you.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleContinue() {
    if (!validateStep(step)) return;
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        await api.createReport({ ...form, type: "LOST" });
        setSubmitted(true);
      } catch (e) {
        setErrors({ submit: e.message });
      }
    }
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleCancel() {
    if (onNavigate) onNavigate("Dashboard");
  }

  function handleReportAnother() {
    setForm({ ...EMPTY_FORM, contactName: user?.name || "" });
    setErrors({});
    setStep(1);
    setSubmitted(false);
  }

  return (
    <div className="dashboard-layout">
      <Sidebar active="Report Lost" onNavigate={onNavigate} user={user} />

      <main className="dashboard-main">
        {submitted ? (
          <div className="success-state">
            <RiCheckboxCircleFill size={56} className="success-icon" />
            <h1 className="dashboard-greeting">Report submitted</h1>
            <p className="dashboard-subtitle">
              We'll notify you the moment a potential match for "{form.itemName}" turns up.
            </p>
            <div className="success-actions">
              <button type="button" className="btn-back" onClick={handleReportAnother}>
                Report another item
              </button>
              <button
                type="button"
                className="btn-continue lost"
                onClick={() => onNavigate && onNavigate("Dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="report-header">
              <div className="dashboard-date report-eyebrow">REPORT LOST ITEM</div>
              <h1 className="dashboard-greeting">What did you lose?</h1>
              <p className="dashboard-subtitle">
                Provide as many details as possible to improve match accuracy.
              </p>
            </div>

            <div className="step-indicator">
              {STEPS.map((s, i) => (
                <div className="step-indicator-item" key={s.id}>
                  <div className="step-node">
                    <div
                      className={`step-circle ${
                        s.id === step ? "active" : s.id < step ? "completed" : ""
                      }`}
                    >
                      {s.id < step ? <RiCheckLine size={14} /> : s.id}
                    </div>
                    <span className={`step-label ${s.id === step ? "active" : ""}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`step-connector ${s.id < step ? "completed" : ""}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="report-card">\n              {errors.submit && <div className="field-error">{errors.submit}</div>}
              {step === 1 && (
                <div className="report-step">
                  <label className="field-label">
                    Item Name <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. iPhone 14 Pro"
                    value={form.itemName}
                    onChange={(e) => updateField("itemName", e.target.value)}
                  />
                  {errors.itemName && <div className="field-error">{errors.itemName}</div>}

                  <label className="field-label">
                    Category <span className="required-star">*</span>
                  </label>
                  <div className="category-grid">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        className={`category-pill ${form.category === cat ? "selected" : ""}`}
                        onClick={() => updateField("category", cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {errors.category && <div className="field-error">{errors.category}</div>}

                  <label className="field-label">
                    Description <span className="required-star">*</span>
                  </label>
                  <textarea
                    className="field-textarea"
                    placeholder="Describe the item in detail — color, brand, distinguishing features..."
                    rows={4}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                  {errors.description && <div className="field-error">{errors.description}</div>}

                  <div className="field-row">
                    <div>
                      <label className="field-label">Brand / Make</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. Apple, Dell, Nike"
                        value={form.brand}
                        onChange={(e) => updateField("brand", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="field-label">Color</label>
                      <input
                        type="text"
                        className="field-input"
                        placeholder="e.g. Black, Space Gray"
                        value={form.color}
                        onChange={(e) => updateField("color", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="report-step">
                  <label className="field-label">
                    Location <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. Library, Floor 2"
                    value={form.location}
                    onChange={(e) => updateField("location", e.target.value)}
                  />
                  {errors.location && <div className="field-error">{errors.location}</div>}

                  <div className="field-row">
                    <div>
                      <label className="field-label">
                        Date Lost <span className="required-star">*</span>
                      </label>
                      <input
                        type="date"
                        className="field-input"
                        value={form.date}
                        onChange={(e) => updateField("date", e.target.value)}
                      />
                      {errors.date && <div className="field-error">{errors.date}</div>}
                    </div>
                    <div>
                      <label className="field-label">Approximate Time</label>
                      <select
                        className="field-input"
                        value={form.time}
                        onChange={(e) => updateField("time", e.target.value)}
                      >
                        <option value="">Select a time</option>
                        {TIME_OPTIONS.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="field-label">Additional Location Details</label>
                  <textarea
                    className="field-textarea"
                    placeholder="e.g. Near the north entrance, second row of seats..."
                    rows={3}
                    value={form.locationDetails}
                    onChange={(e) => updateField("locationDetails", e.target.value)}
                  />
                </div>
              )}

              {step === 3 && (
                <div className="report-step">
                  <label className="field-label">Contact Name</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder="e.g. Amal Kumar"
                    value={form.contactName}
                    onChange={(e) => updateField("contactName", e.target.value)}
                  />

                  <div className="field-row">
                    <div>
                      <label className="field-label">
                        Contact Email <span className="required-star">*</span>
                      </label>
                      <input
                        type="email"
                        className="field-input"
                        placeholder="amal@university.edu"
                        value={form.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                      />
                      {errors.contactEmail && <div className="field-error">{errors.contactEmail}</div>}
                    </div>
                    <div>
                      <label className="field-label">Contact Phone</label>
                      <input
                        type="tel"
                        className="field-input"
                        placeholder="Optional"
                        value={form.contactPhone}
                        onChange={(e) => updateField("contactPhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`urgent-toggle ${form.urgent ? "active" : ""}`}
                    onClick={() => updateField("urgent", !form.urgent)}
                  >
                    <RiAlarmWarningLine size={18} />
                    Mark as urgent
                  </button>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-back"
                  onClick={step === 1 ? handleCancel : handleBack}
                >
                  {step === 1 ? (
                    "Cancel"
                  ) : (
                    <>
                      <RiArrowLeftLine size={16} /> Back
                    </>
                  )}
                </button>
                <button type="button" className="btn-continue lost" onClick={handleContinue}>
                  {step === 3 ? "Submit Report" : "Continue"}
                  {step < 3 && <RiArrowRightLine size={16} />}
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}