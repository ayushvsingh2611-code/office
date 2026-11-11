# Nami's Architectural Blueprint: "Create Canvas" System

As **Nami (System & Data Architect - Group 1)**, I have analyzed Task A requirements for **"Create Canvas"**. This document establishes the complete data schemas, database entities, state management structures, exact DOM element IDs, API/interface contracts, validation rules, and concrete implementation blueprint for **Zoro (Builder)**.

---

## Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [Exact DOM IDs & Component Contract](#2-exact-dom-ids--component-contract)
3. [Database & Storage Schema Models](#3-database--storage-schema-models)
4. [State Management Structure](#4-state-management-structure)
5. [API & Service Contracts (RESTful / Local Async Service)](#5-api--service-contracts-restful--local-async-service)
6. [Validation & Integrity Rules](#6-validation--integrity-rules)
7. [Realistic Mock Seed Data & LocalStorage Keys](#7-realistic-mock-seed-data--localstorage-keys)
8. [Blueprint for Zoro (Builder)](#8-blueprint-for-zoro-builder)

---

## 1. System Overview & Architecture

The **"Create Canvas"** module is an interactive workspace where users can create, configure, style, and manage visual digital canvases (such as dashboard layouts, design boards, flowchart spaces, or art boards). 

- **Frontend Architecture**: Vanilla JavaScript (ES6+ modular modules), Tailwind CSS for styling, HTML5 Canvas / SVG / DOM-based interactive grid.
- **Persistence Layer**: Browser `localStorage` with offline-first design, supporting asynchronous JSON export/import and RESTful sync capability.
- **State Management**: Reactive centralized store with immutable state transitions and event emission.

---

## 2. Exact DOM IDs & Component Contract

Zoro must implement the following DOM element IDs exactly as specified to ensure seamless interaction between event handlers, state updates, and rendering engines.

### Layout & Container IDs
- `canvas-app-root`: Main application wrapper.
- `canvas-header`: Top navigation and global action bar.
- `canvas-sidebar`: Left toolbar for tools, element shapes, and palette items.
- `canvas-properties-panel`: Right inspector/properties panel for selected elements or canvas settings.
- `canvas-viewport`: The main interactive workspace container where the canvas DOM/SVG is mounted.
- `canvas-stage`: The actual interactive drawing/layout surface.

### Control & Action Button IDs
- `btn-new-canvas`: Triggers modal/drawer to create a new canvas.
- `btn-save-canvas`: Triggers persistence of the current canvas.
- `btn-export-canvas`: Triggers export dialog (JSON / PNG / SVG).
- `btn-import-canvas`: Triggers file picker for JSON canvas import.
- `btn-undo`: Undo last action.
- `btn-redo`: Redo last undone action.
- `btn-zoom-in`: Increase viewport zoom level.
- `btn-zoom-out`: Decrease viewport zoom level.
- `btn-reset-view`: Reset zoom and pan to default.
- `btn-clear-canvas`: Clear all elements from the active canvas with confirmation.

### Form & Modal Input IDs (Create / Configure Canvas Modal)
- `modal-canvas-config`: Modal dialog container for creating/editing canvas metadata.
- `input-canvas-title`: Text input for canvas title (Required).
- `input-canvas-desc`: Textarea for canvas description.
- `select-canvas-preset`: Dropdown for dimension presets (`A4`, `1080p`, `Square 1080`, `Custom`).
- `input-canvas-width`: Numeric input for canvas width in pixels (Min: 100, Max: 8192).
- `input-canvas-height`: Numeric input for canvas height in pixels (Min: 100, Max: 8192).
- `input-canvas-bg`: Color picker for canvas background color (Default: `#ffffff`).
- `select-grid-type`: Dropdown for grid snapping (`none`, `dots`, `lines`, `grid`).
- `btn-submit-canvas`: Confirm and create canvas.
- `btn-cancel-modal`: Cancel and close modal.

### Status & Notification IDs
- `status-bar`: Bottom bar displaying cursor coordinates, zoom percentage, element count, and sync status.
- `toast-container`: Floating container for toast notifications.

---

## 3. Database & Storage Schema Models

### Entity 1: `Canvas` (Core Canvas Document)
Represents a single canvas workspace.

```typescript
interface CanvasEntity {
  id: string;                      // UUID v4 or slug (e.g. "canvas_9a8f7e6d5c")
  title: string;                   // 1 to 100 characters
  description?: string;            // Max 500 characters
  dimensions: {
    width: number;                 // e.g. 1920 (px)
    height: number;                // e.g. 1080 (px)
  };
  background: string;              // Hex color or CSS background value (e.g., "#ffffff")
  grid: {
    enabled: boolean;
    type: 'dots' | 'lines' | 'grid';
    size: number;                  // e.g., 20 (px)
    snap: boolean;
  };
  version: number;                 // Schema versioning (default: 1)
  createdAt: string;               // ISO-8601 timestamp
  updatedAt: string;               // ISO-8601 timestamp
}
```

### Entity 2: `CanvasElement` (Items placed inside a Canvas)
Represents shapes, text, images, or widgets rendered on the canvas stage.

```typescript
interface CanvasElementEntity {
  id: string;                      // UUID v4
  canvasId: string;                // Foreign key to CanvasEntity.id
  type: 'shape' | 'text' | 'image' | 'card' | 'line';
  name: string;                    // Human-readable layer name
  transform: {
    x: number;                     // X coordinate relative to canvas origin
    y: number;                     // Y coordinate relative to canvas origin
    width: number;
    height: number;
    rotation: number;              // Degrees (0 - 360)
    zIndex: number;                // Layer stacking order
  };
  style: {
    fill?: string;                 // Background color / gradient
    stroke?: string;               // Border color
    strokeWidth?: number;          // Border thickness in px
    opacity: number;               // 0.0 to 1.0
    borderRadius?: number;         // Corner radius in px
    shadow?: string;               // CSS box-shadow string
  };
  content?: {
    text?: string;                 // For text elements
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right';
    src?: string;                  // For image elements
    alt?: string;
  };
  locked: boolean;                 // Prevent accidental selection/movement
  hidden: boolean;                 // Visibility toggle
  createdAt: string;               // ISO-8601 timestamp
  updatedAt: string;               // ISO-8601 timestamp
}
```

### Entity 3: `CanvasHistory` (Undo/Redo Snapshot)
```typescript
interface CanvasHistoryEntry {
  id: string;
  canvasId: string;
  action: string;                  // e.g., "ELEMENT_ADDED", "ELEMENT_MOVED", "CANVAS_RESIZED"
  snapshot: {
    canvas: CanvasEntity;
    elements: CanvasElementEntity[];
  };
  timestamp: string;
}
```

---

## 4. State Management Structure

Zoro should implement a reactive store adhering to this exact state shape:

```typescript
interface AppState {
  currentCanvas: CanvasEntity | null;
  elements: CanvasElementEntity[];
  selectedElementIds: string[];    // Supports multi-selection
  viewport: {
    zoom: number;                  // e.g., 1.0 (100%), range 0.2 to 5.0
    panX: number;
    panY: number;
  };
  history: {
    past: CanvasHistoryEntry[];
    future: CanvasHistoryEntry[];
    maxStack: number;              // Default: 50
  };
  ui: {
    activeTool: 'select' | 'hand' | 'shape' | 'text' | 'image';
    activeModal: 'none' | 'create-canvas' | 'export' | 'import' | 'settings';
    isDirty: boolean;              // Unsaved changes flag
    loading: boolean;
    error: string | null;
  };
}
```

---

## 5. API & Service Contracts (RESTful / Local Async Service)

Even when running fully client-side with `localStorage`, the service layer must mirror RESTful HTTP contracts so it can connect to a cloud backend seamlessly in the future.

### 1. `GET /api/canvases`
- **Description**: Retrieve list of all saved canvases metadata.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "canvas_demo_01",
        "title": "Q3 Marketing Strategy Board",
        "dimensions": { "width": 1920, "height": 1080 },
        "updatedAt": "2025-02-20T10:30:00.000Z"
      }
    ]
  }
  ```

### 2. `POST /api/canvases`
- **Description**: Create a new canvas.
- **Request Body**:
  ```json
  {
    "title": "New Dashboard Layout",
    "description": "Analytics overview canvas",
    "dimensions": { "width": 1440, "height": 900 },
    "background": "#f8fafc",
    "grid": { "enabled": true, "type": "dots", "size": 24, "snap": true }
  }
  ```
- **Response `201 Created`**: Returns the full `CanvasEntity` object with generated `id`, `createdAt`, and `updatedAt`.

### 3. `GET /api/canvases/:id`
- **Description**: Retrieve a specific canvas and all its child elements.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "canvas": { /* CanvasEntity */ },
      "elements": [ /* Array of CanvasElementEntity */ ]
    }
  }
  ```
- **Response `404 Not Found`**:
  ```json
  { "success": false, "error": "Canvas not found with id: canvas_999" }
  ```

### 4. `PUT /api/canvases/:id`
- **Description**: Update canvas settings or bulk update elements.

### 5. `DELETE /api/canvases/:id`
- **Description**: Delete canvas and its elements.

---

## 6. Validation & Integrity Rules

1. **Canvas Title**:
   - Required, string type.
   - Length: 1 to 100 characters.
   - Sanitization: Trim whitespace, strip HTML tags.
2. **Canvas Dimensions**:
   - `width` and `height` must be integers between `100` and `8192` pixels.
3. **Element Transforms**:
   - `width` >= 10, `height` >= 10.
   - `rotation`: normalized between `0` and `360`.
   - `zIndex`: integer >= 0.
4. **Color Codes**:
   - Must match HEX (`#RGB`, `#RRGGBB`), RGB, or RGBA regex pattern: `/^(#([A-Fa-f0-9]{3}){1,2}|rgb\(\d+,\s*\d+,\s*\d+\)|rgba\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\))$/`.

---

## 7. Realistic Mock Seed Data & LocalStorage Keys

### LocalStorage Key Schema
- `NAMI_CANVAS_STORE_V1`: Stores metadata index of all saved canvases.
- `NAMI_CANVAS_DOC_<id>`: Stores the individual canvas entity and its elements array.

### Realistic Seed Record (JSON)

```json
{
  "canvas": {
    "id": "canvas_seed_alpha",
    "title": "E-Commerce Mobile App Wireframe",
    "description": "Initial UI wireframe for checkout flow and product catalog.",
    "dimensions": {
      "width": 390,
      "height": 844
    },
    "background": "#f3f4f6",
    "grid": {
      "enabled": true,
      "type": "dots",
      "size": 16,
      "snap": true
    },
    "version": 1,
    "createdAt": "2025-02-20T08:00:00.000Z",
    "updatedAt": "2025-02-20T09:15:00.000Z"
  },
  "elements": [
    {
      "id": "elem_header_bar",
      "canvasId": "canvas_seed_alpha",
      "type": "shape",
      "name": "Header Navbar",
      "transform": {
        "x": 0,
        "y": 0,
        "width": 390,
        "height": 60,
        "rotation": 0,
        "zIndex": 1
      },
      "style": {
        "fill": "#ffffff",
        "stroke": "#e5e7eb",
        "strokeWidth": 1,
        "opacity": 1,
        "borderRadius": 0
      },
      "locked": true,
      "hidden": false,
      "createdAt": "2025-02-20T08:05:00.000Z",
      "updatedAt": "2025-02-20T08:05:00.000Z"
    },
    {
      "id": "elem_title_text",
      "canvasId": "canvas_seed_alpha",
      "type": "text",
      "name": "Screen Title",
      "transform": {
        "x": 24,
        "y": 18,
        "width": 200,
        "height": 24,
        "rotation": 0,
        "zIndex": 2
      },
      "style": {
        "opacity": 1
      },
      "content": {
        "text": "Checkout Summary",
        "fontSize": 18,
        "fontFamily": "Inter, sans-serif",
        "fontWeight": "bold",
        "textAlign": "left"
      },
      "locked": false,
      "hidden": false,
      "createdAt": "2025-02-20T08:10:00.000Z",
      "updatedAt": "2025-02-20T08:10:00.000Z"
    },
    {
      "id": "elem_cta_button",
      "canvasId": "canvas_seed_alpha",
      "type": "shape",
      "name": "Checkout CTA",
      "transform": {
        "x": 24,
        "y": 750,
        "width": 342,
        "height": 52,
        "rotation": 0,
        "zIndex": 3
      },
      "style": {
        "fill": "#2563eb",
        "stroke": "#1d4ed8",
        "strokeWidth": 1,
        "opacity": 1,
        "borderRadius": 12,
        "shadow": "0 4px 6px -1px rgba(37, 99, 235, 0.3)"
      },
      "locked": false,
      "hidden": false,
      "createdAt": "2025-02-20T08:15:00.000Z",
      "updatedAt": "2025-02-20T08:15:00.000Z"
    }
  ]
}
```

---

## 8. Blueprint for Zoro (Builder)

Zoro, execute the implementation following these precise engineering mandates:

1. **DOM Hooking**: Ensure every element ID listed in Section 2 is correctly bound in your HTML markup so state controllers and event listeners can attach without `null` reference exceptions.
2. **State Store Pattern**: Create a clean `CanvasStore` class implementing observer/subscribe pattern or reactive getters/setters that manages `AppState`.
3. **Local Storage Persistence Service**: Implement an asynchronous `StorageService` that reads/writes JSON payloads to `localStorage` with error handling (`QuotaExceededError` fallback).
4. **Interactive Stage & Zoom/Pan**: Ensure mouse wheel zoom and drag-to-pan handlers update transform matrixes correctly on `#canvas-stage`.
5. **Validation Guard**: Validate canvas creation inputs against Section 6 rules before committing state changes.