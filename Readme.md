# Resume Analyzer



![Resume Analyzer](https://img.shields.io/badge/Resume.ini](https://img.shields.provement suggestions using Google Gemini API**

[🚀 Live Demo](https://resume-analyzer-omega-steel.vercel.app/) | [📖 API Docs](#api-endpoints) | [🛠️ Setup Guide](#installation)



## 🌟 Features

- **📄 PDF Resume Upload** - Drag & drop or click to upload PDF resumes (up to 5MB)
- **🤖 AI-Powered Analysis** - Google Gemini API extracts and analyzes resume content
- **⭐ Resume Rating** - Get a comprehensive 1-10 rating with detailed feedback
- **💡 Smart Suggestions** - Receive personalized improvement recommendations
- **📊 Skills Extraction** - Automatic identification of technical and soft skills
- **📈 Upskill Recommendations** - AI-suggested skills to enhance your career
- **📋 Historical Tracking** - View and manage all previously analyzed resumes
- **🎨 Modern UI/UX** - Responsive design with beautiful animations
- **🔒 Secure Storage** - PostgreSQL database with JSONB for structured data

## 🏗️ Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks
- **Axios** - HTTP client for API requests
- **CSS3** - Custom styling with gradients and animations
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js & Express.js** - RESTful API server
- **Multer** - File upload handling
- **pdf-parse** - PDF text extraction
- **PostgreSQL** - Relational database with JSONB support
- **Google Gemini API** - AI-powered text analysis

### Infrastructure
- **Frontend Hosting:** [Vercel](https://vercel.com)
- **Backend Hosting:** [Render](https://render.com)
- **Database:** Render PostgreSQL
- **Version Control:** GitHub

## 🚀 Quick Start

### Live Application
- **Frontend:** https://resume-analyzer-omega-steel.vercel.app/
- **Backend API:** https://resume-analyzer-backend-h5fa.onrender.com

### Using the Application
1. Visit the [live application](https://resume-analyzer-omega-steel.vercel.app/)
2. Upload your PDF resume using drag & drop or file picker
3. Wait for AI analysis (typically 10-30 seconds)
4. Review your resume rating and improvement suggestions
5. Check the "Historical Viewer" tab to see all your previous analyses

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/resume-analyzer.git
   cd resume-analyzer
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `backend/.env`:
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_DATABASE=resume_analyzer
   GOOGLE_API_KEY=your_gemini_api_key
   PORT=5000
   NODE_ENV=development
   ```

5. **Database Setup**
   
   Create PostgreSQL database and table:
   ```sql
   CREATE DATABASE resume_analyzer;
   
   \c resume_analyzer;
   
   CREATE TABLE resumes (
       id SERIAL PRIMARY KEY,
       file_name VARCHAR(255) NOT NULL,
       uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       name VARCHAR(255),
       email VARCHAR(255),
       phone VARCHAR(50),
       linkedin_url VARCHAR(255),
       portfolio_url VARCHAR(255),
       summary TEXT,
       work_experience JSONB,
       education JSONB,
       technical_skills JSONB,
       soft_skills JSONB,
       projects JSONB,
       certifications JSONB,
       resume_rating INTEGER,
       improvement_areas TEXT,
       upskill_suggestions JSONB
   );
   ```

6. **Start the Application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📡 API Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/health` | Health check | None |
| `POST` | `/api/resumes/upload` | Upload and analyze resume | `multipart/form-data` with `resume` file |
| `GET` | `/api/resumes` | Get all resumes (summary) | None |
| `GET` | `/api/resumes/:id` | Get detailed resume by ID | None |

### API Response Examples

**Health Check Response:**
```json
{
  "status": "OK",
  "message": "Resume Analyzer API is running",
  "database": "Connected",
  "ai_integration": "Configured",
  "timestamp": "2024-07-24T12:30:45.123Z"
}
```

**Resume Analysis Response:**
```json
{
  "id": 1,
  "file_name": "john_doe_resume.pdf",
  "uploaded_at": "2024-07-24T12:30:45.123Z",
  "name": "John Doe",
  "email": "john.doe@email.com",
  "phone": "+1-555-123-4567",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "summary": "Experienced software developer with 5+ years...",
  "work_experience": [
    {
      "role": "Senior Software Developer",
      "company": "Tech Corp",
      "duration": "2021-2024",
      "description": ["Led development of web applications", "Managed team of 3 developers"]
    }
  ],
  "technical_skills": ["JavaScript", "React", "Node.js", "Python"],
  "resume_rating": 8,
  "improvement_areas": "Consider adding more quantifiable achievements...",
  "upskill_suggestions": ["TypeScript", "Docker", "Kubernetes", "AWS"]
}
```

## 📁 Project Structure

```
resume-analyzer/
├── 📁 backend/
│   ├── 📁 controllers/
│   │   └── resumeController.js     # API route handlers
│   ├── 📁 routes/
│   │   └── resumeRoutes.js        # API route definitions
│   ├── 📁 services/
│   │   └── analysisService.js     # PDF processing & AI analysis
│   ├── 📁 db/
│   │   └── index.js               # Database connection
│   ├── .env                       # Environment variables
│   ├── server.js                  # Express server entry point
│   └── package.json               # Backend dependencies
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── ResumeUploader.js  # File upload component
│   │   │   ├── ResumeDetails.js   # Analysis results display
│   │   │   └── PastResumesTable.js# Historical data table
│   │   ├── App.js                 # Main React component
│   │   ├── App.css               # Global styles
│   │   └── index.js              # React entry point
│   └── package.json              # Frontend dependencies
├── 📁 sample_data/               # Test PDF files
├── 📁 screenshots/               # Application screenshots
└── README.md                     # This file
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `your_password` |
| `DB_HOST` | Database host | `localhost` or `dpg-xxx.render.com` |
| `DB_PORT` | Database port | `5432` |
| `DB_DATABASE` | Database name | `resume_analyzer` |
| `GOOGLE_API_KEY` | Google Gemini API key | `AIza...` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |

### AI Analysis Features

The Google Gemini AI extracts and analyzes:
- **Personal Information** (Name, Email, Phone, LinkedIn)
- **Professional Summary**
- **Work Experience** with roles, companies, and achievements
- **Education** background
- **Technical & Soft Skills**
- **Projects** with technologies used
- **Certifications**
- **Resume Rating** (1-10 scale)
- **Improvement Suggestions**
- **Upskilling Recommendations**

## 🚀 Deployment

### Automatic Deployment Setup

Both frontend and backend are configured for automatic deployment:

- **Backend (Render):** Automatically deploys on push to `main` branch
- **Frontend (Vercel):** Automatically deploys on push to `main` branch

### Manual Deployment

**Backend to Render:**
1. Connect your GitHub repository to Render
2. Set up environment variables in Render dashboard
3. Deploy as a Web Service

**Frontend to Vercel:**
1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Deploy with automatic React detection

## 🔒 Security Features

- **File Validation** - Only PDF files up to 5MB accepted
- **SQL Injection Protection** - Parameterized queries with pg library
- **Environment Variables** - Sensitive data secured in environment
- **CORS Configuration** - Controlled cross-origin requests
- **SSL/TLS** - Encrypted database connections
- **Input Sanitization** - Validated and sanitized user inputs

## 🧪 Testing

### API Testing with cURL

```bash
# Health check
curl https://resume-analyzer-backend-h5fa.onrender.com/health

# Upload resume
curl -X POST -F "resume=@your_resume.pdf" \
  https://resume-analyzer-backend-h5fa.onrender.com/api/resumes/upload

# Get all resumes
curl https://resume-analyzer-backend-h5fa.onrender.com/api/resumes

# Get resume by ID
curl https://resume-analyzer-backend-h5fa.onrender.com/api/resumes/1
```

### Frontend Testing
- Upload various PDF resume formats
- Test drag & drop functionality
- Verify responsive design on mobile devices
- Test modal interactions and navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for powerful AI analysis
- **Render** for reliable backend hosting
- **Vercel** for seamless frontend deployment
- **pdf-parse** library for PDF text extraction
- **React** community for excellent documentation

## 📞 Support

- **Live Application:** https://resume-analyzer-omega-steel.vercel.app/
- **Issues:** [GitHub Issues](https://github.com/Charanyedida/resume-analyzer/issues)
- **API Status:** https://resume-analyzer-backend-h5fa.onrender.com/health



**Built with ❤️ using React, Node.js, PostgreSQL, and Google Gemini AI**

⭐ Star this repository if you find it helpful!

