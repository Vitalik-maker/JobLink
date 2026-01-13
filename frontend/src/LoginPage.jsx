// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Please enter username and password");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/auth/login/", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} />

      <header className={styles.header}>
        <div className={styles.brandBubble}>JobLink</div>
        <nav className={styles.nav}>
          <Link to="/login" className={styles.navLinkActive}>
            Login
          </Link>
          <Link to="/register" className={styles.navLink}>
            Register
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        {/* Left mock dashboard preview */}
        <section className={styles.previewColumn}>
          <div className={styles.cardBlueTall}>
            <h2 className={styles.cardBlueTitle}>Job Applications:</h2>
            <div className={styles.previewJobs}>
              {["Job 1;", "Job 2;", "Job 3;", "Job 4;"].map((job, idx) => (
                <div key={idx} className={styles.previewJobItem}>
                  <span className={styles.previewJobLabel}>{job}</span>
                  <span className={styles.previewDots}>...</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cardPinkStack}>
            <div className={styles.cardPink}>
              <div className={styles.cardPinkHeader}>JobLink AI:</div>
              <p className={styles.cardPinkText}>Hi, want to chat?</p>
              <p className={styles.cardPinkTextFaded}>...</p>
            </div>

            <div className={styles.cardPink}>
              <div className={styles.cardPinkHeaderEmphasis}>Resume builder</div>
              <p className={styles.cardPinkSubText}>
                Turn your profile into an ATS‑friendly resume.
              </p>
            </div>

            <div className={styles.cardPink}>
              <div className={styles.cardPinkHeaderEmphasis}>Portfolio</div>
              <p className={styles.cardPinkSubText}>
                Showcase projects recruiters will actually open.
              </p>
            </div>
          </div>
        </section>

        {/* Right login panel */}
        <section className={styles.formColumn}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h1 className={styles.formTitle}>Welcome back</h1>
              <p className={styles.formSubtitle}>
                Sign in to continue your JobLink journey.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Username</span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="yourname123"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="••••••••"
                />
              </label>

              {error && <div className={styles.error}>{error}</div>}

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Login"}
              </button>

              <div className={styles.formFooter}>
                <span>New here?</span>
                <Link to="/register" className={styles.linkAccent}>
                  Create an account
                </Link>
              </div>
            </form>

            <div className={styles.aiHintCard}>
              <div className={styles.aiHintTitle}>JobLink AI tip</div>
              <p className={styles.aiHintText}>
                Save your login to quickly jump into chats, resume builder and
                portfolio suggestions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
