import { useState } from "react";
import { RiDiamondLine, RiFocus2Line } from "react-icons/ri";
import { BsCircleFill } from "react-icons/bs";
import { Formik, Form, Field } from "formik";
import { api } from "../api";
import Dashboard from "./Dashboard";

export default function LoginRegister() {
  // Controls which form is visible in the right panel: "login" | "register"
  const [activeForm, setActiveForm] = useState("login");

  // Once a login/register submit succeeds, we swap the whole screen for
  // the Dashboard. `authedUser` carries the name over so the greeting
  // ("Good morning, X.") has something real to show.
  const [authedUser, setAuthedUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function FormRegister() {
    return (
      <div className="auth-form">
        <div className="form-title">Create account</div>
        <div className="form-subtitle">Register with your university credentials</div>

        <Formik
          initialValues={{ fullName: "", studentId: "", email: "", password: "" }}
          onSubmit={async (values) => {
            setError(""); setLoading(true);
            try {
              const result = await api.register(values);
              localStorage.setItem("lfhub_token", result.token);
              setAuthedUser(result.user);
            } catch (e) { setError(e.message); }
            finally { setLoading(false); }
          }}
        >
          <Form className="form-fields">
            <label>FULL NAME</label>
            <Field type="text" name="fullName" placeholder="Aadil Meghwar" />

            <label>STUDENT ID</label>
            <Field type="text" name="studentId" placeholder="000-00-0000" />

            <label>UNIVERSITY EMAIL</label>
            <Field type="email" name="email" placeholder="aadi@university.edu" />

            <label>PASSWORD</label>
            <Field type="password" name="password" placeholder="••••••••" />

            <button type="submit" className="submit-btn">
              Create Account
            </button>
          </Form>
        </Formik>

        <div className="note">
          <span>Note:</span> Access is limited to registered university students and staff.
        </div>
      </div>
    );
  }

  function FormLogin() {
    return (
      <div className="auth-form">
        <div className="form-title">Welcome back</div>
        <div className="form-subtitle">Sign in with your university email</div>

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            setError(""); setLoading(true);
            try {
              const result = await api.login(values);
              localStorage.setItem("lfhub_token", result.token);
              setAuthedUser(result.user);
            } catch (e) { setError(e.message); }
            finally { setLoading(false); }
          }}
        >
          <Form className="form-fields">
            <label>UNIVERSITY EMAIL</label>
            <Field type="email" name="email" placeholder="aadi@university.edu" />

            <label>PASSWORD</label>
            <Field type="password" name="password" placeholder="••••••••" />

            <button type="button" className="forgot-password-link">
              Forgot password?
            </button>

            <button type="submit" className="submit-btn">
              Sign In
            </button>
          </Form>
        </Formik>

        <div className="note">
          <span>Note:</span> Access is limited to registered university students and staff.
        </div>
      </div>
    );
  }

  // Once a submit has set a user, hand off to the Dashboard entirely.
  if (authedUser) {
    return <Dashboard user={authedUser} onSignOut={() => { localStorage.removeItem("lfhub_token"); setAuthedUser(null); }} />;
  }

  return (
    <div className="login-register-container">
      {/* ---------- Left panel: brand / pitch ---------- */}
      <div className="panel" id="left-panel">
        <div className="lf-brand-logo">
          <div className="sub-lf-brand-logo logo-icon-wrap">
            <img src="/LFicon.svg" alt="LF_Hub logo" width="36" height="36" />
          </div>
          <div className="sub-lf-brand-logo">
            <div className="logo-text" id="uncolord">
              LF_Hub
            </div>
            <div className="logo-text" id="colord">
              LOST &amp; FOUND HUB
            </div>
          </div>
        </div>

        <div className="lf-brand-text">
          Reunite students with their <span className="highlight">lost things.</span>
        </div>

        <div className="lf-brand-text1">
          A university-wide platform to report lost items, log found ones, and connect the
          real owner — fast.
        </div>

        <div className="feature-list">
          <div className="feature-item">
            <RiDiamondLine size={20} color="#00C2FF" />
            <span>Post lost or found items instantly</span>
          </div>
          <div className="feature-item">
            <RiFocus2Line size={20} color="#00C2FF" />
            <span>Get matched with potential owners</span>
          </div>
          <div className="feature-item">
            <BsCircleFill size={14} color="#00C2FF" />
            <span>Secure handoff at campus pickup points</span>
          </div>
        </div>
      </div>

      {/* ---------- Right panel: auth form ---------- */}
      <div className="panel" id="right-panel">
        <div className="auth-card">\n          {error && <div className="field-error" style={{marginBottom: "16px"}}>{error}</div>}
          <div className="buttons">
            <button
              type="button"
              className={`auth-button ${activeForm === "login" ? "active" : ""}`}
              onClick={() => setActiveForm("login")}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className={`auth-button ${activeForm === "register" ? "active" : ""}`}
              onClick={() => setActiveForm("register")}
            >
              REGISTER
            </button>
          </div>

          {activeForm === "login" ? <FormLogin /> : <FormRegister />}
        </div>
      </div>
    </div>
  );
}