Namaste! Main **Nami (Data Architect)**. 

Ek high-performance, scalable, aur AI-powered Job Portal system ke liye data models, database architecture, API contracts, aur validation rules design karna mera kaam hai. Humare design me **Job Match Engine**, **AI Resume Tailoring (under 60s execution)**, aur **Factual Integrity Verification** ko primary focus diya gaya hai taaki candidate ka master data tamper na ho.

---

# 🏗️ Data Architecture Overview

```
 [User System] ---------> [Master Resume / Profile]
     |                           |
     v                           v
 [Jobs Engine] <---> [AI Match & Tailor Engine] ---> [Tailored PDF Engine]
     |                           |
     +-------> [Applications] <--+
```

---

## 1. Database Entity-Relationship & Schema Design (PostgreSQL)

Mene schema ko **3rd Normal Form (3NF)** me design kiya hai, jahan heavy metadata aur AI parsing result ke liye PostgreSQL ka `JSONB` format integrate kiya hai.

### 1.1 Users & Profiles Schema

```sql
CREATE TYPE user_role AS ENUM ('CANDIDATE', 'RECRUITER', 'ADMIN');
CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE');
CREATE TYPE application_status AS ENUM ('APPLIED', 'SHORTLISTED', 'INTERVIEWING', 'REJECTED', 'ACCEPTED');

-- Core User Entity
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'CANDIDATE',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recruiter / Company Profile
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    logo_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Profile
CREATE TABLE candidate_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    headline VARCHAR(255),
    summary TEXT,
    years_of_experience NUMERIC(4, 1) DEFAULT 0.0,
    location VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 1.2 Jobs & Skills Schema

```sql
-- Skills Master Table
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) -- e.g., 'Programming', 'Management', 'Design'
);

-- Job Postings
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    raw_requirements JSONB NOT NULL, -- Structured requirements: { "must_have": [], "nice_to_have": [] }
    location VARCHAR(255) NOT NULL,
    type job_type NOT NULL DEFAULT 'FULL_TIME',
    min_salary NUMERIC(12, 2),
    max_salary NUMERIC(12, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Junction Table: Job Skills Matrix
CREATE TABLE job_skills (
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    is_required BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (job_id, skill_id)
);
```

### 1.3 Resume, AI Tailoring & Application Schema

```sql
-- Master Resume Data (Factual Source of Truth)
CREATE TABLE master_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) DEFAULT 'Master Resume',
    parsed_content JSONB NOT NULL, -- Full structured resume data (Work history, Education, Projects)
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Tailored Resume Versions (Generated for specific Job Postings)
CREATE TABLE tailored_resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_resume_id UUID REFERENCES master_resumes(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    tailored_content JSONB NOT NULL, -- Optimized bullet points & targeted keywords
    ats_score NUMERIC(5, 2) CHECK (ats_score >= 0 AND ats_score <= 100),
    pdf_file_url TEXT NOT NULL,
    generation_time_ms INTEGER NOT NULL, -- Tracks speed performance (<60000ms goal)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Applications
CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidate_profiles(id) ON DELETE CASCADE,
    tailored_resume_id UUID REFERENCES tailored_resumes(id) ON DELETE SET NULL,
    match_score NUMERIC(5, 2) NOT NULL, -- Match percentage computed by engine
    status application_status DEFAULT 'APPLIED',
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id) -- Prevents duplicate applications
);
```

---

## 2. State Management Architecture (Frontend/Client-side)

Frontend application store (Zustand / Redux Toolkit) ko 4 major state slices me divide kiya gaya hai:

```typescript
// Types & State Definitions

// 1. Auth & Profile Slice
interface AuthState {
  user: {
    id: string;
    email: string;
    role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  } | null;
  isAuthenticated: boolean;
  token: string | null;
}

// 2. Job Search & Filtering Slice
interface JobSearchState {
  searchQuery: string;
  selectedSkills: string[];
  locationFilter: string;
  jobType: string | null;
  searchResults: JobListing[];
  isLoading: boolean;
  pagination: { page: number; totalPages: number };
}

// 3. AI Resume Tailor Pipeline Slice (Fast <60s Generation Flow)
interface ResumeTailorState {
  isTailoring: boolean;
  progressPercentage: number; // 0 to 100
  currentStep: 'PARSING_JOB' | 'COMPARING_SKILLS' | 'OPTIMIZING_BULLETS' | 'GENERATING_PDF' | 'IDLE';
  activeMasterResumeId: string | null;
  tailoredOutput: {
    tailoredResumeId: string | null;
    atsScore: number;
    pdfUrl: string | null;
    skillDiff: {
      matchedSkills: string[];
      missingSkills: string[];
    };
  } | null;
  error: string | null;
}

// 4. Application Tracker Slice
interface ApplicationState {
  myApplications: ApplicationSummary[];
  isSubmitting: boolean;
}
```

---

## 3. API Contracts (RESTful Interfaces)

### 3.1 Post a New Job (`POST /api/v1/jobs`)
*Recruiter creates a new job listing with structured skill requirements.*

**Request Header:** `Authorization: Bearer <JWT_TOKEN>`  
**Request Payload:**
```json
{
  "title": "Senior Backend Engineer (Node.js/Go)",
  "description": "We are seeking a high-performance backend engineer to scale microservices...",
  "location": "Remote",
  "type": "FULL_TIME",
  "salaryRange": {
    "min": 120000,
    "max": 160000,
    "currency": "USD"
  },
  "requiredSkills": [
    { "name": "Node.js", "isRequired": true },
    { "name": "PostgreSQL", "isRequired": true },
    { "name": "Docker", "isRequired": false }
  ]
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "jobId": "8f3b2d10-e71a-4c22-b919-21dfbc8f12a3",
    "status": "ACTIVE",
    "createdAt": "2023-10-24T10:00:00Z"
  }
}
```

---

### 3.2 Tailor Resume via AI Engine (`POST /api/v1/resumes/tailor`)
*Triggers the high-speed (<60s) AI tailoring workflow matching Master Resume to a specific Job Posting.*

**Request Payload:**
```json
{
  "masterResumeId": "a1b2c3d4-e5f6-7890-1234-56789abcdef0",
  "jobId": "8f3b2d10-e71a-4c22-b919-21dfbc8f12a3"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "executionTimeMs": 14200, // Generated in 14.2s
  "data": {
    "tailoredResumeId": "c7a6e112-9988-4433-2211-556677889900",
    "atsScore": 88.5,
    "skillAnalysis": {
      "matchedSkills": ["Node.js", "PostgreSQL"],
      "missingSkills": ["Docker"]
    },
    "pdfDownloadUrl": "https://cdn.jobportal.com/resumes/tailored_c7a6e112.pdf"
  }
}
```

---

### 3.3 Submit Job Application (`POST /api/v1/applications`)
*Submits applicant's details using either master or tailored resume.*

**Request Payload:**
```json
{
  "jobId": "8f3b2d10-e71a-4c22-b919-21dfbc8f12a3",
  "tailoredResumeId": "c7a6e112-9988-4433-2211-556677889900",
  "coverLetter": "I am deeply interested in this Senior Backend role..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "applicationId": "ee445566-7788-9900-aabb-ccddeeff1122",
    "status": "APPLIED",
    "matchScore": 88.5,
    "appliedAt": "2023-10-24T10:05:00Z"
  }
}
```

---

## 4. Data Validation Rules & Integrity Constraints

Data stability aur factual accuracy maintain karne ke liye **Zod Schema Validation** (runtime) aur **DB Constraints** design kiye hain.

### 4.1 Zod Runtime Validation Schemas (TypeScript/Node Backend)

```typescript
import { z } from 'zod';

// 1. Job Posting Validation
export const CreateJobSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long").max(100),
  description: z.string().min(50, "Description must be detailed (min 50 chars)"),
  location: z.string().min(2),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE']),
  salaryRange: z.object({
    min: z.number().positive(),
    max: z.number().positive(),
    currency: z.string().length(3).default('USD')
  }).refine(data => data.max >= data.min, {
    message: "Max salary must be greater than or equal to Min salary",
    path: ["max"]
  }),
  requiredSkills: z.array(z.object({
    name: z.string(),
    isRequired: z.boolean().default(true)
  })).min(1, "At least one skill is required")
});

// 2. Factual Integrity Guard Schema (AI Tailoring Check)
// Custom Validation Rule: Ensure AI does NOT fabricate non-existent master skills
export const ValidateFactualIntegrity = (masterSkills: string[], AIProposedSkills: string[]) => {
  const fabricatedSkills = AIProposedSkills.filter(skill => !masterSkills.includes(skill));
  
  if (fabricatedSkills.length > 0) {
    throw new Error(`Factual Integrity Violation: AI generated non-existing skills: ${fabricatedSkills.join(', ')}`);
  }
  return true;
};
```

### 4.2 Database Level Integrity & Performance Optimization Rules

1. **Unique Application Constraint:**
   * `UNIQUE(job_id, candidate_id)` index to avoid candidate duplicate spamming.
2. **Speed & Query Performance Indexes:**
   ```sql
   -- Fast Job Search Indexing
   CREATE INDEX idx_jobs_active_created ON jobs(is_active, created_at DESC);
   CREATE INDEX idx_job_skills_composite ON job_skills(job_id, skill_id);
   
   -- Fast Resume JSON Lookup
   CREATE INDEX idx_master_resume_json ON master_resumes USING gin (parsed_content);
   ```
3. **Factual Integrity Rule at Storage Level:**
   * Tailored resumes me soft-link hoti hai Master Resume (`master_resume_id`) ki, taaki historical compliance issues detect kiye ja sakein agar Candidate original experience me koi falsification kare.

---

Is robust data model aur API layout se aapka Job Portal high-load scenarios handle karega aur AI Tailoring logic exact 60 seconds ke andar accurately PDF output deliver kar sakega. Let me know if you need any database migration scripts or API route handlers!