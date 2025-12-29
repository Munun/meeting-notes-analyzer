import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/meetings/analytics/data');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!analytics) return null;

  const priorityData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [analytics.actionItemsByPriority.High, analytics.actionItemsByPriority.Medium, analytics.actionItemsByPriority.Low],
      backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
    }]
  };

  const tagsData = {
    labels: analytics.topTags.map(t => t.tag),
    datasets: [{
      label: 'Frequency',
      data: analytics.topTags.map(t => t.count),
      backgroundColor: '#3b82f6',
    }]
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Analytics Dashboard</h1>
        
        <div style={styles.stats}>
          <div style={styles.stat}>
            <h3>Total Meetings</h3>
            <p style={styles.statNumber}>{analytics.totalMeetings}</p>
          </div>
          <div style={styles.stat}>
            <h3>Action Items</h3>
            <p style={styles.statNumber}>{analytics.totalActionItems}</p>
          </div>
        </div>

        <div style={styles.charts}>
          <div style={styles.chart}>
            <h2>Action Items by Priority</h2>
            <Pie data={priorityData} />
          </div>
          
          {analytics.topTags.length > 0 && (
            <div style={styles.chart}>
              <h2>Top Tags</h2>
              <Bar data={tagsData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#0f172a', minHeight: '100vh', padding: '100px 20px' },
  container: { maxWidth: '1200px', margin: '0 auto', color: '#fff' },
  loading: { color: '#fff', padding: '100px', textAlign: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '40px' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  stat: { background: '#1e293b', padding: '30px', borderRadius: '12px', textAlign: 'center' },
  statNumber: { fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6', margin: '10px 0' },
  charts: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' },
  chart: { background: '#1e293b', padding: '30px', borderRadius: '12px' },
};

export default Analytics;
