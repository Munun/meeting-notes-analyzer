import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Transform Meeting Transcripts into
            <span style={styles.highlight}> Actionable Insights</span>
          </h1>
          <p style={styles.heroDescription}>
            Leverage AI-powered analysis to automatically extract summaries, action items,
            key decisions, and important dates from your meeting notes.
          </p>
          <div style={styles.ctaButtons}>
            {isAuthenticated ? (
              <Link to="/dashboard" style={styles.primaryButton}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" style={styles.primaryButton}>
                  Get Started Free
                </Link>
                <Link to="/login" style={styles.secondaryButton}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={styles.features}>
        <h2 style={styles.featuresTitle}>Everything You Need</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🤖</div>
            <h3 style={styles.featureTitle}>AI-Powered Analysis</h3>
            <p style={styles.featureDescription}>
              Advanced Claude AI extracts key information from your meeting transcripts automatically.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>✅</div>
            <h3 style={styles.featureTitle}>Action Items</h3>
            <p style={styles.featureDescription}>
              Automatically identify tasks, assignees, and priorities from meeting discussions.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Analytics Dashboard</h3>
            <p style={styles.featureDescription}>
              Visualize meeting trends, action items, and productivity metrics over time.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔒</div>
            <h3 style={styles.featureTitle}>Secure & Private</h3>
            <p style={styles.featureDescription}>
              Your meeting data is encrypted and stored securely with enterprise-grade protection.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📄</div>
            <h3 style={styles.featureTitle}>PDF Export</h3>
            <p style={styles.featureDescription}>
              Export meeting summaries and action items to professional PDF documents.
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>⚡</div>
            <h3 style={styles.featureTitle}>Instant Results</h3>
            <p style={styles.featureDescription}>
              Get comprehensive meeting analysis in seconds with our fast AI processing.
            </p>
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
  },
  hero: {
    padding: '6rem 2rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  highlight: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroDescription: {
    fontSize: '1.25rem',
    color: '#cbd5e1',
    marginBottom: '3rem',
    lineHeight: '1.8',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    padding: '1rem 2.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'transform 0.2s',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
  },
  secondaryButton: {
    padding: '1rem 2.5rem',
    background: 'rgba(148, 163, 184, 0.1)',
    color: '#e2e8f0',
    textDecoration: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    transition: 'all 0.2s',
  },
  features: {
    padding: '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featuresTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: '3rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2rem',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    transition: 'transform 0.2s',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '1rem',
  },
  featureDescription: {
    fontSize: '1rem',
    color: '#cbd5e1',
    lineHeight: '1.6',
  },
};

export default Home;
