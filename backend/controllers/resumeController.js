const { pool } = require('../db');
const { processResume } = require('../services/analysisService');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const fileBuffer = req.file.buffer;

    console.log(`Processing resume: ${fileName}`);
    console.log(`File size: ${fileBuffer.length} bytes`);

    // Process the resume (extract text and analyze)
    const analysisResult = await processResume(fileBuffer);

    // Save to database
    const insertQuery = `
      INSERT INTO resumes (
        file_name, name, email, phone, linkedin_url, portfolio_url, summary,
        work_experience, education, technical_skills, soft_skills, projects,
        certifications, resume_rating, improvement_areas, upskill_suggestions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;

    const values = [
      fileName,
      analysisResult.name || null,
      analysisResult.email || null,
      analysisResult.phone || null,
      analysisResult.linkedin_url || null,
      analysisResult.portfolio_url || null,
      analysisResult.summary || null,
      JSON.stringify(analysisResult.work_experience || []),
      JSON.stringify(analysisResult.education || []),
      JSON.stringify(analysisResult.technical_skills || []),
      JSON.stringify(analysisResult.soft_skills || []),
      JSON.stringify(analysisResult.projects || []),
      JSON.stringify(analysisResult.certifications || []),
      analysisResult.resume_rating || null,
      analysisResult.improvement_areas || null,
      JSON.stringify(analysisResult.upskill_suggestions || [])
    ];

    const result = await pool.query(insertQuery, values);
    const savedResume = result.rows[0];

    // Return the full analysis result
    res.json({
      id: savedResume.id,
      file_name: savedResume.file_name,
      uploaded_at: savedResume.uploaded_at,
      ...analysisResult
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

const getAllResumes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, file_name, name, email, resume_rating, uploaded_at FROM resumes ORDER BY uploaded_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getResumeById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const r = result.rows[0];

    // Helper to safely handle JSONB fields
    const parseJsonb = (val) => {
      if (val == null) return [];
      if (typeof val === 'string') {
        try { 
          return JSON.parse(val); 
        } catch { 
          return []; 
        }
      }
      // If it's already an object/array, return as-is
      return val;
    };

    const formattedResume = {
      id: r.id,
      file_name: r.file_name,
      uploaded_at: r.uploaded_at,
      name: r.name,
      email: r.email,
      phone: r.phone,
      linkedin_url: r.linkedin_url,
      portfolio_url: r.portfolio_url,
      summary: r.summary,
      work_experience: parseJsonb(r.work_experience),
      education: parseJsonb(r.education),
      technical_skills: parseJsonb(r.technical_skills),
      soft_skills: parseJsonb(r.soft_skills),
      projects: parseJsonb(r.projects),
      certifications: parseJsonb(r.certifications),
      resume_rating: r.resume_rating,
      improvement_areas: r.improvement_areas,
      upskill_suggestions: parseJsonb(r.upskill_suggestions)
    };

    res.json(formattedResume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  uploadResume,
  getAllResumes,
  getResumeById
};
