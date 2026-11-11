<div align="center">

<img src="./docs/logo.png" alt="AgentHive — local-first multi-agent harness" width="340">

# AgentHive ⚡

### Local-first AI agent harness & 2D office floor for your autonomous clones

**Free, open-source, and private** — a multi-agent harness that runs entirely on your local machine. It transforms the terminal coding CLIs and API engines you already use into an organized hive of autonomous agents, visualized as retro pixel-art avatars on a live 2D office floor.

Wraps **Claude Code**, **Antigravity (Gemini)**, **OpenAI Codex**, **xAI Grok**, **Kimi Code**, **Qwen**, **OpenCode**, **Crush**, **pi.dev**, and **GitHub Copilot CLI** — with local models (Ollama, LM Studio, vLLM) and bring-your-own API keys.

<p>
  <em>Electron · React · TypeScript · Pixi.js · xterm.js · node-pty · Monaco Editor</em>
</p>

<p>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-7EDB6A.svg?style=flat-square&labelColor=0D1F12"></a>
  <img alt="Version: 0.1.0" src="https://img.shields.io/badge/version-0.1.0-7EDB6A.svg?style=flat-square&labelColor=0D1F12">
  <img alt="Status: active" src="https://img.shields.io/badge/status-production%20ready-7EDB6A.svg?style=flat-square&labelColor=0D1F12">
  <img alt="Platform: Windows | macOS | Linux" src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-7EDB6A.svg?style=flat-square&labelColor=0D1F12">
</p>

</div>

---

## 🌟 Key Features

### 🏢 2D Pixel-Art Office Floor (Pixi.js)
- **Living Office Avatars**: Real PTY processes mapped to retro characters with custom hair, outfits, expressions, and thought bubbles.
- **Realistic A* Pathfinding**: Avatars walk between desks, water coolers, meeting rooms, and break stations as tasks execute.
- **11 Unique Agent Personas**: Pre-configured team roles (Frontend, Backend, DevOps, QA, Lead) with full customizability.

### 📢 Warroom & Conference Standups
- **Auto-Standup Meetings**: When you or another agent submits a team-wide directive to the Boss agent (`Michael Scott`), agents assemble around the warroom conference table.
- **Dedicated Seating**: Characters cleanly navigate to conference chairs, take their seats facing the table, deliberate with speech bubbles, and return to their desks when dispersed.
- **Manual Disperse & Steer**: One-click `🏃 Disperse` button to dismiss meetings and resume focus work.

### 🌙 1-Click Sleep & Wake Up
- **Tired of runaway tasks?** Toggle any agent into a deep sleep (`🌙 SLEEP`) right from their card.
- **Sleeping State**: Eyes close (`- -`), face shifts to a relaxed lavender hue, thought bubble displays `zzz 😴`, and floating animated sleep particles drift up.
- **Instant Wake Up**: Tap `☀️ WAKE` to wake the agent, triggering a celebratory cheer (`awake! ☀️`) and instant reconnection.

### 💻 Embedded Monaco IDE & Git Rails
- **Built-in Editor**: Toggle the `<> IDE` panel for a full-featured Monaco code editor (VS Code core) directly inside the app.
- **Git Rails**: Inspect changes, commit history, branch diffs, and perform guarded commits without leaving the harness.
- **Multi-Tab File Explorer**: Browse and edit workspace files side-by-side with running agent terminals.

### ⚡ Persistent Terminal Pooling
- **Instant Tab Switching**: Terminals are pooled and rendered with `xterm.js` and `node-pty`. Switching agents never destroys terminal history or buffers.
- **Full Shell Authenticity**: Complete ANSI color, interactive input, and hotkey support.

---

## 🏛️ Architecture

```
            you ── talk to ──►  ┌─────────────┐
                                │  BOSS agent │  orchestrator / supervisor
                                │ (Michael's  │  roster · routing · standups
                                │   office)   │  blackboard · task ledger
                                └──────┬──────┘
                                       │ assigns · routes · standups
               ┌───────────────────────┼───────────────────────┐
               ▼                       ▼                       ▼
         ┌───────────┐           ┌───────────┐           ┌───────────┐
         │ Frontend  │  message  │  Backend  │  message  │   DevOps  │
         │   Agent   │ ────────► │   Agent   │ ────────► │   Agent   │
         │  + memory │           │  + memory │           │  + memory │
         └───────────┘           └───────────┘           └───────────┘
               └──────── shared hive: memory · mailbox · blackboard ──────┘
```

1. **Local Terminal Plane**: Node main process manages isolated PTY sessions (`node-pty`) streaming over IPC to renderer `xterm.js` instances.
2. **Hive Event Plane**: High-speed local filesystem message queues (`inbox/` and `outbox/`) coordinate inter-agent collaboration.
3. **Supervisor Orchestration**: The Boss agent adjudicates, routes tasks, schedules standup meetings, and alerts you only when human approval is required.

---

## 🚀 Getting Started

### Prerequisites
- **Windows 10/11, macOS, or Linux**
- **Node.js 18+** and **npm**
- C/C++ build tools (for `node-pty` native compilation):
  - **Windows**: Visual Studio C++ Build Tools (`npm install -g windows-build-tools` or install via Visual Studio Installer)
  - **macOS**: `xcode-select --install`
  - **Linux**: `sudo apt install build-essential`

### Installation

```bash
# Clone the repository
git clone https://github.com/ayushvsingh2611-code/office.git
cd office

# Install dependencies (automatically builds node-pty native shims)
npm install

# Run the app locally in development mode
npm run dev
```

### Standalone Production Build

```bash
# Typecheck TypeScript files
npm run typecheck

# Build renderer and main bundles
npm run build

# Package standalone Windows installer / executable (.exe)
npm run dist:win

# Package macOS (.dmg) or Linux (.AppImage)
npm run dist:mac
npm run dist:linux
```

The compiled binaries will be output into the `dist/` directory.

---

## 📂 Project Structure

```
├── electron.vite.config.ts    # Build configuration for main, preload, and renderer
├── electron-builder.yml       # Packaging configuration for Windows/macOS/Linux
├── src/
│   ├── main/                  # Electron main process (PTY, Hive, SQLite, System bridges)
│   │   ├── index.ts           # App lifecycle & IPC handlers
│   │   ├── pty.ts             # PTY process manager (node-pty)
│   │   └── hive.ts            # Local file-based message router
│   ├── preload/               # Secure contextBridge API (`window.cth`)
│   └── renderer/src/          # React frontend
│       ├── scene/office/      # Pixi.js 2D office engine, characters, pathfinder
│       ├── components/        # Agent cards, Command Center, Monaco IDE, Modals
│       ├── store/             # Zustand state management
│       └── design/            # CSS tokens, color palettes, and themes
```

---

## 📄 License

The source code of **AgentHive** is licensed under the [MIT License](./LICENSE).  
Office tileset and sprite assets are used in accordance with the LimeZu non-commercial terms.

---

<div align="center">
  <sub>Built with ❤️ for AI engineering teams and autonomous agent pair-programming.</sub>
</div>
