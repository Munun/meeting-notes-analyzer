import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeeting();
  }, [id]);

  const fetchMeeting = async () => {
    try {
      const response = await axios.get(`/api/meetings/${id}`);
      setMeeting(response.data.meeting);
    } catch (error) {
      console.error('Error:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this meeting?')) {
      try {
        await axios.delete(`/api/meetings/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
          ← Back
        </button>

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{meeting.title}</h1>
            <p style={styles.date}>
              {new Date(meeting.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
          <button onClick={handleDelete} style={styles.deleteButton}>
            Delete
          </button>
        </div>

        {meeting.tags && meeting.tags.length > 0 && (
          <div style={styles.tagsSection}>
            {meeting.tags.map((tag, index) => (
              <span key={index} style={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        {/* Summary Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Summary</h2>
          <p style={styles.summaryText}>{meeting.analysis.summary}</p>
        </div>

        {/* Action Items Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Action Items</h2>
          {meeting.analysis.actionItems && meeting.analysis.actionItems.length > 0 ? (
            <div style={styles.actionItemsList}>
              {meeting.analysis.actionItems.map((item, index) => (
                <div key={index} style={styles.actionItem}>
                  <div style={styles.actionHeader}>
                    <p style={styles.actionDescription}>{item.description}</p>
                    <span
                      style={{
                        ...styles.priorityBadge,
                        background: getPriorityColor(item.priority) + '20',
                        color: getPriorityColor(item.priority),
                        border: `1px solid ${getPriorityColor(item.priority)}40`,
                      }}
                    >
                      {item.priority}
                    </span>
                  </div>
                  {item.assignedTo && (
                    <p style={styles.assignedTo}>Assigned to: {item.assignedTo}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No action items identified</p>
          )}
        </div>

        {/* Key Decisions Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Key Decisions</h2>
          {meeting.analysis.keyDecisions && meeting.analysis.keyDecisions.length > 0 ? (
            <div style={styles.decisionsList}>
              {meeting.analysis.keyDecisions.map((decision, index) => (
                <div key={index} style={styles.decisionItem}>
                  <div style={styles.bulletPoint}></div>
                  <p style={styles.decisionText}>{decision}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No key decisions recorded</p>
          )}
        </div>

        {/* Important Dates Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Important Dates</h2>
          {meeting.analysis.importantDates && meeting.analysis.importantDates.length > 0 ? (
            <div style={styles.datesList}>
              {meeting.analysis.importantDates.map((date, index) => (
                <div key={index} style={styles.dateItem}>
                  <div style={styles.dateIcon}>📅</div>
                  <p style={styles.dateText}>{date}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={styles.emptyText}>No important dates mentioned</p>
          )}
        </div>

        {/* Original Transcript Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Original Transcript</h2>
          <pre style={styles.transcript}>{meeting.originalTranscript}</pre>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
    paddingTop: '100px',
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(148, 163, 184, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    gap: '1rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: '0.75rem',
    lineHeight: '1.2',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  date: {
    fontSize: '1rem',
    color: '#94a3b8',
    fontWeight: '500',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  deleteButton: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '10px',
    color: '#ef4444',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  tagsSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '2.5rem',
  },
  tag: {
    padding: '0.625rem 1.25rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    color: '#93c5fd',
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  section: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '2.5rem',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: '1.75rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  summaryText: {
    fontSize: '1.125rem',
    color: '#cbd5e1',
    lineHeight: '1.8',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  actionItemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  actionItem: {
    padding: '1.5rem',
    background: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '12px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  actionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  actionDescription: {
    fontSize: '1.05rem',
    color: '#e2e8f0',
    flex: 1,
    margin: 0,
    lineHeight: '1.6',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  priorityBadge: {
    padding: '0.375rem 0.875rem',
    borderRadius: '9999px',
    fontSize: '0.813rem',
    fontWeight: '700',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  assignedTo: {
    fontSize: '0.938rem',
    color: '#94a3b8',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  decisionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  decisionItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    width: '8px',
    height: '8px',
    background: '#3b82f6',
    borderRadius: '50%',
    marginTop: '0.5rem',
    flexShrink: 0,
  },
  decisionText: {
    fontSize: '1.05rem',
    color: '#cbd5e1',
    lineHeight: '1.7',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  datesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  dateItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    padding: '1rem',
    background: 'rgba(15, 23, 42, 0.5)',
    borderRadius: '10px',
  },
  dateIcon: {
    fontSize: '1.5rem',
  },
  dateText: {
    fontSize: '1.05rem',
    color: '#cbd5e1',
    margin: 0,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  emptyText: {
    fontSize: '1rem',
    color: '#6b7280',
    fontStyle: 'italic',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  transcript: {
    fontSize: '0.938rem',
    color: '#cbd5e1',
    lineHeight: '1.8',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    background: 'rgba(15, 23, 42, 0.5)',
    padding: '1.5rem',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    fontFamily: 'monospace',
    margin: 0,
  },
};

export default MeetingDetail;