import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoSection}>
          <div style={styles.logoIcon}>📊</div>
          <span style={styles.logoText}>Meeting Notes Analyzer</span>
        </Link>
        
        {isAuthenticated && (
          <div style={styles.navLinks}>
            <Link 
              to="/dashboard" 
              style={{
                ...styles.navLink,
                ...(isActive('/dashboard') ? styles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive('/dashboard')) {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.color = '#60a5fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/dashboard')) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#cbd5e1';
                }
              }}
            >
              Dashboard
            </Link>
            <Link 
              to="/upload" 
              style={{
                ...styles.navLink,
                ...(isActive('/upload') ? styles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive('/upload')) {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.color = '#60a5fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/upload')) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#cbd5e1';
                }
              }}
            >
              Upload
            </Link>
            <Link 
              to="/analytics" 
              style={{
                ...styles.navLink,
                ...(isActive('/analytics') ? styles.navLinkActive : {})
              }}
              onMouseEnter={(e) => {
                if (!isActive('/analytics')) {
                  e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                  e.target.style.color = '#60a5fa';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive('/analytics')) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#cbd5e1';
                }
              }}
            >
              Analytics
            </Link>
          </div>
        )}

        <div style={styles.rightSection}>
          {isAuthenticated ? (
            <>
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={styles.userName}>{user?.name}</span>
              </div>
              <button 
                onClick={handleLogout} 
                style={styles.logoutButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.borderColor = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <div style={styles.authButtons}>
              <Link 
                to="/login" 
                style={styles.loginButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                  e.target.style.color = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#cbd5e1';
                }}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                style={styles.registerButton}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    width: '100%',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.625rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: '1.5rem',
  },
  logoText: {
    fontSize: '1.05rem',
    fontWeight: '700',
    color: '#f8fafc',
    letterSpacing: '-0.01em',
  },
  navLinks: {
    display: 'flex',
    gap: '0.375rem',
    alignItems: 'center',
  },
  navLink: {
    padding: '0.5rem 1rem',
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  navLinkActive: {
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#3b82f6',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    padding: '0.375rem 0.875rem',
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '8px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
  },
  userName: {
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },
  authButtons: {
    display: 'flex',
    gap: '0.625rem',
    alignItems: 'center',
  },
  loginButton: {
    padding: '0.5rem 1.125rem',
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(148, 163, 184, 0.2)',
  },
  registerButton: {
    padding: '0.5rem 1.25rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '700',
    fontSize: '0.9rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
};

export default Navbar;