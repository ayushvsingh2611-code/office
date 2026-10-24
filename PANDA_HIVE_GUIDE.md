# 🐼 Panda Hive — Complete Architecture & External Agent Guide

Welcome to **Panda Hive** — a local-first multi-agent harness where your AI agents are brought to life as animated pixel avatars on a living 2D office floor.

Panda Hive is designed to allow you to bring **ANY external agent** (Python, LangChain, AutoGen, CrewAI, custom FastAPI, n8n, OpenAI Assistants, Ollama, etc.) and connect it to your office floor via a lightweight, zero-dependency local REST API & Webhook bridge.

---

## 🚀 Key Features

1. **Live 2D Office Simulation**:
   - Each agent has an assigned desk, monitor screen, coffee breaks, and whiteboard.
   - Avatars physically walk across the floor to workstations:
     - 📚 **Shelf** (`Read` / file search)
     - 💻 **Terminal** (`Bash` / CLI execution)
     - 🌐 **Web Station** (`WebSearch` / research)
     - 📝 **Desk** (`Edit` / code editing)
     - 🧠 **Boardroom** (`Thinking` / architecture)
   - Thought and speech bubbles show live activities, tools, and thoughts.

2. **External Agent Integration (Bring Your Own Agent)**:
   - You don't need Claude Code or local CLI tools if you don't want them!
   - Run your own agent code in Python, Node.js, or any framework.
   - Simply send HTTP POST events to `http://127.0.0.1:3737` to animate your avatar.
   - Send prompts from Panda Hive directly to your agent via Webhook or Poll API.

3. **Agent Sleep Mode (Credit & Resource Saver)**:
   - When an agent is not working, put it into **Sleep Mode** (`zzz 😴`).
   - If running a local PTY CLI, the process is suspended to save CPU and prevent runaway token spend.
   - Supports **Auto-Sleep**: automatically puts agents to sleep the moment their task is marked done/idle.

4. **Panda Aesthetic Design System**:
   - Palette inspired by giant pandas and bamboo groves (Warm Ivory `#FAFCF7`, Forest Ink `#122016`, Bamboo Mint `#2E9E5B`, Cyber Bamboo `#7EDB6A`).
   - Crisp pixel art typography with *Press Start 2P*, modern readability with *Inter*, and code clarity with *JetBrains Mono*.

---

## 🔌 Connecting Your External Agent (API Reference)

When Panda Hive starts, it automatically boots the **External Agent REST Server** on:
```
http://127.0.0.1:3737
```

### 1. Animate Your Avatar (Status & Station)
**Endpoint**: `POST http://127.0.0.1:3737/api/agent/<AGENT_ID>/event`

**Payload**:
```json
{
  "status": "working",
  "action": "Querying PostgreSQL database...",
  "station": "shelf",
  "tool": "Read",
  "progress": 50
}
```

#### Supported Values:
- **`status`**: `'working'` | `'thinking'` | `'idle'` | `'blocked'` | `'success'` | `'sleeping'`
- **`station`**: `'desk'` | `'shelf'` | `'terminal'` | `'web'` | `'board'` | `'mailbox'`
- **`tool`**: `'Read'` | `'Edit'` | `'Write'` | `'Bash'` | `'WebFetch'` | `'WebSearch'`

---

### 2. Display a Thought or Speech Bubble
**Endpoint**: `POST http://127.0.0.1:3737/api/agent/<AGENT_ID>/thought`

**Payload**:
```json
{
  "thought": "Found 3 relevant files in /src/models",
  "station": "shelf",
  "tool": "Read"
}
```

---

### 3. Stream Assistant Text to Sidebar Chat
**Endpoint**: `POST http://127.0.0.1:3737/api/agent/<AGENT_ID>/message`

**Payload**:
```json
{
  "text": "Task complete! Here is the summary of changes..."
}
```

---

### 4. Receive Prompts Sent by User from Panda Hive
You have two easy ways to receive user prompts:

#### Option A: Webhook (Push)
When adding the agent in Panda Hive, enter your webhook URL (e.g. `http://localhost:8000/chat`).
Whenever the user types a prompt in Panda Hive, Panda Hive immediately sends:
```json
POST http://localhost:8000/chat
{
  "agentId": "my-agent",
  "prompt": "Write unit tests for authentication",
  "replyUrl": "http://127.0.0.1:3737/api/agent/my-agent/event"
}
```

#### Option B: Polling (Pull)
If your agent doesn't run a web server, it can poll queued user prompts:
**Endpoint**: `GET http://127.0.0.1:3737/api/agent/<AGENT_ID>/poll`

**Response**:
```json
{
  "ok": true,
  "count": 1,
  "messages": [
    {
      "id": "ext-msg-12345",
      "text": "Please summarize the latest git commit",
      "timestamp": 1729320000000
    }
  ]
}
```

---

## 🐍 Python Example (LangChain / AutoGen / FastAPI)

Here is a ready-to-run Python script connecting your external agent:

```python
import time
import requests

PANDA_HIVE = "http://127.0.0.1:3737"
AGENT_ID = "research-bot"  # Same ID you created in Add Agent modal

def report_to_floor(action: str, station="desk", tool=None, status="working"):
    """Update avatar animation and speech bubble on Panda Hive floor."""
    payload = {
        "status": status,
        "action": action,
        "station": station,
        "tool": tool
    }
    requests.post(f"{PANDA_HIVE}/api/agent/{AGENT_ID}/event", json=payload)

# Example workflow
print("Starting agent task...")

# Step 1: Walk to shelf to search files
report_to_floor("Searching project documents", station="shelf", tool="Read")
time.sleep(3)

# Step 2: Walk to terminal to run tests
report_to_floor("Running pytest suite", station="terminal", tool="Bash")
time.sleep(3)

# Step 3: Sit at desk and write solution
report_to_floor("Writing final report", station="desk", tool="Write")
time.sleep(3)

# Step 4: Cheer & finish!
report_to_floor("All tasks completed successfully!", status="success")
```

---

## 📦 How to Add an External Agent in Panda Hive

1. Open Panda Hive.
2. Click **Add Agent** (`+` button).
3. In **Engine**, select **External (API / Webhook)**.
4. Name your agent (e.g. `Research Panda`), pick an avatar (Jim, Pam, Dwight, etc.), and choose a shirt color.
5. (Optional) Provide your Bot Webhook URL if you want Panda Hive to push user messages to your bot.
6. Click **Spawn**! Your avatar immediately walks onto the floor!
7. Select the agent in the sidebar to view its **External Agent Hub**, live controls, test actions, and endpoints!
