# System Architecture & Data Design: Task-Manager Web Application
**Lead Data Architect:** Nami  
**Module:** Core Data, State, and API Specifications

---

## 1. Database Entities & Data Models

Since this application utilizes **LocalStorage persistence**, we will structure the data as if it were a normalized relational database (SQL/NoSQL hybrid) to ensure clean state management and easy migration to a backend later.

### Entity Relationship Diagram (Conceptual)
```
[User Profile] 1 --- * [Task]
[Task] * --- 1 [Category/Project] (Optional extension, flat for now)
```

### TypeScript Interfaces & Schemas

```typescript
// Enums for strict typing and validation
export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string; // ISO 8601
  preferences: {
    theme: 'light' | 'dark' | 'system';
    sidebarCollapsed: boolean;
  };
}

export interface Task {
  id: string;                // UUID v4
  userId: string;            // Foreign Key -> UserProfile.id
  title: string;             // 3 - 100 characters
  description?: string;      // Max 500 characters
  status: TaskStatus;        
  priority: TaskPriority;    
  dueDate: string;           // ISO 8601 Date string (YYYY-MM-DD)
  tags: string[];            // Max 5 tags
  createdAt: string;         // ISO 8601 Timestamp
  updatedAt: string;         // ISO 8601 Timestamp
}

export interface TaskFilterOptions {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  searchQuery?: string;
  tag?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface TaskStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number; // Percentage (0-100)
}
```

---

## 2. State Management Architecture

We will use a centralized state model (React Context + `useReducer` or Zustand pattern) to handle LocalStorage synchronization seamlessly.

### State Tree Interface
```typescript
export interface AppRootState {
  user: UserProfile;
  tasks: Task[];
  filters: TaskFilterOptions;
  ui: {
    isTaskModalOpen: boolean;
    activeTaskId: string | null; // For editing
    sidebarOpen: boolean;
    activeView: 'dashboard' | 'tasks' | 'analytics' | 'settings';
  };
}
```

### Action Payloads (State Mutations)
```typescript
export type AppAction =
  | { type: 'SET_USER_PREFERENCES'; payload: Partial<UserProfile['preferences']> }
  | { type: 'CREATE_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilterOptions> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_UI_MODAL'; payload: { isOpen: boolean; taskId?: string | null } }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_ACTIVE_VIEW'; payload: AppRootState['ui']['activeView'] }
  | { type: 'HYDRATE_STATE'; payload: AppRootState };
```

---

## 3. API Contracts (LocalStorage Simulation Layer)

Even though we are using LocalStorage, we will abstract data access behind an **Async Repository/API Service layer**. This ensures zero code refactoring is needed when connecting a real REST/GraphQL backend.

### Task API Service Interface

```typescript
export interface ITaskService {
  getTasks(filters?: TaskFilterOptions): Promise<Task[]>;
  getTaskById(id: string): Promise<Task>;
  createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<boolean>;
  getStatistics(): Promise<TaskStatistics>;
}
```

#### Example Implementation (LocalStorage Adapter)
```typescript
const STORAGE_KEYS = {
  TASKS: 'nav_tm_tasks_v1',
  USER: 'nav_tm_user_v1',
};

// Simulated latency wrapper for realism & UX testing
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

export const LocalStorageTaskService: ITaskService = {
  async getTasks(filters) {
    await delay();
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    let tasks: Task[] = raw ? JSON.parse(raw) : [];

    if (!filters) return tasks;

    // Apply Filters
    if (filters.status && filters.status !== 'all') {
      tasks = tasks.filter(t => t.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      tasks = tasks.filter(t => t.priority === filters.priority);
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q));
    }
    if (filters.tag) {
      tasks = tasks.filter(t => t.tags.includes(filters.tag!));
    }

    // Apply Sorting
    if (filters.sortBy) {
      tasks.sort((a, b) => {
        let valA = a[filters.sortBy!];
        let valB = b[filters.sortBy!];
        if (valA < valB) return filters.sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return filters.sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return tasks;
  },

  async createTask(taskData) {
    await delay();
    const tasks = await this.getTasks();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return newTask;
  },

  async updateTask(id, updates) {
    await delay();
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error(`Task with ID ${id} not found.`);

    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return tasks[index];
  },

  async deleteTask(id) {
    await delay();
    let tasks = await this.getTasks();
    const initialLength = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    if (tasks.length === initialLength) return false;
    
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    return true;
  },

  async getStatistics() {
    const tasks = await this.getTasks();
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    
    const today = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter(t => t.dueDate < today && t.status !== 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, inProgress, completed, overdue, completionRate };
  }
};
```

---

## 4. Data Validation Rules & Integrity

To protect state integrity and ensure clean user inputs, we enforce strict validation criteria using Zod or custom validation functions before committing actions to state/storage.

### Validation Rules Matrix

| Field | Rule Type | Constraint / Regex | Error Message |
| :--- | :--- | :--- | :--- |
| **Task.title** | Required, Length | Min 3, Max 100 chars | "Title must be between 3 and 100 characters." |
| **Task.description** | Optional, Length | Max 500 chars | "Description cannot exceed 500 characters." |
| **Task.status** | Enum Match | `pending`, `in-progress`, `completed` | "Invalid task status." |
| **Task.priority**| Enum Match | `low`, `medium`, `high`, `urgent` | "Invalid priority setting." |
| **Task.dueDate** | Date format | ISO 8601 (`YYYY-MM-DD`), not in past for creation optional | "Due date must be a valid future or current date." |
| **Task.tags** | Array constraint| Max 5 tags, alphanumeric only | "Maximum 5 tags allowed. Alphanumeric characters only." |

### Validation Function Example (TypeScript)
```typescript
export interface ValidationError {
  field: string;
  message: string;
}

export function validateTaskPayload(data: Partial<Task>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.title !== undefined) {
    if (!data.title.trim()) {
      errors.push({ field: 'title', message: 'Title is required.' });
    } else if (data.title.length < 3 || data.title.length > 100) {
      errors.push({ field: 'title', message: 'Title must be 3-100 characters long.' });
    }
  }

  if (data.description && data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters.' });
  }

  if (data.status && !['pending', 'in-progress', 'completed'].includes(data.status)) {
    errors.push({ field: 'status', message: 'Invalid status type provided.' });
  }

  if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level.' });
  }

  if (data.tags && data.tags.length > 5) {
    errors.push({ field: 'tags', message: 'Cannot exceed more than 5 tags per task.' });
  }

  return errors;
}
```

---
*Nami's Sign-off: The schema is decoupled, strictly typed, and optimized for local persistence while maintaining relational readiness. Proceed to UI implementation.*