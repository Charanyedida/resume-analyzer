import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PastResumesTable = ({ onViewDetails }) => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resumes');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/resumes/${id}`);
      onViewDetails(response.data);
    } catch (error) {
      console.error('Error fetching resume details:', error);
      setError('Failed to fetch resume details');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingBadgeClass = (rating) => {
    if (rating >= 8) return 'rating-excellent';
    if (rating >= 6) return 'rating-good';
    return 'rating-poor';
  };

  if (loading) return <div className="loading">Loading resumes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="past-resumes-table">
      <div className="table-header">
        <h2>Resume History</h2>
        <p className="table-subtitle">
          {resumes.length} resume{resumes.length !== 1 ? 's' : ''} analyzed
        </p>
      </div>
      
      {resumes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No resumes uploaded yet</h3>
          <p>Upload your first resume in the Analysis tab to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="resumes-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td className="file-name">
                    <span className="file-icon">📄</span>
                    {resume.file_name}
                  </td>
                  <td>{resume.name || 'N/A'}</td>
                  <td>{resume.email || 'N/A'}</td>
                  <td>
                    <span className={`rating-badge ${getRatingBadgeClass(resume.resume_rating)}`}>
                      {resume.resume_rating}/10
                    </span>
                  </td>
                  <td className="date-cell">
                    {formatDate(resume.uploaded_at)}
                  </td>
                  <td>
                    <button 
                      className="details-button"
                      onClick={() => handleViewDetails(resume.id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PastResumesTable;
