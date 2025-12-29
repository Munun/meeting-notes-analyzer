import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [meetingName, setMeetingName] = useState('');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Validate file type - accept .txt, .vtt, .docx, .doc, .pdf
    const allowedExtensions = ['.txt', '.vtt', '.docx', '.doc', '.pdf'];
    const extension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(extension)) {
      setError('Please upload a .txt, .vtt, .docx, .doc, or .pdf file');
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
    // Auto-populate meeting name from filename (remove extension)
    setMeetingName(selectedFile.name.replace(/\.(txt|vtt|docx|doc|pdf)$/i, ''));
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!meetingName.trim()) {
      setError('Please enter a meeting name');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', meetingName.trim());
    
    // Parse tags (comma-separated)
    if (tags.trim()) {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      formData.append('tags', JSON.stringify(tagArray));
    }

    try {
      const response = await axios.post('/api/meetings/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Navigate to the newly created meeting
      navigate(`/meeting/${response.data.meeting._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Upload Meeting Transcript</h1>
          <p style={styles.subtitle}>
            Upload transcripts from Zoom (.vtt), Google Meet (.docx), or any text file
          </p>
        </div>

        <div
          style={{
            ...styles.uploadArea,
            ...(dragActive ? styles.uploadAreaActive : {}),
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept=".txt,.vtt,.docx,.doc,.pdf"
            onChange={handleChange}
            style={styles.fileInput}
          />
          
          <label htmlFor="file-upload" style={styles.uploadLabel}>
            <div style={styles.uploadIcon}>📄</div>
            <h3 style={styles.uploadTitle}>
              {file ? file.name : 'Choose a file or drag it here'}
            </h3>
            <p style={styles.uploadDescription}>
              {file
                ? `Size: ${(file.size / 1024).toFixed(2)} KB`
                : 'Supports .txt, .vtt, .docx, .doc, .pdf files up to 5MB'}
            </p>
            {!file && (
              <div style={styles.browseButton}>
                Browse Files
              </div>
            )}
          </label>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <span style={styles.alertIcon}>⚠️</span>
            {error}
          </div>
        )}

        {file && (
          <div style={styles.formSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Meeting Name *</label>
              <input
                type="text"
                value={meetingName}
                onChange={(e) => setMeetingName(e.target.value)}
                placeholder="e.g., Team Standup - Dec 28, 2024"
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Tags (optional)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., standup, planning, quarterly-review (comma-separated)"
                style={styles.input}
              />
              <p style={styles.hint}>Separate tags with commas</p>
            </div>
          </div>
        )}

        {file && (
          <div style={styles.actions}>
            <button
              onClick={() => setFile(null)}
              style={styles.cancelButton}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              style={styles.uploadButton}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span style={styles.spinner}></span>
                  Analyzing...
                </>
              ) : (
                'Upload & Analyze'
              )}
            </button>
          </div>
        )}

        <div style={styles.info}>
          <h3 style={styles.infoTitle}>What happens next?</h3>
          <div style={styles.steps}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Upload</h4>
                <p style={styles.stepDescription}>
                  Your transcript file is securely uploaded to our servers
                </p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>AI Analysis</h4>
                <p style={styles.stepDescription}>
                  Claude AI analyzes the content and extracts key information
                </p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>View Results</h4>
                <p style={styles.stepDescription}>
                  Get summary, action items, decisions, and important dates
                </p>
              </div>
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
    paddingTop: '100px',
    paddingBottom: '4rem',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#94a3b8',
  },
  uploadArea: {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '3rem',
    border: '2px dashed rgba(148, 163, 184, 0.3)',
    transition: 'all 0.3s',
    marginBottom: '1.5rem',
  },
  uploadAreaActive: {
    borderColor: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
  },
  uploadIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  uploadTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '0.5rem',
  },
  uploadDescription: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    marginBottom: '1.5rem',
  },
  browseButton: {
    padding: '0.75rem 2rem',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '10px',
    color: '#3b82f6',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-block',
    transition: 'all 0.2s',
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
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '3rem',
  },
  cancelButton: {
    padding: '0.875rem 2rem',
    background: 'rgba(148, 163, 184, 0.1)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '10px',
    color: '#e2e8f0',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  uploadButton: {
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  info: {
    background: 'rgba(30, 41, 59, 0.4)',
    borderRadius: '20px',
    padding: '2rem',
  },
  infoTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  step: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.125rem',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '0.25rem',
  },
  stepDescription: {
    fontSize: '0.95rem',
    color: '#94a3b8',
    lineHeight: '1.6',
  },
  formSection: {
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '20px',
    padding: '2rem',
    marginBottom: '1.5rem',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  },
  inputGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1.125rem',
    background: 'rgba(15, 23, 42, 0.5)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '10px',
    color: '#f8fafc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
  },
  hint: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    marginTop: '0.5rem',
    marginBottom: 0,
  },
};

export default Upload;