import React from 'react';

const ResumeDetails = ({ resume }) => {
  if (!resume) return null;

  const getRatingColor = (rating) => {
    if (rating >= 8) return '#28a745';
    if (rating >= 6) return '#ffc107';
    return '#dc3545';
  };

  const getRatingText = (rating) => {
    if (rating >= 9) return 'Excellent';
    if (rating >= 7) return 'Good';
    if (rating >= 5) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="resume-details">
      <h2>Resume Analysis Results</h2>
      
      {/* Personal Information */}
      <section className="details-section">
        <h3>📋 Personal Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Name:</strong> {resume.name || 'Not found'}
          </div>
          <div className="info-item">
            <strong>Email:</strong> {resume.email || 'Not found'}
          </div>
          <div className="info-item">
            <strong>Phone:</strong> {resume.phone || 'Not found'}
          </div>
          <div className="info-item">
            <strong>LinkedIn:</strong> 
            {resume.linkedin_url ? (
              <a href={resume.linkedin_url} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            ) : (
              ' Not found'
            )}
          </div>
          {resume.portfolio_url && (
            <div className="info-item">
              <strong>Portfolio:</strong>
              <a href={resume.portfolio_url} target="_blank" rel="noopener noreferrer">
                View Portfolio
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Resume Rating */}
      <section className="details-section">
        <h3>⭐ Resume Rating</h3>
        <div className="rating-container">
          <div 
            className="rating-score"
            style={{ color: getRatingColor(resume.resume_rating) }}
          >
            {resume.resume_rating}/10
          </div>
          <div className="rating-details">
            <div className="rating-text">
              {getRatingText(resume.resume_rating)}
            </div>
            <div className="rating-bar">
              <div 
                className="rating-fill" 
                style={{ 
                  width: `${(resume.resume_rating / 10) * 100}%`,
                  backgroundColor: getRatingColor(resume.resume_rating)
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Summary */}
      {resume.summary && (
        <section className="details-section">
          <h3>📝 Professional Summary</h3>
          <p className="summary-text">{resume.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {resume.work_experience && resume.work_experience.length > 0 && (
        <section className="details-section">
          <h3>💼 Work Experience</h3>
          {resume.work_experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h4>{exp.role}</h4>
                <span className="company">{exp.company}</span>
              </div>
              <p className="duration">{exp.duration}</p>
              {exp.description && exp.description.length > 0 && (
                <ul className="description-list">
                  {exp.description.map((desc, idx) => (
                    <li key={idx}>{desc}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <section className="details-section">
          <h3>🎓 Education</h3>
          {resume.education.map((edu, index) => (
            <div key={index} className="education-item">
              <h4>{edu.degree}</h4>
              <p>{edu.institution} • {edu.graduation_year}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      <div className="skills-container">
        {resume.technical_skills && resume.technical_skills.length > 0 && (
          <section className="details-section">
            <h3>🔧 Technical Skills</h3>
            <div className="skills-list">
              {resume.technical_skills.map((skill, index) => (
                <span key={index} className="skill-tag technical">{skill}</span>
              ))}
            </div>
          </section>
        )}

        {resume.soft_skills && resume.soft_skills.length > 0 && (
          <section className="details-section">
            <h3>🤝 Soft Skills</h3>
            <div className="skills-list">
              {resume.soft_skills.map((skill, index) => (
                <span key={index} className="skill-tag soft">{skill}</span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {resume.projects && resume.projects.length > 0 && (
        <section className="details-section">
          <h3>🚀 Projects</h3>
          {resume.projects.map((project, index) => (
            <div key={index} className="project-item">
              <h4>{project.name}</h4>
              <p>{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="project-tech">
                  <strong>Technologies:</strong>
                  <div className="tech-tags">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications */}
      {resume.certifications && resume.certifications.length > 0 && (
        <section className="details-section">
          <h3>🏆 Certifications</h3>
          {resume.certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              <h4>{cert.name}</h4>
              <p>{cert.issuer} • {cert.year}</p>
            </div>
          ))}
        </section>
      )}

      {/* Improvement Areas */}
      {resume.improvement_areas && (
        <section className="details-section improvement-section">
          <h3>📈 Areas for Improvement</h3>
          <p>{resume.improvement_areas}</p>
        </section>
      )}

      {/* Upskill Suggestions */}
      {resume.upskill_suggestions && resume.upskill_suggestions.length > 0 && (
        <section className="details-section suggestions-section">
          <h3>🎯 Upskill Suggestions</h3>
          <div className="suggestions-list">
            {resume.upskill_suggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item">
                <span className="suggestion-icon">💡</span>
                {suggestion}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResumeDetails;
