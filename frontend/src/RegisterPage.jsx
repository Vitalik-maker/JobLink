// src/pages/DashboardPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import styles from "./DashboardPage.module.css";
import LoginPage from "./LoginPage";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dash, setDash] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/dashboard/");
        setDash(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError("Could not load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className={styles.loading}>Loading JobLink dashboard...</div>;
  }

  if (!dash) {
    return <div className={styles.error}>{error || "No data"}</div>;
  }

  const { applications, skills, user, ai_suggestions } = dash;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandBubble}>JobLink</div>
        <button
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      <main className={styles.main}>
        <section className={styles.topRow}>
          {/* Left: Job Applications */}
          <div className={styles.cardBlueTall}>
            <h2 className={styles.cardBlueTitle}>Job Applications:</h2>
            <div className={styles.jobsList}>
              {applications.length === 0 && (
                <div className={styles.jobsEmpty}>
                  No applications yet. Start with the Resume builder →
                </div>
              )}
              {applications.map((app) => (
                <div key={app.id} className={styles.jobRow}>
                  <div className={styles.jobTitle}>{app.title}</div>
                  <div className={styles.jobMeta}>
                    <span>{app.company}</span>
                    <span className={styles.jobStatus}>{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stacked pink cards */}
          <div className={styles.cardPinkStack}>
            <div className={styles.cardPink}>
              <div className={styles.cardPinkHeader}>JobLink AI:</div>
              <p className={styles.cardPinkText}>
                Hi {user.first_name || user.username}, want to chat?
              </p>
              <p className={styles.cardPinkTextFaded}>
                I can help tailor your resume to these applications.
              </p>
            </div>

            <div className={styles.cardPink}>
              <div className={styles.cardPinkHeaderEmphasis}>Resume builder</div>
              <p className={styles.cardPinkSubText}>
                Generate structured bullet points from your skills and
                accomplishments.
              </p>
              <button className={styles.cardButton}>Open builder</button>
            </div>

            <div className={styles.cardPink}>
              <div className={styles.cardPinkHeaderEmphasis}>Portfolio</div>
              <p className={styles.cardPinkSubText}>
                Turn your best work into a simple, shareable link.
              </p>
              <button className={styles.cardButton}>Open portfolio</button>
            </div>
          </div>
        </section>

        {/* Second layout row */}
        <section className={styles.bottomRow}>
          <div className={styles.profileTop}>
            <div className={styles.avatarCircle}>
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt="Profile"
                  className={styles.avatarImg}
                />
              ) : (
                <span className={styles.avatarPlaceholder}>Picture</span>
              )}
            </div>
            <div className={styles.cardPinkHeaderBox}>
              <div className={styles.cardPinkHeader}>Name:</div>
              <div className={styles.cardPinkBody}>
                {user.first_name} {user.last_name}
              </div>
              <div className={styles.cardPinkHeader}>Age:</div>
              <div className={styles.cardPinkBody}>{user.age || "—"}</div>
            </div>
          </div>

          <div className={styles.profileGrid}>
            <div className={styles.cardBlue}>
              <h3 className={styles.cardBlueTitleSmall}>List of skills:</h3>
              <ul className={styles.skillsList}>
                {skills.map((s, idx) => (
                  <li key={s.id} className={styles.skillItem}>
                    <span className={styles.skillLabel}>Skill {idx + 1}:</span>
                    <span className={styles.skillName}>{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.cardBlue}>
              <h3 className={styles.cardBlueTitleSmall}>Accomplishments</h3>
              <ul className={styles.accomplishmentsList}>
                {(user.accomplishments || []).map((a, idx) => (
                  <li key={idx} className={styles.accomplishmentItem}>
                    <span className={styles.accLabel}>A {idx + 1}</span>
                    <span className={styles.accText}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.cardBlueWide}>
            <div className={styles.cardBlueTitleCenter}>JobLink AI</div>
            <p className={styles.cardBlueSubtitle}>
              What can I suggest to add?
            </p>
            <ul className={styles.aiSuggestions}>
              {ai_suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RegisterPage;
