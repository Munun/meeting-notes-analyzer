import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings');
      setMeetings(response.data.meetings);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await axios.delete(`/api/meetings/${id}`);
        setMeetings(meetings.filter(m => m._id !== id));
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  const handleCardClick = (id) => {
    navigate(`/meeting/${id}`);
  };

  const allTags = [...new Set(meetings.flatMap(m => m.tags))];

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.analysis.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || meeting.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Meetings</h1>
            <p style={styles.subtitle}>
              {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} total
            </p>
          </div>
          <button
            style={styles.uploadButton}
            onClick={() => navigate('/upload')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
            }}
          >
            + New Meeting
          </button>
        </div>

        {meetings.length > 0 && (
          <div style={styles.filters}>
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              style={styles.tagFilter}
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}

        {filteredMeetings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📝</div>
            <h2 style={styles.emptyTitle}>
              {meetings.length === 0 ? 'No meetings yet' : 'No meetings found'}
            </h2>
            <p style={styles.emptyDescription}>
              {meetings.length === 0
                ? 'Upload your first meeting transcript to get started with AI-powered analysis.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {meetings.length === 0 && (
              <button
                style={styles.emptyButton}
                onClick={() => navigate('/upload')}
              >
                Upload Meeting
              </button>
            )}
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredMeetings.map(meeting => (
              <div
                key={meeting._id}
                style={styles.card}
                onClick={() => handleCardClick(meeting._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';
                }}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{meeting.title}</h3>
                  <button
                    style={styles.deleteButton}
                    onClick={(e) => handleDelete(meeting._id, e)}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(239, 68, 68, 0.15)';
                      e.target.style.color = '#ef4444';
                      e.target.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(15, 23, 42, 0.5)';
                      e.target.style.color = '#94a3b8';
                      e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                    }}
                  >
                    Delete
                  </button>
                </div>

                <p style={styles.cardDate}>
                  {new Date(meeting.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>

                <div style={styles.divider}></div>

                <p style={styles.cardSummary}>
                  {meeting.analysis.summary?.substring(0, 140)}
                  {meeting.analysis.summary?.length > 140 && '...'}
                </p>

                <div style={styles.statsContainer}>
                  <div style={styles.statBox}>
                    <div style={styles.statIconBox}>✅</div>
                    <div style={styles.statContent}>
                      <div style={styles.statNumber}>
                        {meeting.analysis.actionItems?.length || 0}
                      </div>
                      <div style={styles.statLabel}>Action Items</div>
                    </div>
                  </div>
                  
                  <div style={styles.statBox}>
                    <div style={styles.statIconBox}>🎯</div>
                    <div style={styles.statContent}>
                      <div style={styles.statNumber}>
                        {meeting.analysis.keyDecisions?.length || 0}
                      </div>
                      <div style={styles.statLabel}>Decisions</div>
                    </div>
                  </div>
                </div>

                {meeting.tags && meeting.tags.length > 0 && (
                  <div style={styles.tagsContainer}>
                    {meeting.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} style={styles.tag}>
                        {tag}
                      </span>
                    ))}
                    {meeting.tags.length > 3 && (
                      <span style={styles.tagMore}>+{meeting.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '4rem',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(59, 130, 246, 0.1)',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '3rem',
    fontWeight: '800',
    color: '#ffffff',
    margin: 0,
    letterSpacing: '-0.025em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#94a3b8',
    marginTop: '0.5rem',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  uploadButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1.05rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
  },
  searchInput: {
    flex: 1,
    minWidth: '300px',
    padding: '1rem 1.5rem',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '2px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  tagFilter: {
    padding: '1rem 1.5rem',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '2px solid rgba(148, 163, 184, 0.15)',
    borderRadius: '12px',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  emptyState: {
    textAlign: 'center',
    padding: '5rem 2rem',
  },
  emptyIcon: {
    fontSize: '6rem',
    marginBottom: '1.5rem',
  },
  emptyTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  emptyDescription: {
    fontSize: '1.25rem',
    color: '#cbd5e1',
    marginBottom: '2.5rem',
    maxWidth: '500px',
    margin: '0 auto 2.5rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  emptyButton: {
    padding: '1.25rem 2.5rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '2rem',
  },
  card: {
    background: 'rgba(30, 41, 59, 0.75)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid rgba(148, 163, 184, 0.15)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
    gap: '1rem',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#ffffff',
    margin: 0,
    flex: 1,
    lineHeight: '1.3',
    letterSpacing: '-0.015em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '8px',
    fontSize: '0.813rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#94a3b8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardDate: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginBottom: '1rem',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  divider: {
    height: '1px',
    background: 'rgba(148, 163, 184, 0.15)',
    marginBottom: '1.25rem',
  },
  cardSummary: {
    fontSize: '1rem',
    color: '#e2e8f0',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
    minHeight: '3rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  statsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1rem',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  statIconBox: {
    fontSize: '1.75rem',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(59, 130, 246, 0.1)',
    borderRadius: '8px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statNumber: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: '1',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontWeight: '600',
    marginTop: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  tag: {
    padding: '0.5rem 1rem',
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    borderRadius: '8px',
    fontSize: '0.813rem',
    fontWeight: '700',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  tagMore: {
    padding: '0.5rem 1rem',
    background: 'rgba(148, 163, 184, 0.1)',
    color: '#94a3b8',
    borderRadius: '8px',
    fontSize: '0.813rem',
    fontWeight: '700',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
};

export default Dashboard;