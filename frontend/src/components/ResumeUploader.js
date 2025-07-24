import React, { useState } from 'react';
import axios from 'axios';
import ResumeDetails from './ResumeDetails';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && selectedFile.type === 'application/pdf') {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        setFile(null);
      } else {
        setFile(selectedFile);
        setError(null);
      }
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const droppedFile = event.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:5000/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error uploading resume:', error);
      setError(error.response?.data?.error || 'An error occurred while uploading');
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="resume-uploader">
      {!result ? (
        <div className="upload-section">
          <h2>Upload Your Resume</h2>
          <p className="upload-description">
            Get instant AI-powered analysis and improvement suggestions for your resume
          </p>
          
          <div 
            className={`file-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="drop-content">
              <div className="upload-icon">📄</div>
              <p>Drag & drop your PDF resume here</p>
              <p className="or-text">or</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="file-input"
                id="resume-file"
              />
              <label htmlFor="resume-file" className="file-label">
                Choose PDF File
              </label>
            </div>
          </div>

          {file && (
            <div className="file-selected">
              <p><strong>Selected:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
          
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            className="upload-button"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing Resume...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>
      ) : (
        <div className="results-section">
          <div className="results-header">
            <h2>Analysis Complete!</h2>
            <button onClick={resetUpload} className="new-upload-button">
              Analyze Another Resume
            </button>
          </div>
          <ResumeDetails resume={result} />
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
