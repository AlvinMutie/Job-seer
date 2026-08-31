# PROJECT.md — Real Application Specification

## Executive Summary
**Smart Job Hunter** (internally branded as *Hunter.io*) is an AI-assisted web application designed to help job seekers match their resumes against technical job listings, identify missing skills, receive automated resume tailoring suggestions, and track their application pipeline.

---

## Technical Stack Overview

| Tier | Component | Technology | Description |
| ---- | --------- | ---------- | ----------- |
| **Frontend** | Framework | React 18.2 (Vite 4.4) | Single Page Application (SPA) |
| | Styling | Tailwind CSS 3.3 | Dark mode glassmorphism UI |
| | Routing | React Router DOM 7.13 | Client-side page navigation |
| | Motion & FX | Framer Motion 10.16 & Lenis 1.3 | Micro-animations and smooth scroll |
| | HTTP Client | Axios 1.5 | API communication with JWT interceptor |
| **Backend** | Framework | FastAPI | Asynchronous RESTful API framework |
| | Language | Python 3.10+ | Type-annotated backend service logic |
| | ORM | SQLAlchemy 2.0+ | Object-Relational Mapper |
| | Database | SQLite (`job_hunter_v3.db`) | Local dev database file |
| | Auth | JWT + Passlib (bcrypt) | Stateless bearer token authentication |
| **AI / NLP** | Text Parsing | PyMuPDF (`fitz`) & `docx2txt` | Extract text from PDF, DOCX, and TXT resumes |
| | NLP Library | spaCy (`en_core_web_sm`) | Tokenization, lemmatization, and POS tagging |
| | Vectorization | scikit-learn (`TfidfVectorizer`) | TF-IDF term extraction & cosine similarity |

---

## Core Capabilities Verified in Code

1. **User Authentication & Profiles**:
   - Self-service registration with full name, email, and password.
   - Authentication via OAuth2 form-encoded login returning HS256 JWT tokens.
   - User profile management storing preferred role, target experience, location preference, salary expectation, and comma-separated skill lists.

2. **Resume Ingestion & Intelligence**:
   - Resume upload (`POST /upload-resume`) accepting PDF, DOCX, or TXT files.
   - Text parsing via PyMuPDF/docx2txt stored directly on user profile.
   - Resume text viewing in dedicated "Resume Hub".

3. **Hybrid AI Job Matching Engine**:
   - Calculates match percentage between resume text and job postings.
   - Combines 70% skill overlap ratio (dictionary + spaCy PROPN extraction) with 30% TF-IDF contextual cosine similarity.
   - Applies a score boosting fallback rule: `final_score = max(final_score, content_similarity * 2)`.

4. **Skill Gap Analysis & Tailoring Advice**:
   - Compares extracted resume skills with required job skills.
   - Returns matched skills, missing skills, and rule-based tailoring tips.
   - Provides a simulated tailoring modal (`TailorModal.jsx`) that generates target resume bullet points using heuristic pattern templates.

5. **Job Discovery & Search**:
   - Lists jobs stored in the SQLite database with keyword, location, remote status, and experience level filtering.

6. **Application Tracking Pipeline**:
   - Records application state (Not Applied, Applied, Interview, Rejected, Offer) along with match score and timestamps.
   - Displayed in a responsive data table on the Tracker page.
