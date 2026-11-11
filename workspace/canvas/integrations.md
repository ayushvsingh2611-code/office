# Brook (Group 1 Mascot) — API & Interface Design & Database Schema Spec: "Create Canvas"

═══════════════════════════════════════════════════════════════════════════
🎯 ACTIVE AGENT SKILL: API-AND-INTERFACE-DESIGN & DATABASE-SCHEMA-MODELING
Role: Brook (Group 1 Mascot & Integrations/Content Specialist)
Project Feature: "Create Canvas"
Zero Development AI Calls Consumed (Visual-Only Floor Mascot & Offline Resilience Standard)
═══════════════════════════════════════════════════════════════════════════

---

## 1. RESTful API Contract: "Create Canvas"

### Endpoint Overview
* **Path:** `/api/v1/canvases`
* **Method:** `POST`
* **Description:** Initializes a new interactive visual canvas workspace for office floor presence, team collaboration, or entertainment widgets.
* **Authentication:** Bearer Token (`Authorization: Bearer <JWT_TOKEN>`)

---

### Request Payload Schema
```json
{
  "title": "Floor 3 Innovation & Brainstorm Wall",
  "templateId": "tmpl-grid-9x",
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "unit": "px"
  },
  "settings": {
    "theme": "cyberpunk-floor",
    "gridSnap": true,
    "allowAnonymousEdits": true,
    "mascotPresence": "Brook",
    "zeroAiCalls": true
  },
  "metadata": {
    "department": "Engineering Group 1",
    "floorTag": "Floor 3 West",
    "tags": ["brainstorm", "visual-mascot", "interactive"]
  }
}
```

#### Field Validation & Constraints
| Field | Type | Required | Constraints |
| :--- | :--- | :--- | :--- |
| `title` | String | Yes | 3 to 100 characters, alphanumeric & spaces |
| `templateId` | String | Yes | Must match a valid registered template UUID or slug (`tmpl-grid-9x`, `tmpl-freeform`, `tmpl-dashboard`) |
| `dimensions.width` | Integer | Yes | Range: `800` to `7680` |
| `dimensions.height` | Integer | Yes | Range: `600` to `4320` |
| `dimensions.unit` | String | Yes | Enum: `["px", "vw", "percentage"]` |
| `settings.theme` | String | No | Default: `"default"`, Enums: `["default", "cyberpunk-floor", "minimal-dark", "neon-vibe"]` |
| `settings.gridSnap` | Boolean | No | Default: `true` |
| `settings.allowAnonymousEdits` | Boolean | No | Default: `true` |
| `settings.mascotPresence` | String | No | Default: `"Brook"`, Enum: `["Brook", "None", "Random"]` |
| `settings.zeroAiCalls` | Boolean | Yes | Must be `true` (Enforces zero external AI API token consumption for office floor entertainment) |
| `metadata.department` | String | Yes | 2 to 50 characters |
| `metadata.floorTag` | String | Yes | Valid office zone identifier |
| `metadata.tags` | Array[String]| No | Maximum 5 tags, max 20 chars each |

---

### Response Schemas

#### 1. Success Response (`201 Created`)
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Canvas workspace successfully created and initialized on Floor 3.",
  "data": {
    "id": "cnv-8f92b1a0-4c3e-4b72-91e8-73b2a2e12e09",
    "title": "Floor 3 Innovation & Brainstorm Wall",
    "slug": "floor-3-innovation-brainstorm-wall",
    "templateId": "tmpl-grid-9x",
    "dimensions": {
      "width": 1920,
      "height": 1080,
      "unit": "px"
    },
    "settings": {
      "theme": "cyberpunk-floor",
      "gridSnap": true,
      "allowAnonymousEdits": true,
      "mascotPresence": "Brook",
      "zeroAiCalls": true
    },
    "metadata": {
      "department": "Engineering Group 1",
      "floorTag": "Floor 3 West",
      "tags": ["brainstorm", "visual-mascot", "interactive"]
    },
    "createdBy": "usr_99a81b72-0012-4f3a-bc81-12890aef4312",
    "createdAt": "2025-02-19T14:30:00.000Z",
    "updatedAt": "2025-02-19T14:30:00.000Z",
    "websocketChannel": "wss://floor-canvas.internal/ws/cnv-8f92b1a0-4c3e-4b72-91e8-73b2a2e12e09"
  }
}
```

#### 2. Client Error Response (`400 Bad Request`)
```json
{
  "status": "error",
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Validation failed for canvas creation payload.",
  "details": [
    {
      "field": "settings.zeroAiCalls",
      "issue": "Field must be set to true to comply with Brook's zero-cost floor entertainment policy."
    },
    {
      "field": "title",
      "issue": "Title must be at least 3 characters long."
    }
  ],
  "timestamp": "2025-02-19T14:30:00.000Z"
}
```

#### 3. Server Error Response (`500 Server Error`)
```json
{
  "status": "error",
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Failed to allocate canvas state in distributed memory cache.",
  "timestamp": "2025-02-19T14:30:00.000Z"
}
```

---

## 2. Realistic Mock Fallbacks & Offline Resilience

When office network connectivity drops or local dev mode runs without backend infrastructure, the client-side application falls back seamlessly using **Local Mock Storage (`localStorage` key: `BROOK_OFFLINE_CANVASES`)**.

### Simulated Latency & Timeout Handling
* **Network Delay:** Simulated async delay of `350ms - 600ms` via `setTimeout` to mimic realistic API roundtrips.
* **Timeout Threshold:** 5000ms. If the live API does not respond within 5s, the client automatically triggers the offline fallback handler, persisting the new canvas directly to `localStorage` with a prefixed ID (`cnv-offline-...`).
* **Visual Indicator:** Brook mascot displays a friendly badge: `"⚡ Offline Mode: Canvas saved locally with Zero AI overhead!"`

---

## 3. Database Schema & Data Modeling

### Entity Relationship Model: `Canvases` & Related Entities

```
+------------------------+       1:N       +------------------------+
|        Users           | <-------------> |        Canvases        |
+------------------------+                 +------------------------+
| id (UUID) [PK]         |                 | id (UUID) [PK]         |
| name                   |                 | title                  |
| email                  |                 | slug                   |
| role                   |                 | templateId             |
+------------------------+                 | dimensions (JSON)      |
                                           | settings (JSON)        |
                                           | metadata (JSON)        |
                                           | createdBy (FK)         |
                                           | createdAt (Timestamp)  |
                                           | updatedAt (Timestamp)  |
                                           +------------------------+
                                                       |
                                                       | 1:N
                                                       v
                                           +------------------------+
                                           |     CanvasElements     |
                                           +------------------------+
                                           | id (UUID) [PK]         |
                                           | canvasId (FK)          |
                                           | type (sticky/widget)   |
                                           | positionX, positionY   |
                                           | content (JSON)         |
                                           +------------------------+
```

### SQL Table Definitions

```sql
CREATE TYPE canvas_unit AS ENUM ('px', 'vw', 'percentage');
CREATE TYPE mascot_presence_type AS ENUM ('Brook', 'None', 'Random');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'FloorStaff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE canvases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    template_id VARCHAR(50) NOT NULL,
    width INT NOT NULL CHECK (width >= 800 AND width <= 7680),
    height INT NOT NULL CHECK (height >= 600 AND height <= 4320),
    unit canvas_unit DEFAULT 'px',
    theme VARCHAR(50) DEFAULT 'cyberpunk-floor',
    grid_snap BOOLEAN DEFAULT TRUE,
    allow_anonymous_edits BOOLEAN DEFAULT TRUE,
    mascot_presence mascot_presence_type DEFAULT 'Brook',
    zero_ai_calls BOOLEAN NOT NULL DEFAULT TRUE,
    department VARCHAR(50) NOT NULL,
    floor_tag VARCHAR(50) NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE canvas_elements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    canvas_id UUID REFERENCES canvases(id) ON DELETE CASCADE,
    element_type VARCHAR(50) NOT NULL, -- e.g. 'sticky_note', 'mascot_widget', 'poll'
    pos_x INT NOT NULL DEFAULT 0,
    pos_y INT NOT NULL DEFAULT 0,
    width INT DEFAULT 200,
    height INT DEFAULT 200,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_canvases_floor_tag ON canvases(floor_tag);
CREATE INDEX idx_canvas_elements_canvas_id ON canvas_elements(canvas_id);
```

---

## 4. Realistic Mock Seed Data

Below is production-grade seed data mirroring realistic office floor activities, designed for instant frontend testing and offline resilience.

### Seed Record 1: Floor 3 Brainstorm Wall
```json
{
  "id": "cnv-8f92b1a0-4c3e-4b72-91e8-73b2a2e12e09",
  "title": "Floor 3 Innovation & Brainstorm Wall",
  "slug": "floor-3-innovation-brainstorm-wall",
  "templateId": "tmpl-grid-9x",
  "dimensions": {
    "width": 1920,
    "height": 1080,
    "unit": "px"
  },
  "settings": {
    "theme": "cyberpunk-floor",
    "gridSnap": true,
    "allowAnonymousEdits": true,
    "mascotPresence": "Brook",
    "zeroAiCalls": true
  },
  "metadata": {
    "department": "Engineering Group 1",
    "floorTag": "Floor 3 West",
    "tags": ["brainstorm", "visual-mascot", "interactive"]
  },
  "createdBy": "usr_99a81b72-0012-4f3a-bc81-12890aef4312",
  "createdAt": "2025-02-19T09:00:00.000Z",
  "updatedAt": "2025-02-19T14:15:00.000Z"
}
```

### Seed Record 2: Group 1 Sprint Retro & Mascot Board
```json
{
  "id": "cnv-3b21c4ef-7712-4a0b-8812-990a1bc23f44",
  "title": "Group 1 Sprint 14 Retro & Chill Zone",
  "slug": "group-1-sprint-14-retro-chill-zone",
  "templateId": "tmpl-retro-columns",
  "dimensions": {
    "width": 2560,
    "height": 1440,
    "unit": "px"
  },
  "settings": {
    "theme": "neon-vibe",
    "gridSnap": false,
    "allowAnonymousEdits": true,
    "mascotPresence": "Brook",
    "zeroAiCalls": true
  },
  "metadata": {
    "department": "Product Development",
    "floorTag": "Floor 3 Central Hub",
    "tags": ["retro", "agile", "brook-mascot"]
  },
  "createdBy": "usr_44b12c90-8812-4e11-9a22-33b190f89012",
  "createdAt": "2025-02-18T10:30:00.000Z",
  "updatedAt": "2025-02-19T11:00:00.000Z"
}
```

### Client-Side LocalStorage Persistence Key
* **Storage Key:** `BROOK_CANVAS_STORE_V1`
* **Initialization Structure:**
```javascript
const initialCanvasStore = {
  version: "1.0.0",
  activeCanvasId: "cnv-8f92b1a0-4c3e-4b72-91e8-73b2a2e12e09",
  canvases: [/* Seed Record 1 & 2 */],
  zeroAiConsumptionVerified: true
};
```