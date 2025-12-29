import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password,
      });

      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.brandingSection}>
          <div style={styles.brandingContent}>
            <div style={styles.logoSection}>
              <div style={styles.logo}>📊</div>
              <h1 style={styles.brandTitle}>Meeting Notes Analyzer</h1>
            </div>
            <p style={styles.brandDescription}>
              Transform your meeting transcripts into actionable insights with AI-powered analysis
            </p>
            <div style={styles.featuresList}>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>✨</div>
                <div style={styles.featureText}>AI-powered summarization</div>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>✅</div>
                <div style={styles.featureText}>Automatic action item extraction</div>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>🎯</div>
                <div style={styles.featureText}>Key decision tracking</div>
              </div>
              <div style={styles.feature}>
                <div style={styles.featureIcon}>📊</div>
                <div style={styles.featureText}>Analytics dashboard</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.formSection}>
          <div style={styles.formCard}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Welcome Back</h2>
              <p style={styles.formSubtitle}>Sign in to your account to continue</p>
            </div>

            {error && (
              <div style={styles.errorAlert}>
                <span style={styles.alertIcon}>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={styles.submitButton}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                Don't have an account?{' '}
                <Link to="/register" style={styles.footerLink}>
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    maxWidth: '1200px',
    width: '100%',
    gap: '4rem',
    alignItems: 'center',
  },
  brandingSection: {
    animation: 'slideIn 0.6s ease-out',
  },
  brandingContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logo: {
    fontSize: '3.5rem',
  },
  brandTitle: {
    fontSize: '2.25rem',
    fontWeight: '700',
    color: '#f8fafc',
    margin: 0,
  },
  brandDescription: {
    fontSize: '1.15rem',
    color: '#cbd5e1',
    lineHeight: '1.7',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  featureIcon: {
    fontSize: '1.5rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(59, 130, 246, 0.15)',
    borderRadius: '10px',
  },
  featureText: {
    fontSize: '1rem',
    color: '#e2e8f0',
    fontWeight: '500',
  },
  formSection: {
    animation: 'slideIn 0.6s ease-out 0.1s backwards',
  },
  formCard: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '3rem',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
  formHeader: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  formTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: '0.5rem',
  },
  formSubtitle: {
    fontSize: '1rem',
    color: '#94a3b8',
  },
  errorAlert: {
    padding: '1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    color: '#fca5a5',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  alertIcon: {
    fontSize: '1.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  input: {
    padding: '0.875rem 1.125rem',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  submitButton: {
    marginTop: '0.5rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(148, 163, 184, 0.1)',
  },
  footerText: {
    fontSize: '0.95rem',
    color: '#94a3b8',
  },
  footerLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

export default Login;
