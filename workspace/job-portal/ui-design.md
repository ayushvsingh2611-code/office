```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CareerPulse AI - Smart Job Portal & Resume Optimizer</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Header / Navigation -->
  <header class="navbar">
    <div class="nav-container">
      <a href="#" class="brand-logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Career<span class="highlight">Pulse</span> <span class="badge-ai">AI</span></span>
      </a>

      <nav class="nav-menu">
        <button class="nav-link active" data-tab="find-jobs">Find Jobs</button>
        <button class="nav-link" data-tab="ai-optimizer">⚡ AI Resume Matcher</button>
        <button class="nav-link" data-tab="post-job">Post a Job</button>
        <button class="nav-link" data-tab="dashboard">Employer Dashboard</button>
      </nav>

      <div class="nav-actions">
        <button class="btn btn-outline" id="cart-button">
          Saved Jobs <span class="badge-count" id="cart-count">2</span>
        </button>
        <button class="btn btn-primary" id="btn-post-quick">
          <span>+ Post Job</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Main Content Wrapper -->
  <main class="main-content">

    <!-- TAB 1: FIND JOBS & MATCHING -->
    <section id="find-jobs" class="tab-content active">
      <!-- Hero Section -->
      <div class="hero-banner">
        <div class="hero-text">
          <span class="pill-tag">⚡ 60-Second AI Resume Optimization Included</span>
          <h1>Land Your Dream Job With <span class="gradient-text">Tailored AI Precision</span></h1>
          <p>Search active job postings, evaluate your match score instantly, and tailor your CV/Resume to pass ATS screening seamlessly.</p>
        </div>

        <!-- Search Bar -->
        <div class="search-box-card">
          <div class="search-field">
            <span class="icon">🔍</span>
            <input type="text" placeholder="Job title, skills (e.g. React, Python, Product Manager)" id="search-title">
          </div>
          <div class="search-field divider">
            <span class="icon">📍</span>
            <input type="text" placeholder="Location or Remote" id="search-location">
          </div>
          <div class="search-field divider">
            <span class="icon">💼</span>
            <select id="search-category">
              <option value="">All Categories</option>
              <option value="engineering">Software Engineering</option>
              <option value="data">Data & AI</option>
              <option value="design">UI/UX Design</option>
              <option value="marketing">Product & Marketing</option>
            </select>
          </div>
          <button class="btn btn-action search-btn">Search Jobs</button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-pills">
        <button class="pill-btn active">All Jobs (142)</button>
        <button class="pill-btn">⚡ 90%+ Match Score</button>
        <button class="pill-btn">Frontend Development</button>
        <button class="pill-btn">Backend & Cloud</button>
        <button class="pill-btn">Full Stack</button>
        <button class="pill-btn">Remote Only</button>
        <button class="pill-btn">High Salary ($120k+)</button>
      </div>

      <!-- Main Layout: Job Listings + Filter Sidebar -->
      <div class="portal-grid">
        <!-- Sidebar Filters -->
        <aside class="sidebar-filters">
          <div class="filter-card">
            <div class="filter-header">
              <h3>Filter Results</h3>
              <button class="btn-text">Reset All</button>
            </div>

            <!-- Resume Upload for Live Match Calculation -->
            <div class="resume-match-widget">
              <div class="widget-title">
                <span>🎯 Live Match Score Calculator</span>
              </div>
              <p class="widget-desc">Upload your CV to recalculate match score for all posted jobs automatically.</p>
              <div class="drop-zone">
                <span class="drop-icon">📄</span>
                <span class="drop-text">Drag & drop CV or <strong>Browse</strong></span>
                <span class="drop-sub">PDF, DOCX (Max 5MB)</span>
              </div>
            </div>

            <div class="filter-group">
              <h4>Job Type</h4>
              <label class="checkbox-container">
                <input type="checkbox" checked> Full-time
                <span class="checkmark"></span>
              </label>
              <label class="checkbox-container">
                <input type="checkbox"> Remote
                <span class="checkmark"></span>
              </label>
              <label class="checkbox-container">
                <input type="checkbox"> Contract / Freelance
                <span class="checkmark"></span>
              </label>
            </div>

            <div class="filter-group">
              <h4>Minimum Match Score</h4>
              <div class="range-slider">
                <input type="range" min="50" max="100" value="80" id="match-range">
                <div class="range-val"><span id="match-val">80</span>% + match</div>
              </div>
            </div>

            <div class="filter-group">
              <h4>Experience Level</h4>
              <label class="checkbox-container">
                <input type="checkbox" checked> Senior Level (5+ yrs)
                <span class="checkmark"></span>
              </label>
              <label class="checkbox-container">
                <input type="checkbox" checked> Mid Level (2-5 yrs)
                <span class="checkmark"></span>
              </label>
              <label class="checkbox-container">
                <input type="checkbox"> Entry Level (0-2 yrs)
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
        </aside>

        <!-- Job Cards List -->
        <div class="job-listings-container">
          <div class="listings-header">
            <h2>Recommended Openings</h2>
            <div class="sort-by">
              <span>Sort by:</span>
              <select>
                <option>Highest AI Match Score</option>
                <option>Newest Posted</option>
                <option>Highest Salary</option>
              </select>
            </div>
          </div>

          <!-- Job Card 1 -->
          <article class="job-card featured">
            <div class="match-badge match-high">
              <span class="score">96%</span>
              <span class="lbl">AI Match</span>
            </div>
            <div class="job-card-header">
              <div class="company-logo logo-tech">TS</div>
              <div>
                <h3 class="job-title">Senior Full Stack UI/UX Engineer</h3>
                <p class="company-name">TechSpire Global • <span class="location">San Francisco, CA (Hybrid)</span></p>
              </div>
            </div>
            <div class="job-tags">
              <span class="tag">React</span>
              <span class="tag">TypeScript</span>
              <span class="tag">Node.js</span>
              <span class="tag">Tailwind CSS</span>
              <span class="tag tag-green">$145k - $175k / yr</span>
              <span class="tag tag-purple">⚡ Instant Tailoring</span>
            </div>
            <p class="job-description">
              Looking for an expert UI Engineer to build ultra-responsive dashboards and interactive Web apps. Must have experience optimizing frontend performance and modular design systems.
            </p>
            <div class="job-card-footer">
              <div class="posting-meta">
                <span>Posted 2 hours ago</span> • <span>18 Applicants</span>
              </div>
              <div class="action-buttons">
                <button class="btn btn-outline btn-action">Save</button>
                <button class="btn btn-secondary btn-action btn-tailor" data-job="1">
                  ⚡ Tailor Resume
                </button>
                <button class="btn btn-primary btn-action btn-apply" data-job="1">
                  Apply Now
                </button>
              </div>
            </div>
          </article>

          <!-- Job Card 2 -->
          <article class="job-card">
            <div class="match-badge match-high">
              <span class="score">88%</span>
              <span class="lbl">AI Match</span>
            </div>
            <div class="job-card-header">
              <div class="company-logo logo-cloud">NV</div>
              <div>
                <h3 class="job-title">Frontend Systems & Optimization Lead</h3>
                <p class="company-name">Nova Cloud Systems • <span class="location">Remote</span></p>
              </div>
            </div>
            <div class="job-tags">
              <span class="tag">Vue.js / Nuxt</span>
              <span class="tag">CSS Architecture</span>
              <span class="tag">Performance Tuning</span>
              <span class="tag tag-green">$130k - $160k / yr</span>
            </div>
            <p class="job-description">
              Architect scalable web client platforms, reduce bundle sizes, and streamline candidate submission experiences.
            </p>
            <div class="job-card-footer">
              <div class="posting-meta">
                <span>Posted 1 day ago</span> • <span>42 Applicants</span>
              </div>
              <div class="action-buttons">
                <button class="btn btn-outline btn-action">Save</button>
                <button class="btn btn-secondary btn-action btn-tailor" data-job="2">
                  ⚡ Tailor Resume
                </button>
                <button class="btn btn-primary btn-action btn-apply" data-job="2">
                  Apply Now
                </button>
              </div>
            </div>
          </article>

          <!-- Job Card 3 -->
          <article class="job-card">
            <div class="match-badge match-med">
              <span class="score">75%</span>
              <span class="lbl">AI Match</span>
            </div>
            <div class="job-card-header">
              <div class="company-logo logo-data">PX</div>
              <div>
                <h3 class="job-title">Senior AI Applications Developer</h3>
                <p class="company-name">Pixelate AI Studio • <span class="location">New York, NY (Onsite)</span></p>
              </div>
            </div>
            <div class="job-tags">
              <span class="tag">Python</span>
              <span class="tag">FastAPI</span>
              <span class="tag">Claude API</span>
              <span class="tag">JavaScript</span>
              <span class="tag tag-green">$150k - $190k / yr</span>
            </div>
            <p class="job-description">
              Integrate on-demand AI LLM features, custom agent workflows, and job tailoring utilities into enterprise platforms.
            </p>
            <div class="job-card-footer">
              <div class="posting-meta">
                <span>Posted 3 days ago</span> • <span>64 Applicants</span>
              </div>
              <div class="action-buttons">
                <button class="btn btn-outline btn-action">Save</button>
                <button class="btn btn-secondary btn-action btn-tailor" data-job="3">
                  ⚡ Tailor Resume
                </button>
                <button class="btn btn-primary btn-action btn-apply" data-job="3">
                  Apply Now
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>


    <!-- TAB 2: AI RESUME TAILOR & MATCH TOOL -->
    <section id="ai-optimizer" class="tab-content">
      <div class="page-header">
        <span class="pill-tag">🤖 On-Demand Skill Engine</span>
        <h2>ATS Job Description & Resume Tailoring System</h2>
        <p>Paste the Job Description and your base Resume to generate an optimized PDF tailored specifically for the requirements in under 60 seconds.</p>
      </div>

      <div class="optimizer-grid">
        <!-- Input Section -->
        <div class="panel-card">
          <div class="panel-header">
            <h3>1. Input Requirements & Resume</h3>
            <span class="step-badge">Step 1 of 2</span>
          </div>
          
          <div class="form-group">
            <label class="form-label">Job Title & Company</label>
            <input type="text" class="form-input" placeholder="e.g. Senior Frontend Engineer at TechCorp" value="Senior Full Stack UI/UX Engineer">
          </div>

          <div class="form-group">
            <label class="form-label">Target Job Description (JD)</label>
            <textarea class="form-textarea" rows="6" placeholder="Paste full job description details here...">We are looking for a Senior UI/UX Engineer proficient in React, TypeScript, Responsive HTML/CSS, performance optimization, and REST API integration. Must demonstrate experience building user-centric dashboards, fast loading components, and clean UI code systems.</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Your Base Resume / CV Text</label>
            <textarea class="form-textarea" rows="6" placeholder="Paste your current resume content or experience bullet points...">Alex Turner - Frontend Engineer. Experienced in building Web apps with React, JavaScript, HTML5, CSS3, Flexbox, CSS Grid. Built 15+ responsive websites, improved load speed by 40%, integrated backend APIs, and collaborated with UI design teams.</textarea>
          </div>

          <div class="upload-inline">
            <span>Or upload resume file:</span>
            <input type="file" id="resume-file" class="file-input-hidden">
            <label for="resume-file" class="btn btn-outline btn-action">📁 Upload PDF / DOCX</label>
          </div>

          <button class="btn btn-action btn-primary btn-full btn-lg mt-4" id="run-optimization-btn">
            ⚡ Analyze Gap & Tailor Resume Now
          </button>
        </div>

        <!-- Real-time Analysis & Tailor Preview -->
        <div class="panel-card results-card">
          <div class="panel-header">
            <h3>2. AI Optimization Insights</h3>
            <span class="status-pill status-ready">Analysis Complete</span>
          </div>

          <!-- Overall Score Meter -->
          <div class="score-container">
            <div class="score-circle">
              <span class="score-val">94%</span>
              <span class="score-label">ATS Compatibility</span>
            </div>
            <div class="score-breakdown">
              <div class="breakdown-item">
                <span class="lbl">Keyword Match</span>
                <div class="bar-bg"><div class="bar-fill" style="width: 95%;"></div></div>
                <span class="num">95%</span>
              </div>
              <div class="breakdown-item">
                <span class="lbl">Skill Alignment</span>
                <div class="bar-bg"><div class="bar-fill" style="width: 92%;"></div></div>
                <span class="num">92%</span>
              </div>
              <div class="breakdown-item">
                <span class="lbl">Factual Integrity</span>
                <div class="bar-bg"><div class="bar-fill green" style="width: 100%;"></div></div>
                <span class="num">100% Verified</span>
              </div>
            </div>
          </div>

          <!-- Missing Keyword Suggestions -->
          <div class="keywords-box">
            <h4>Suggested Keyword Additions</h4>
            <div class="keyword-tags">
              <span class="kw-tag add">+ TypeScript</span>
              <span class="kw-tag add">+ Design System</span>
              <span class="kw-tag add">+ REST API</span>
              <span class="kw-tag match">✓ React</span>
              <span class="kw-tag match">✓ Performance</span>
              <span class="kw-tag match">✓ Responsive HTML/CSS</span>
            </div>
          </div>

          <!-- Live Resume Tailoring Preview -->
          <div class="tailored-preview-box">
            <div class="preview-header">
              <span>Optimized Summary Preview</span>
              <span class="badge-tag">Auto-generated</span>
            </div>
            <p class="preview-text">
              "Results-driven Senior UI/UX Engineer with 6+ years specializing in <strong>React, TypeScript, and high-performance CSS Grid/Flexbox architectures</strong>. Proven success building modular <strong>Design Systems</strong> and responsive enterprise dashboards, improving page metrics by 40% while ensuring seamless <strong>REST API integration</strong>."
            </p>
          </div>

          <div class="action-row">
            <button class="btn btn-outline btn-action flex-1">
              👁️ Preview PDF
            </button>
            <button class="btn btn-primary btn-action flex-1">
              📥 Download Tailored PDF CV
            </button>
          </div>
        </div>
      </div>
    </section>


    <!-- TAB 3: POST A NEW JOB (EMPLOYER PORTAL) -->
    <section id="post-job" class="tab-content">
      <div class="page-header">
        <span class="pill-tag">💼 For Employers & Recruiters</span>
        <h2>Post a New Job Opening</h2>
        <p>Define criteria, target skills, and required experience. Our AI system will automatically rank candidate applicants by ATS match score.</p>
      </div>

      <div class="post-job-container">
        <form class="post-job-form panel-card">
          <div class="form-grid">
            <div class="form-group span-2">
              <label class="form-label">Job Title *</label>
              <input type="text" class="form-input" placeholder="e.g. Senior Frontend UI Engineer" required>
            </div>

            <div class="form-group">
              <label class="form-label">Company Name *</label>
              <input type="text" class="form-input" placeholder="e.g. Acume Tech Labs" required>
            </div>

            <div class="form-group">
              <label class="form-label">Job Location *</label>
              <input type="text" class="form-input" placeholder="e.g. New York, NY or Remote" required>
            </div>

            <div class="form-group">
              <label class="form-label">Employment Type</label>
              <select class="form-select">
                <option>Full-Time</option>
                <option>Part-Time</option>
                <option>Contract / Freelance</option>
                <option>Internship</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Salary Offer Range</label>
              <input type="text" class="form-input" placeholder="e.g. $120,000 - $150,000 / year">
            </div>

            <div class="form-group span-2">
              <label class="form-label">Key Required Skills (Comma Separated)</label>
              <input type="text" class="form-input" placeholder="e.g. React, TypeScript, CSS3, Tailwind, Next.js, Node.js">
            </div>

            <div class="form-group span-2">
              <label class="form-label">Full Job Description & Candidate Expectations *</label>
              <textarea class="form-textarea" rows="7" placeholder="Detailed job description, responsibilities, prerequisites, and perks..." required></textarea>
            </div>
          </div>

          <div class="ai-enhancer-banner">
            <div class="banner-text">
              <strong>✨ AI Job Post Enhancer Active</strong>
              <p>We'll auto-extract core ATS keywords to help candidate match algorithms index your posting faster.</p>
            </div>
            <button type="button" class="btn btn-secondary btn-action">Enhance Description</button>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline btn-action">Save Draft</button>
            <button type="submit" class="btn btn-primary btn-action btn-lg">Publish Job Posting 🚀</button>
          </div>
        </form>
      </div>
    </section>

    <!-- TAB 4: EMPLOYER DASHBOARD -->
    <section id="dashboard" class="tab-content">
      <div class="page-header">
        <span class="pill-tag">📊 Recruiter Analytics</span>
        <h2>Employer Candidate Pipeline</h2>
        <p>Review AI-ranked incoming candidate CVs and applicant match scores.</p>
      </div>

      <div class="dashboard-stats-grid">
        <div class="stat-card">
          <span class="stat-title">Active Job Listings</span>
          <span class="stat-value">4</span>
          <span class="stat-trend positive">↑ 2 new this week</span>
        </div>
        <div class="stat-card">
          <span class="stat-title">Total Applications</span>
          <span class="stat-value">124</span>
          <span class="stat-trend positive">↑ 18 today</span>
        </div>
        <div class="stat-card">
          <span class="stat-title">High Match (90%+)</span>
          <span class="stat-value">38</span>
          <span class="stat-trend neutral">30.6% shortlist rate</span>
        </div>
        <div class="stat-card">
          <span class="stat-title">Avg. Tailoring Accuracy</span>
          <span class="stat-value">94.8%</span>
          <span class="stat-trend positive">Verified Factual</span>
        </div>
      </div>

      <!-- Applicants List Table -->
      <div class="panel-card mt-4">
        <div class="panel-header">
          <h3>Recent Applicants (AI-Ranked)</h3>
          <button class="btn btn-outline btn-action">Export Candidate List (CSV)</button>
        </div>

        <div class="table-responsive">
          <table class="dashboard-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied Job</th>
                <th>AI Match Score</th>
                <th>Tailored Skills</th>
                <th>Applied Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="user-meta">
                    <div class="user-avatar">AT</div>
                    <div>
                      <strong>Alex Turner</strong>
                      <span class="sub">alex.turner@example.com</span>
                    </div>
                  </div>
                </td>
                <td>Senior Full Stack UI/UX Engineer</td>
                <td>
                  <span class="badge-match score-high">96% Match</span>
                </td>
                <td>
                  <div class="inline-tags">
                    <span>React</span> <span>TypeScript</span> <span>CSS Grid</span>
                  </div>
                </td>
                <td>Today, 10:14 AM</td>
                <td>
                  <button class="btn btn-outline btn-action btn-sm">📄 View CV</button>
                  <button class="btn btn-primary btn-action btn-sm">Shortlist</button>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="user-meta">
                    <div class="user-avatar logo-cloud">SP</div>
                    <div>
                      <strong>Sophia Patel</strong>
                      <span class="sub">sophia.p@example.com</span>
                    </div>
                  </div>
                </td>
                <td>Frontend Systems & Optimization Lead</td>
                <td>
                  <span class="badge-match score-high">91% Match</span>
                </td>
                <td>
                  <div class="inline-tags">
                    <span>Vue.js</span> <span>Performance</span> <span>CSS</span>
                  </div>
                </td>
                <td>Yesterday</td>
                <td>
                  <button class="btn btn-outline btn-action btn-sm">📄 View CV</button>
                  <button class="btn btn-primary btn-action btn-sm">Shortlist</button>
                </td>
              </tr>

              <tr>
                <td>
                  <div class="user-meta">
                    <div class="user-avatar logo-data">MK</div>
                    <div>
                      <strong>Marcus Vance</strong>
                      <span class="sub">marcus.vance@dev.io</span>
                    </div>
                  </div>
                </td>
                <td>Senior AI Applications Developer</td>
                <td>
                  <span class="badge-match score-med">78% Match</span>
                </td>
                <td>
                  <div class="inline-tags">
                    <span>Python</span> <span>FastAPI</span> <span>LLM</span>
                  </div>
                </td>
                <td>2 days ago</td>
                <td>
                  <button class="btn btn-outline btn-action btn-sm">📄 View CV</button>
                  <button class="btn btn-primary btn-action btn-sm">Shortlist</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

  </main>

  <!-- Quick Apply / Resume Tailor Modal -->
  <div class="modal-overlay" id="apply-modal">
    <div class="modal-card">
      <button class="modal-close" id="modal-close-btn">&times;</button>
      
      <div class="modal-header">
        <span class="pill-tag">⚡ AI Tailor & Fast Apply</span>
        <h2>Apply for Senior Full Stack UI/UX Engineer</h2>
        <p class="sub">At TechSpire Global • San Francisco, CA</p>
      </div>

      <div class="modal-body">
        <form id="apply-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-input" value="Alex Turner" required>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-input" value="alex.turner@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Select Resume / CV</label>
            <div class="resume-option-box selected">
              <div class="option-header">
                <strong>⚡ Tailored Resume (96% Match)</strong>
                <span class="badge-tag">Recommended</span>
              </div>
              <p>Auto-optimized bullet points matching TechSpire's requirements for React & CSS systems.</p>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">AI Cover Letter Summary</label>
            <textarea class="form-textarea" rows="4">I am excited to apply for the Senior UI/UX Engineer role at TechSpire Global. With deep expertise in responsive web design, React, and modular CSS architecture, I can deliver clean user interfaces that match your high standards.</textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-action" id="modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-primary btn-action btn-lg">Submit Application 🚀</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Notification Toast -->
  <div class="toast" id="toast-notification">
    <span class="toast-icon">✅</span>
    <span class="toast-message" id="toast-msg">Action completed successfully!</span>
  </div>

  <script src="app.js" defer></script>
</body>
</html>
```

```css
/* style.css */

/* ==========================================================================
   DESIGN SYSTEM & CONSTANTS
   ========================================================================== */
:root {
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --primary-light: #eeeffe;
  
  --secondary: #8b5cf6;
  --secondary-hover: #7c3aed;
  
  --accent-green: #10b981;
  --accent-green-light: #d1fae5;
  
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  
  --text-dark: #0f172a;
  --text-muted: #64748b;
  --text-light: #94a3b8;
  
  --border-color: #e2e8f0;
  --border-focus: #818cf8;
  
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 18px;
  --radius-full: 9999px;
  
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);
  --shadow-lg: 0 12px 28px rgba(15, 23, 42, 0.12);
  
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ==========================================================================
   RESET & BASE STYLES
   ========================================================================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-dark);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

a {
  color: var(--primary);
  text-decoration: none;
}

button, input, select, textarea {
  font-family: inherit;
}

/* ==========================================================================
   NAVBAR & HEADER
   ========================================================================== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-dark);
}

.logo-icon {
  font-size: 1.5rem;
}

.brand-logo .highlight {
  color: var(--primary);
}

.badge-ai {
  font-size: 0.65rem;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  vertical-align: super;
  letter-spacing: 0.5