import React, { useState } from 'react';
import './App.css';
import ResumeUploader from './components/ResumeUploader';
import PastResumesTable from './components/PastResumesTable';
import ResumeDetails from './components/ResumeDetails';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (resume) => {
    setSelectedResume(resume);
    setShowModal(true);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Resume Analyzer</h1>
        <p className="subtitle">AI-Powered Resume Analysis & Improvement</p>
        <nav className="tab-navigation">
          <button 
            className={activeTab === 'upload' ? 'active' : ''}
            onClick={() => setActiveTab('upload')}
          >
            Resume Analysis
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Historical Viewer
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'upload' && <ResumeUploader />}
        {activeTab === 'history' && (
          <PastResumesTable onViewDetails={handleViewDetails} />
        )}
      </main>

      {/* Modal for resume details */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <ResumeDetails resume={selectedResume} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
