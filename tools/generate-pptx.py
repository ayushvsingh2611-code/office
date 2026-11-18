import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    screenshots_dir = os.path.join(base_dir, "docs", "screenshots")

    # Colors
    BG_COLOR = RGBColor(11, 15, 25)       # Obsidian Dark #0b0f19
    CARD_BG = RGBColor(17, 24, 39)        # Card Navy #111827
    CYAN = RGBColor(0, 240, 255)          # Neon Cyan #00f0ff
    TEXT_WHITE = RGBColor(241, 245, 249)  # Slate White #f1f5f9
    TEXT_MUTED = RGBColor(148, 163, 184)  # Slate Muted #94a3b8
    ACCENT_MINT = RGBColor(52, 211, 153)  # Mint Green #34d399
    ACCENT_GOLD = RGBColor(251, 191, 36)  # Gold #fbbf24

    slides_data = [
        {
            "slide_num": "01",
            "title": "AgentHive: Autonomous Multi-Agent Software Engineering Studio",
            "subtitle": "Visual 2D Spatial Telemetry, Dual Concurrent Sprints & Multi-Model LLM Orchestration",
            "bullets": [
                "Local-first Autonomous Studio: Eliminates single-agent hallucinations via role specialization.",
                "Straw Hat Multi-Model Crew: Architects (Nami/Robin), Builders (Zoro/Shanks), and QA Verifiers (Sanji/Hancock).",
                "Spatial 2D Office: 60 FPS PixiJS canvas with real-time A* pathfinding and live code monitors.",
                "Zero Data Egress: 100% self-hosted under user's own API keys with SQLite task persistence."
            ],
            "image": "01_office_floor_main.png",
            "tag": "PROJECT OVERVIEW & CORE ARCHITECTURE",
            "notes": "Good morning examiners. Today I am presenting AgentHive, a breakthrough multi-agent engineering platform that replaces single-chat AI assistants with a visual collaborative squad of autonomous software engineers."
        },
        {
            "slide_num": "02",
            "title": "The Problem: Failure Modes of Single-Agent Coding Assistants",
            "subtitle": "Why linear chat prompts fail at production software engineering",
            "bullets": [
                "Cognitive Overload: One LLM trying to design schemas, write HTML/CSS, code logic, and test crashes or stubs.",
                "The Black Box Problem: Spinners provide zero insight into what the AI is editing or where it's stuck.",
                "Blank Screen Prototype Failure: Rate-limited or offline public APIs render dead white screens.",
                "Unbounded Spend & Recursion: Infinite tool hallucination loops exhaust 128k/200k context windows."
            ],
            "image": "01_office_floor_main.png",
            "tag": "PROBLEM STATEMENT & MOTIVATION",
            "notes": "Traditional tools like ChatGPT or Copilot suffer from four critical failure modes. AgentHive solves this with physical role division and hardware-governed circuit breakers."
        },
        {
            "slide_num": "03",
            "title": "Straw Hat Multi-Model Crew & Role Specialization",
            "subtitle": "Division of labor across 10 specialized autonomous engineering personas",
            "bullets": [
                "Captain Luffy: Central prompt decomposer and sprint task delegator.",
                "Architects (Nami & Robin): Generates spec.md, component trees, DOM IDs, and API contracts.",
                "Full-Stack Builders (Zoro & Shanks): Writes semantic HTML5, modern CSS, and modular app.js.",
                "QA & Browser Verifiers (Sanji & Hancock): Headless browser audits, DOM assertions, and repair loops.",
                "Usopp (Café Waiter): Roams the office floor serving coffee/snacks to boost coder morale."
            ],
            "image": "03_external_agent_sanji.png",
            "tag": "MULTI-AGENT ROLE SPECIALIZATION",
            "notes": "Notice how Sanji is our QA Browser Verifier. He runs automated Playwright syntax audits and DOM checks, feeding real defects back to Zoro for instant self-healing."
        },
        {
            "slide_num": "04",
            "title": "Dual Concurrent Sprints & A/B Competitive Evaluation",
            "subtitle": "Parallel engineering squads competing on isolated Git Worktrees",
            "bullets": [
                "Parallel Squad Execution: Group 1 (Nami/Zoro/Sanji) vs Group 2 (Robin/Shanks/Hancock).",
                "Git Worktree Isolation: Each squad works in separate disk checkouts without branch locks.",
                "Side-by-Side Telemetry: Real-time execution time, token burn, DOM error count, and visual previews.",
                "One-Click Branch Merge: Developer picks the superior implementation to merge into main."
            ],
            "image": "02_dual_sprint_cafe.png",
            "tag": "COMPETITIVE A/B SPRINT ENGINE",
            "notes": "Here is our Dual Sprint & Café panel. You can submit a prompt like 'Build a Car Racing Game', and both squads build competing implementations in parallel with zero merge collisions."
        },
        {
            "slide_num": "05",
            "title": "2D PixiJS Spatial Office Floor & Real-Time Telemetry",
            "subtitle": "Gamified 60 FPS virtual office replacing traditional terminal loading spinners",
            "bullets": [
                "WebGL 2D Game Engine: Pixi.js v8 rendering 34x22 tilemap with 1,147 physical sprites.",
                "A* Pathfinding: Autonomous avatars calculate collision-free paths to desks, servers, and café.",
                "Spatial State Machine: Displays idle (zzz), walking, thinking (thought bubble), and typing states.",
                "Live Screen Monitor Glows: Computer monitors light up and stream real-time syntax code."
            ],
            "image": "01_office_floor_main.png",
            "tag": "SPATIAL TELEMETRY & GAME ENGINE",
            "notes": "The 2D floor gives the developer immediate visual awareness of the entire office. You can see who is architecting, who is writing code, and who is testing."
        },
        {
            "slide_num": "06",
            "title": "External Agent API & Multi-Engine Universal Bridge (:3737)",
            "subtitle": "Connecting external Python, LangChain, and Lyzr AI Studio agents to the floor",
            "bullets": [
                "Port 3737 HTTP & WebSocket Server: Built into Electron's main process for programmatic dispatch.",
                "cURL, Python & Node.js SDKs: One-line POST endpoints to trigger tasks and control avatars.",
                "Live Telemetry Injection: External scripts can display speech bubbles, cheer, or trigger desk typing.",
                "Lyzr AI Studio Integration: Native API key and session management for enterprise cloud agents."
            ],
            "image": "03_external_agent_sanji.png",
            "tag": "UNIVERSAL API & DEVELOPER BRIDGE",
            "notes": "AgentHive exposes port 3737. External scripts in Python or LangChain can send tasks directly to our avatars and receive generated artifacts in real time."
        },
        {
            "slide_num": "07",
            "title": "Smart On-Demand Skills Engine (252 Auto-Resolved Skills)",
            "subtitle": "Runtime directive injection from top open-source agent catalogs",
            "bullets": [
                "252 Catalog Skills: Sourced from anthropics/skills and awesome-cursorrules repositories.",
                "Smart Keyword Resolver: Dynamically injects game loops and design rules without manual downloads.",
                "frontend-design: Enforces Anthropic visual polish, distinctive fonts, and high-contrast styling.",
                "web-game-engine: Enforces 60 FPS requestAnimationFrame loops, collision physics, and Web Audio API."
            ],
            "image": "04_skills_catalog.png",
            "tag": "RUNTIME SKILLS & DIRECTIVES",
            "notes": "Our Smart Skills engine analyzes the prompt and auto-injects specialized architectural rules like 60 FPS canvas game engines or responsive e-commerce layouts."
        },
        {
            "slide_num": "08",
            "title": "Zero-Blank Resilient Public APIs Catalog",
            "subtitle": "16 verified zero-auth APIs with mandatory 5-second fallback seed data",
            "bullets": [
                "Curated Zero-Auth APIs: DummyJSON, Open-Meteo, CoinGecko, TheMealDB, Jikan, Open Trivia DB.",
                "Mandatory Hybrid Fetch: AbortSignal.timeout(5000) prevents stalled network calls.",
                "Anti-Blank Guarantee: If the public API is offline or blocked, instant local seed data renders immediately.",
                "100% Offline Capability: Generated web apps work fully offline on airplanes or private intranets."
            ],
            "image": "16_live_generated_crypto.png",
            "tag": "RESILIENT DATA & API ARCHITECTURE",
            "notes": "Here is our Crypto dashboard demo. Even if CoinGecko is unreachable, our hybrid fetch pattern seamlessly renders verified seed prices so the UI never displays an ugly blank error."
        },
        {
            "slide_num": "09",
            "title": "Tasks Kanban Board & Sprint Task Management",
            "subtitle": "ACID-compliant SQLite task logging and board visualization",
            "bullets": [
                "Four-Column Kanban: Todo, Doing, Review, and Done lanes updated via reactive Zustand store.",
                "Multi-Agent Task Tracking: Tracks card ownership across Luffy, Nami, Zoro, and Sanji.",
                "SQLite3 Atomic Persistence: better-sqlite3 engine prevents race conditions across concurrent workers.",
                "Full Audit Logs: Records time-to-completion, model tokens consumed, and diff summaries."
            ],
            "image": "05_tasks_kanban.png",
            "tag": "TASK MANAGEMENT & AUDIT LOGS",
            "notes": "Our Kanban board tracks every task moving across the Straw Hat squad, backed by a high-performance local SQLite database."
        },
        {
            "slide_num": "10",
            "title": "Settings: Host Environment, Office Themes & Danger Zone",
            "subtitle": "Tab 1: Deep configuration for process keepalive, themes, and reset mechanics",
            "bullets": [
                "strongKeepalive: Uses Electron powerSaveBlocker to prevent OS sleep during long coding runs.",
                "Explain Things Simply: Toggles between executive plain English and low-level CLI/diff logs.",
                "6 Pixel-Art Themes: Dunder Mifflin, Central Perk, Brooklyn Nine-Nine, Silicon Valley, Hogwarts.",
                "Atomic Home Folder Move: Relocate agent workspaces, Git history, and memories with 1 click."
            ],
            "image": "07_settings_general.png",
            "tag": "SETTINGS DEEP DIVE: GENERAL",
            "notes": "Settings Tab 1 manages runtime environment, keepalive flags, TV-show office maps, and the atomic home folder relocation tool."
        },
        {
            "slide_num": "11",
            "title": "Settings: 15-Tool System Prerequisites Diagnostics",
            "subtitle": "Tab 2: Automated verification of external compilers, package managers, and engines",
            "bullets": [
                "Astral UV Scanner: Ultra-fast Rust Python manager for self-contained MemPalace vector search.",
                "Git Worktrees Verification: Essential for concurrent branch checkouts without merge collisions.",
                "Node.js Runtime: Executes JavaScript CLIs and sandboxed execution environments.",
                "11 Agent CLIs: Probes Claude Code, OpenCode, Codex, Cursor, Gemini, and local OSS engines.",
                "Zero-Silent-Failure: Clearly distinguishes between missing tools and unconfigured features."
            ],
            "image": "08_settings_prerequisites.png",
            "tag": "SETTINGS DEEP DIVE: PREREQUISITES",
            "notes": "Tab 2 scans 15 system binaries on the developer machine. If an engine is missing, it provides copyable one-click terminal commands."
        },
        {
            "slide_num": "12",
            "title": "Settings: AI Engines, Models & Recursion Ceilings",
            "subtitle": "Tab 3: Model hierarchy, encrypted credentials, and infinite loop safeguards",
            "bullets": [
                "Multi-Model Hierarchy: Claude 3.5 Sonnet, Haiku, Gemini 1.5 Pro (2M context), GPT-4o, and DeepSeek.",
                "Local Endpoints: Native support for OmniRoute (:20128), Ollama (:11434), and vLLM (:8000).",
                "DPAPI Key Vault: Credentials encrypted via Electron safeStorage (never saved in plaintext).",
                "Max Turns Ceilings: Prevents runaway recursion by terminating looping agents after turn N."
            ],
            "image": "09_settings_agents_models.png",
            "tag": "SETTINGS DEEP DIVE: AGENTS & MODELS",
            "notes": "Tab 3 configures our multi-model routing. It securely encrypts API keys using Windows DPAPI and caps recursion turns."
        },
        {
            "slide_num": "13",
            "title": "Settings: The 5-Layer Circuit Breaker & Safety System",
            "subtitle": "Tab 4: Hard financial spend caps, velocity limits, and error storm protection",
            "bullets": [
                "Floor Token Ceiling: Hard cap (e.g. 1M / 5M tokens) halts all 10 agents to protect user budget.",
                "Token Velocity Guard: Caps tokens/minute to detect runaway LLM hallucination spikes within 60s.",
                "Repeated Tool Interceptor: Halts agents that execute identical tool arguments 5 times consecutively.",
                "Error Storm Detector: Trips when terminal commands return non-zero exit codes 5 times in a row.",
                "Steer-First vs Kill: Injects corrective prompts before resorting to hard process termination."
            ],
            "image": "10_settings_autonomy_budgets.png",
            "tag": "SETTINGS DEEP DIVE: SAFETY & CIRCUIT BREAKERS",
            "notes": "Tab 4 is our safety shield. The 5-layer Circuit Breaker protects the developer's wallet and stops infinite tool loops dead in their tracks."
        },
        {
            "slide_num": "14",
            "title": "Settings: Connections, MCP Servers & Webhook Security",
            "subtitle": "Tab 6: Model Context Protocol defaults, Slack bots, and multi-tenant endpoints",
            "bullets": [
                "Pre-configured MCP Servers: Scoped filesystem, GitHub PRs, SQLite database, and Brave web search.",
                "Slack Integration: Port 3847 listener with HMAC SHA-256 signatures and bot user tokens (xoxb-).",
                "Multi-Tenant Inbound Webhooks: Per-caller URLs (/wh-...) with 256-bit cryptographic secrets.",
                "3 Security Modes: Allow all (200), Communication only (chat only), and Strict (quarantined approval)."
            ],
            "image": "11_settings_connections.png",
            "tag": "SETTINGS DEEP DIVE: CONNECTIONS & MCP",
            "notes": "Tab 6 manages our Model Context Protocol servers, bi-directional Slack integration, and multi-tenant webhook listeners."
        },
        {
            "slide_num": "15",
            "title": "Settings: Multimodal Voice & Realtime Conversational AI",
            "subtitle": "Tab 7: Sub-300ms Groq Whisper dictation and OpenAI Realtime Michael",
            "bullets": [
                "Free Flow Voice Dictation: Groq Cloud LPU running whisper-large-v3-turbo in sub-300ms.",
                "Global Push-to-Talk: Hold Option (⌥) / Alt hotkey anywhere in terminal to speak and transcribe.",
                "Realtime Michael: Bi-directional 24kHz PCM WebSocket stream to gpt-4o-realtime-preview.",
                "Cost HUD & Auto-Disconnect: Live $/second cost ticker and idle timers to prevent billing leaks."
            ],
            "image": "12_settings_voice.png",
            "tag": "SETTINGS DEEP DIVE: MULTIMODAL VOICE",
            "notes": "Tab 7 powers our voice loop. Developers can hold Alt to dictate prompts via Groq Whisper or engage in full-duplex conversational voice with Realtime Michael."
        },
        {
            "slide_num": "16",
            "title": "Live Showcase: Generated Web Applications",
            "subtitle": "Demonstrating real prototypes built autonomously by the Straw Hat crew",
            "bullets": [
                "Car Racing Game: 60 FPS HTML5 Canvas game loop, keyboard controls, particle trails, and audio.",
                "ClothMania E-Commerce: Dynamic catalog filtering, shopping cart state, and responsive checkout.",
                "Crypto Market Tracker: Live data graphs, currency conversions, and seed fallback resilience.",
                "Dockerized Artifacts: Every project includes an autonomous Dockerfile ready for cloud deployment."
            ],
            "image": "14_live_generated_carrace.png",
            "tag": "AUTONOMOUS PRODUCTION ARTIFACTS",
            "notes": "These are real applications built completely by AgentHive. They feature 60 FPS Canvas loops, responsive layouts, and containerized Dockerfiles."
        },
        {
            "slide_num": "17",
            "title": "AWS Cloud Production Roadmap (9 Services for ~$7.50/mo)",
            "subtitle": "Deploying AgentHive on AWS within Free Tier and $120 Student Credits",
            "bullets": [
                "Custom .in Domain: Route 53 Hosted Zone + AWS Certificate Manager (ACM) SSL/TLS.",
                "Global Edge CDN: CloudFront edge caching + S3 origin for static React assets.",
                "Serverless Orchestrator: AWS App Runner pulling container images from Amazon ECR.",
                "State & Secrets: DynamoDB (Pay-Per-Request) for tasks + Secrets Manager for encrypted keys.",
                "Zero-Overage Budget: Fixed budget alerts in AWS CloudWatch ensuring 12+ months within $120."
            ],
            "image": "15_live_generated_clothmania.png",
            "tag": "AWS DEPLOYMENT & CLOUD ARCHITECTURE",
            "notes": "Our cloud architecture leverages 9 AWS services optimized for the user's custom .in domain, running completely within their $120 promotional credit limit."
        },
        {
            "slide_num": "18",
            "title": "Conclusion & Technical Defense Summary",
            "subtitle": "Key innovations, GitHub repository, and open floor for defense questions",
            "bullets": [
                "Multi-Model Division: Solves single-agent hallucinations via specialized Straw Hat squads.",
                "Spatial Telemetry: PixiJS 2D Canvas gives complete observability into autonomous AI work.",
                "Dual Sprints: Enables competitive A/B testing on isolated Git Worktrees.",
                "Safety & Reliability: 5-layer Circuit Breakers and resilient public API fallback patterns.",
                "GitHub Repository: 100% committed, tested, and pushed to github.com/ayushvsingh2611-code/office."
            ],
            "image": "01_office_floor_main.png",
            "tag": "CONCLUSION & VIVA DEFENSE",
            "notes": "To conclude, AgentHive transforms generative AI from an unpredictable text chatbot into a reliable, observable, and multi-agent engineering team. I welcome your questions."
        }
    ]

    for data in slides_data:
        blank_slide_layout = prs.slide_layouts[6] # Blank slide
        slide = prs.slides.add_slide(blank_slide_layout)

        # 1. Background fill
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()

        # 2. Top Header Card
        header = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(1.3))
        header.fill.solid()
        header.fill.fore_color.rgb = CARD_BG
        header.line.color.rgb = CYAN
        header.line.width = Pt(1.5)

        # Category Tag
        tag_box = slide.shapes.add_textbox(Inches(1.0), Inches(0.45), Inches(9.0), Inches(0.3))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = f"SLIDE {data['slide_num']} // {data['tag']}"
        p_tag.font.name = "Consolas"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = ACCENT_MINT

        # Title
        title_box = slide.shapes.add_textbox(Inches(1.0), Inches(0.7), Inches(11.3), Inches(0.5))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = data["title"]
        p_title.font.name = "Segoe UI"
        p_title.font.size = Pt(19)
        p_title.font.bold = True
        p_title.font.color.rgb = CYAN

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(1.0), Inches(1.2), Inches(11.3), Inches(0.4))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = data["subtitle"]
        p_sub.font.name = "Segoe UI"
        p_sub.font.size = Pt(12)
        p_sub.font.color.rgb = TEXT_MUTED

        # 3. Left Content Card (Bullet Points)
        content_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.9), Inches(5.8), Inches(5.1))
        content_box.fill.solid()
        content_box.fill.fore_color.rgb = CARD_BG
        content_box.line.color.rgb = RGBColor(30, 41, 59)
        content_box.line.width = Pt(1)

        # Bullets
        bullets_tf = slide.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(5.4), Inches(4.8)).text_frame
        bullets_tf.word_wrap = True
        for i, b in enumerate(data["bullets"]):
            p = bullets_tf.add_paragraph() if i > 0 else bullets_tf.paragraphs[0]
            p.text = f"▶  {b}"
            p.font.name = "Segoe UI"
            p.font.size = Pt(13)
            p.font.color.rgb = TEXT_WHITE
            p.space_after = Pt(14)
            p.line_spacing = 1.25

        # 4. Right Image Card (Screenshot)
        img_name = data.get("image", "01_office_floor_main.png")
        img_path = os.path.join(screenshots_dir, img_name)
        if os.path.exists(img_path):
            img_frame = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(6.8), Inches(1.9), Inches(5.733), Inches(5.1))
            img_frame.fill.solid()
            img_frame.fill.fore_color.rgb = RGBColor(15, 23, 42)
            img_frame.line.color.rgb = CYAN
            img_frame.line.width = Pt(1.5)

            # Insert Screenshot inside the frame
            slide.shapes.add_picture(img_path, Inches(6.88), Inches(1.98), width=Inches(5.57), height=Inches(4.94))

        # 5. Add Speaker Notes
        notes_slide = slide.notes_slide
        tf_notes = notes_slide.notes_text_frame
        tf_notes.text = data["notes"]

    output_pptx = os.path.join(base_dir, "AgentHive_Master_Presentation.pptx")
    prs.save(output_pptx)
    print(f"PowerPoint Presentation generated successfully at: {output_pptx}")

    # Also copy to docs/
    docs_pptx = os.path.join(base_dir, "docs", "AgentHive_Master_Presentation.pptx")
    prs.save(docs_pptx)
    print(f"PowerPoint Presentation also saved to: {docs_pptx}")

if __name__ == "__main__":
    create_deck()
