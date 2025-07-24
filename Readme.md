# Resume Analyzer

AI-powered resume analysis and improvement suggestions using Google Gemini API.

## Features

- PDF resume upload and text extraction
- AI-powered analysis with Google Gemini
- Resume rating (1-10) with detailed feedback
- Skills extraction and upskill suggestions
- Historical resume tracking
- Responsive web interface

## Tech Stack

- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with JSONB
- **AI**: Google Gemini API
- **File Processing**: Multer, pdf-parse

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL (v12+)
- Google Gemini API key

### Installation

1. Clone the repository
2. Install backend dependencies:

cd backend
npm install

3. Install frontend dependencies:

cd frontend
npm install

4. Configure environment variables in `backend/.env`
5. Create PostgreSQL database and table (see SQL schema below)
6. Start the application:
Backend
cd backend && npm run dev

Frontend (new terminal)
cd frontend && npm start

### Database Schema
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


## API Endpoints

- `GET /health` - Health check
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes` - Get all resumes
- `GET /api/resumes/:id` - Get resume by ID

## Usage

1. Navigate to the application URL
2. Upload a PDF resume using drag & drop or file picker
3. View AI-powered analysis results
4. Check historical resumes in the "Historical Viewer" tab
5. Click "View Details" for comprehensive resume analysis
