# 🧭 Nami's Data Architecture Blueprint: Streaming Application

Namaste! I am **Nami**, your Data Architect. 
For our **Real-Time Streaming Application**, I have engineered a robust, scalable, and high-performance data architecture. This blueprint covers our database entities, state management schema, strict API contracts, and multi-layered data validation rules, specifically tuned for real-time video/audio streaming, chat integration, and interactive control states.

---

## 1. Entity-Relationship & Database Schema

We use a hybrid relational (PostgreSQL for user/session persistence) and time-series/NoSQL (Redis/MongoDB for real-time telemetry, chat, and stream health) architecture.

### Core Entities

```
+------------------+       +-------------------+       +--------------------+
|      User        |       |    StreamSession  |       |   ChatOrMessage    |
+------------------+       +-------------------+       +--------------------+
| PK: user_id      |<------| FK: creator_id    |       | PK: message_id     |
| username         |       | PK: session_id    |------>| FK: session_id     |
| email            |       | title, category   |       | FK: sender_id      |
| role (enum)      |       | status (enum)     |       | content, timestamp |
| created_at       |       | started_at        |       +--------------------+
+------------------+       +-------------------+                 |
         |                          |                            |
         v                          v                            v
+------------------+       +-------------------+       +--------------------+
|  StreamAnalytics |       |    EncoderNode    |       |   StreamMetrics    |
+------------------+       +-------------------+       +--------------------+
| PK: analytic_id  |       | PK: node_id       |       | PK: metric_id      |
| FK: session_id   |       | region            |       | FK: session_id     |
| concurrent_viewers|      | load_percentage   |       | bitrate, fps, drop |
| total_bandwidth  |       | status (enum)     |       | recorded_at        |
+------------------+       +-------------------+       +--------------------+
```

### Table Definitions (DDL Specification)

```sql
-- 1. Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('VIEWER', 'STREAMER', 'MODERATOR', 'ADMIN')) DEFAULT 'VIEWER',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Stream Sessions Table
CREATE TABLE stream_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('PREPARING', 'LIVE', 'PAUSED', 'ENDED')) DEFAULT 'PREPARING',
    playback_url TEXT,
    rtmp_stream_key VARCHAR(64) UNIQUE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Chat Messages Table
CREATE TABLE chat_messages (
    message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES stream_sessions(session_id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Stream Telemetry Metrics (Time-Series)
CREATE TABLE stream_metrics (
    metric_id BIGSERIAL PRIMARY KEY,
    session_id UUID REFERENCES stream_sessions(session_id) ON DELETE CASCADE,
    bitrate_kbps INTEGER NOT NULL,
    fps SMALLINT NOT NULL,
    dropped_frames INTEGER DEFAULT 0,
    current_viewers INTEGER DEFAULT 0,
    cpu_usage_pct DECIMAL(5,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metrics_session_time ON stream_metrics(session_id, recorded_at DESC);
```

---

## 2. State Management Architecture

For our frontend streaming interface, we utilize a modular state structure separating global authentication, active stream metadata, real-time socket events, and UI controls.

### State Tree Interface (TypeScript)

```typescript
export type StreamStatus = 'PREPARING' | 'LIVE' | 'PAUSED' | 'ENDED';

export interface UserState {
  userId: string | null;
  username: string | null;
  role: 'VIEWER' | 'STREAMER' | 'MODERATOR' | 'ADMIN' | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface StreamControlState {
  sessionId: string | null;
  status: StreamStatus;
  isMuted: boolean;
  isVideoEnabled: boolean;
  volume: number; // 0.0 to 1.0
  qualityPreset: '1080p60' | '720p30' | '480p30' | 'AUTO';
  bitrate: number;
  fps: number;
  droppedFrames: number;
}

export interface ChatMessageState {
  messageId: string;
  senderId: string;
  username: string;
  content: string;
  timestamp: string;
  isPinned: boolean;
}

export interface UIModalState {
  isSettingsOpen: boolean;
  isAnalyticsOpen: boolean;
  isShareModalOpen: boolean;
}

export interface RootState {
  user: UserState;
  stream: StreamControlState;
  chat: {
    messages: ChatMessageState[];
    isConnected: boolean;
    activeViewersCount: number;
  };
  ui: UIModalState;
}
```

---

## 3. API Contracts (REST & WebSocket)

### A. REST Endpoints

#### 1. Initialize Stream Session
* **Endpoint:** `POST /api/v1/streams`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`
* **Request Body:**
```json
{
  "title": "Building a Streaming App with Claude & Nami",
  "category": "Software Development",
  "description": "Live coding session focusing on Data Architecture and WebSockets."
}
```
* **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "sessionId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "rtmpUrl": "rtmp://ingest.pandahive.io/live",
    "streamKey": "pk_live_9a87fbc6543210edcba",
    "playbackUrl": "https://cdn.pandahive.io/live/f81d4fae/index.m3u8",
    "status": "PREPARING",
    "createdAt": "2026-03-30T12:00:00Z"
  }
}
```

#### 2. Update Stream Status (Start / Pause / End)
* **Endpoint:** `PATCH /api/v1/streams/{sessionId}/status`
* **Request Body:**
```json
{
  "status": "LIVE"
}
```
* **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
    "status": "LIVE",
    "updatedAt": "2026-03-30T12:05:00Z"
  }
}
```

---

### B. WebSocket Protocol (Real-Time Communication)

* **Connection URL:** `wss://stream.pandahive.io/ws?session_id={sessionId}&token={token}`

#### Event Payloads (Client $\rightarrow$ Server)
1. **Send Chat Message:**
```json
{
  "event": "chat:send",
  "payload": {
    "content": "Hello world! Great stream!"
  }
}
```
2. **Toggle Stream Control (Streamer Only):**
```json
{
  "event": "stream:control",
  "payload": {
    "action": "PAUSE"
  }
}
```

#### Event Payloads (Server $\rightarrow$ Client)
1. **Receive Chat Message:**
```json
{
  "event": "chat:broadcast",
  "payload": {
    "messageId": "msg-uuid-123",
    "senderId": "user-uuid-456",
    "username": "CodeNinja",
    "content": "Hello world! Great stream!",
    "timestamp": "2026-03-30T12:06:10Z"
  }
}
```
2. **Stream Telemetry Broadcast (Every 2s):**
```json
{
  "event": "stream:metrics",
  "payload": {
    "currentViewers": 1420,
    "bitrate": 4500,
    "fps": 60,
    "droppedFrames": 2
  }
}
```

---

## 4. Data Validation Rules & Integrity

Using validation schemas (e.g., Zod / Joi) to guarantee absolute data hygiene across API boundaries.

```typescript
import { z } from 'zod';

// Stream Creation Validation Rule
export const CreateStreamSchema = z.object({
  title: z.string()
    .min(3, { message: "Stream title must be at least 3 characters long." })
    .max(150, { message: "Stream title cannot exceed 150 characters." }),
  category: z.string()
    .min(2, { message: "Category is required." })
    .max(50),
  description: z.string()
    .max(1000, { message: "Description cannot exceed 1000 characters." })
    .optional()
});

// Chat Message Validation Rule
export const ChatMessageSchema = z.object({
  content: z.string()
    .min(1, { message: "Message cannot be empty." })
    .max(500, { message: "Message cannot exceed 500 characters." }),
  sessionId: z.string().uuid({ message: "Invalid session UUID format." })
});

// Stream Status Update Validation Rule
export const UpdateStatusSchema = z.object({
  status: z.enum(['PREPARING', 'LIVE', 'PAUSED', 'ENDED'], {
    message: "Invalid stream state transition."
  })
});
```

### Integrity & Safety Constraints:
1. **Orphan Prevention:** Cascade deletes on foreign keys (`ON DELETE CASCADE`) ensure that deleting a user or stream cleanly purges associated metrics and chat messages.
2. **Concurrency Safety:** Stream keys (`rtmp_stream_key`) are indexed with unique constraints to prevent double-allocation during high-concurrency stream creation bursts.
3. **Rate Limiting Protection:** Chat message ingestion enforces a Redis-backed token bucket rule (`max 5 messages per user per 10 seconds`) to mitigate chat spam during high-viewer surges.