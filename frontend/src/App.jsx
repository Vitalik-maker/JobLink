import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  // --- STATE ---
  const [challenges, setChallenges] = useState([]);
  const [showLogin, setShowLogin] = useState(false);      // show / hide popup
  const [username, setUsername] = useState('');           // login input
  const [password, setPassword] = useState('');           // login input
  const [loginMessage, setLoginMessage] = useState('');   // success / error text

  // --- LOAD CHALLENGES FROM DJANGO ONCE ---
  useEffect(() => {
    axios.get('/api/challenges/')
      .then(res => setChallenges(res.data))
      .catch(() => console.log('Error loading challenges'));
  }, []);

  // --- HANDLE LOGIN FORM SUBMIT ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();                     // stop page refresh
    try {
      const res = await axios.post('/api/auth/login/', {
        username,
        password,
      });
      setLoginMessage(`Welcome, ${res.data.user}!`);
      setShowLogin(false);                  // close popup
      setUsername('');
      setPassword('');
    } catch (err) {
      setLoginMessage('Login failed. Check username or password.');
    }
  };

  // --- JSX ---
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f5132 0%, #198754 50%, #b5e48c 100%)',
        color: 'white',
      }}
    >
      {/* Top bar like GreenQuest */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '1.4rem', letterSpacing: '0.08em' }}>
          GREEN<span style={{ color: '#b5e48c' }}>QUEST</span>
        </div>
        <button
          onClick={() => { setShowLogin(true); setLoginMessage(''); }}
          style={{
            border: 'none',
            padding: '0.5rem 1.3rem',
            borderRadius: '999px',
            backgroundColor: '#b5e48c',
            color: '#0f5132',
            fontWeight: 600,
            boxShadow: '0 0 15px rgba(0,0,0,0.25)',
            cursor: 'pointer',
          }}
        >
          Log in
        </button>
      </header>

      {/* Center content */}
      <main style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        {loginMessage && (
          <div
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              background: 'rgba(0,0,0,0.25)',
            }}
          >
            {loginMessage}
          </div>
        )}

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Today&apos;s Challenges</h1>

        {challenges.map((c) => (
          <div
            key={c.id}
            style={{
              marginBottom: '1rem',
              padding: '1rem 1.25rem',
              borderRadius: '1rem',
              background: 'rgba(255,255,255,0.08)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{c.title}</h2>
            <p style={{ marginBottom: '0.5rem', color: '#e2f5e9' }}>{c.description}</p>
            <div style={{ fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600 }}>{c.points} pts</span> ·{' '}
              <span style={{ textTransform: 'capitalize' }}>{c.category}</span>
            </div>
          </div>
        ))}
      </main>

      {/* LOGIN POPUP (Modal) */}
      {showLogin && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowLogin(false)}  // click outside closes
        >
          <div
            onClick={(e) => e.stopPropagation()}  // stop close when clicking inside
            style={{
              width: '100%',
              maxWidth: '380px',
              background: 'linear-gradient(145deg, #ffffff, #e9f7ef)',
              borderRadius: '1.5rem',
              padding: '1.8rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
              color: '#0f5132',
            }}
          >
            <h2 style={{ marginBottom: '0.25rem', fontSize: '1.4rem' }}>Welcome back</h2>
            <p style={{ marginBottom: '1.2rem', fontSize: '0.9rem', color: '#466b54' }}>
              Log in to track your eco quests and earn points.
            </p>

            <form onSubmit={handleLoginSubmit}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #b6d8c0',
                  marginBottom: '0.75rem',
                }}
                required
              />

              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #b6d8c0',
                  marginBottom: '1rem',
                }}
                required
              />

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #198754, #52b788)',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(25,135,84,0.5)',
                  marginBottom: '0.5rem',
                }}
              >
                Log in
              </button>
            </form>

            <button
              onClick={() => setShowLogin(false)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '999px',
                border: 'none',
                background: 'transparent',
                color: '#466b54',
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
