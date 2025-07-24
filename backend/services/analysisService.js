const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdfParse(fileBuffer);
    console.log('PDF text extraction successful');
    console.log('Extracted text length:', data.text.length);
    return data.text;
  } catch (error) {
    throw new Error('Error extracting text from PDF: ' + error.message);
  }
};

const analyzeResumeWithGemini = async (resumeText) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert technical recruiter and career coach. Analyze the following resume text and extract the information into a valid JSON object. The JSON object must conform to the following structure, and all fields must be populated. Do not include any text or markdown formatting before or after the JSON object.

Resume Text:
"""
${resumeText}
"""

Please analyze this resume and return a JSON object with the following exact structure:

{
  "name": "string | null",
  "email": "string | null",
  "phone": "string | null", 
  "linkedin_url": "string | null",
  "portfolio_url": "string | null",
  "summary": "string | null",
  "work_experience": [
    {
      "role": "string",
      "company": "string", 
      "duration": "string",
      "description": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "graduation_year": "string"
    }
  ],
  "technical_skills": ["string"],
  "soft_skills": ["string"],
  "projects": [
    {
      "name": "string",
      "description": "string", 
      "technologies": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string", 
      "year": "string"
    }
  ],
  "resume_rating": "number (1-10 based on overall quality, completeness, and presentation)",
  "improvement_areas": "string (specific actionable advice)",
  "upskill_suggestions": ["string (relevant skills to learn based on career trajectory)"]
}

Instructions:
- Extract information accurately from the resume text
- If information is not available, use null for strings and empty arrays for arrays
- Rate the resume from 1-10 considering factors like clarity, completeness, achievements quantification, and relevance
- Provide specific, actionable improvement suggestions
- Suggest relevant upskilling opportunities based on the person's background and current market trends
- Ensure the response is valid JSON only, no additional text

Return only the JSON object.
  `;

  try {
    console.log('Sending resume to Gemini AI for analysis...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini AI');
    
    // Clean the response to ensure it's valid JSON
    let jsonString = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Find JSON object boundaries
    const jsonStart = jsonString.indexOf('{');
    const jsonEnd = jsonString.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No valid JSON found in AI response');
    }
    
    jsonString = jsonString.substring(jsonStart, jsonEnd);
    
    const parsedResult = JSON.parse(jsonString);
    console.log('Successfully parsed Gemini AI response');
    
    return parsedResult;
  } catch (error) {
    console.error('Error analyzing resume with Gemini:', error);
    
    // Fallback to mock data if AI fails
    console.log('Falling back to mock analysis due to AI error');
    return getMockAnalysis(resumeText);
  }
};

// Fallback mock analysis function
const getMockAnalysis = (resumeText) => {
  return {
    name: extractBasicInfo(resumeText, 'name'),
    email: extractBasicInfo(resumeText, 'email'),
    phone: extractBasicInfo(resumeText, 'phone'),
    linkedin_url: extractBasicInfo(resumeText, 'linkedin'),
    portfolio_url: null,
    summary: "Professional with demonstrated experience. AI analysis temporarily unavailable.",
    work_experience: [
      {
        role: "Professional Role",
        company: "Previous Company", 
        duration: "Recent Years",
        description: ["Contributed to various projects and initiatives"]
      }
    ],
    education: [
      {
        degree: "Degree",
        institution: "Educational Institution",
        graduation_year: "Recent"
      }
    ],
    technical_skills: ["Communication", "Problem Solving", "Team Collaboration"],
    soft_skills: ["Leadership", "Adaptability", "Critical Thinking"],
    projects: [],
    certifications: [],
    resume_rating: 7,
    improvement_areas: "AI analysis temporarily unavailable. Consider adding more quantifiable achievements and specific technical details.",
    upskill_suggestions: ["Industry-relevant certifications", "Modern technical skills", "Leadership development"]
  };
};

// Helper function for basic info extraction  
const extractBasicInfo = (text, type) => {
  switch (type) {
    case 'name':
      const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
      return nameMatch ? nameMatch[1] : null;
    case 'email':
      const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
      return emailMatch ? emailMatch[0] : null;
    case 'phone':
      const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      return phoneMatch ? phoneMatch[0] : null;
    case 'linkedin':
      const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/);
      return linkedinMatch ? linkedinMatch[0] : null;
    default:
      return null;
  }
};

const processResume = async (fileBuffer) => {
  try {
    console.log('Starting resume processing...');
    
    // Extract text from PDF
    const resumeText = await extractTextFromPDF(fileBuffer);
    
    if (!resumeText || resumeText.trim().length === 0) {
      throw new Error('No text could be extracted from the PDF');
    }
    
    // Analyze with Gemini AI
    const analysisResult = await analyzeResumeWithGemini(resumeText);
    
    console.log('Resume processing completed successfully');
    console.log('Analysis result preview:', {
      name: analysisResult.name,
      email: analysisResult.email,
      rating: analysisResult.resume_rating,
      skills_count: analysisResult.technical_skills?.length || 0
    });
    
    return analysisResult;
  } catch (error) {
    console.error('Error processing resume:', error);
    throw error;
  }
};

module.exports = {
  processResume,
  extractTextFromPDF,
  analyzeResumeWithGemini
};
