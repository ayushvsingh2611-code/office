# Technical Specification & Data Architecture: Online Learning Platform

**Role:** Nami (Data Architect)  
**Project:** Online Learning Platform (Frontend-Centric with LocalStorage Persistence)

---

## 1. Database Entities & Data Models (TypeScript Interfaces)

Since this platform persists data entirely in the browser's `LocalStorage`, we define the strict object schemas and relationships as TypeScript interfaces.

### 1.1 Core Entities

```typescript
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type LessonType = 'video' | 'quiz' | 'reading';
export type UserRole = 'student' | 'instructor';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  createdAt: string; // ISO 8601
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  type: LessonType;
  contentUrl: string; // Video URL or reading markdown content
  orderIndex: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  difficulty: DifficultyLevel;
  price: number; // 0 for free courses
  rating: number;
  enrollmentCount: number;
  thumbnailUrl: string;
  lessons: Lesson[];
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  completedLessonIds: string[];
  lastAccessedLessonId: string;
  isCompleted: boolean;
  certificateIssuedAt?: string;
}
```

---

## 2. Entity-Relationship Mapping

```
+--------------------+       1:N       +--------------------+
|       User         |---------------->|     Enrollment     |
+--------------------+                 +--------------------+
                                                 |
                                           N:1   |
                                                 v
+--------------------+       1:N       +--------------------+
|       Course       |---------------->|       Lesson       |
+--------------------+                 +--------------------+
```

* **User (1) $\rightarrow$ Enrollment (N):** A student can enroll in multiple courses.
* **Course (1) $\rightarrow$ Enrollment (N):** A course can have many student enrollments.
* **Course (1) $\rightarrow$ Lesson (N):** A course is composed of an ordered list of lessons.

---

## 3. State Management Structure

We use a normalized state pattern managed via React Context + `useReducer` (or Zustand-ready architecture), synchronized automatically with `LocalStorage`.

### 3.1 Global Application State

```typescript
export interface AppState {
  user: User | null;
  courses: Course[];
  enrollments: Enrollment[];
  ui: {
    searchQuery: string;
    selectedCategory: string;
    selectedDifficulty: DifficultyLevel | 'All';
    activeModalCourseId: string | null; // For Course Details Modal
    activeLessonId: string | null;     // For Lesson Navigation
    theme: 'light' | 'dark';
  };
  syncStatus: {
    lastSaved: string | null;
    isDirty: boolean;
  };
}
```

### 3.2 Action Types (State Reducer)

```typescript
export type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'ENROLL_COURSE'; payload: { courseId: string; userId: string } }
  | { type: 'COMPLETE_LESSON'; payload: { courseId: string; lessonId: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY_FILTER'; payload: string }
  | { type: 'SET_DIFFICULTY_FILTER'; payload: DifficultyLevel | 'All' }
  | { type: 'OPEN_COURSE_MODAL'; payload: string }
  | { type: 'CLOSE_COURSE_MODAL' }
  | { type: 'SET_ACTIVE_LESSON'; payload: string }
  | { type: 'HYDRATE_STATE'; payload: Partial<AppState> };
```

---

## 4. API Contracts & Mock Service Layer

Since there is no remote backend, we implement a **Mock Repository Layer** that simulates asynchronous API calls (`Promise`-based) interacting with `LocalStorage`. This keeps the codebase ready for a real REST/GraphQL backend swap later.

### 4.1 Interface Definitions (`CourseRepository`)

```typescript
export interface ICourseRepository {
  getCourses(filters?: CourseFilters): Promise<Course[]>;
  getCourseById(id: string): Promise<Course | null>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  enrollUser(userId: string, courseId: string): Promise<Enrollment>;
  updateProgress(userId: string, courseId: string, lessonId: string): Promise<Enrollment>;
}

export interface CourseFilters {
  query?: string;
  category?: string;
  difficulty?: DifficultyLevel | 'All';
}
```

---

## 5. Data Validation Rules & Integrity Constraints

To maintain data sanity inside `LocalStorage`, validation rules must execute before state mutations.

### 5.1 Validation Schemas (Zod-style Rules)

```typescript
export const ValidationRules = {
  course: {
    title: (val: string) => val.length >= 3 && val.length <= 100,
    price: (val: number) => val >= 0,
    lessons: (lessons: Lesson[]) => lessons.length > 0,
  },
  enrollment: {
    // Prevent duplicate enrollments
    isUnique: (userId: string, courseId: string, existingEnrollments: Enrollment[]) => {
      return !existingEnrollments.some(e => e.userId === userId && e.courseId === courseId);
    },
  },
  lessonProgress: {
    // Ensure lesson belongs to the course being updated
    isValidLesson: (course: Course, lessonId: string) => {
      return course.lessons.some(l => l.id === lessonId);
    }
  }
};
```

### 5.2 LocalStorage Persistence & Integrity Guards

1. **Storage Keys Namespace:**
   * `OLP_USER_STATE`
   * `OLP_COURSES_STATE`
   * `OLP_ENROLLMENTS_STATE`
2. **Hydration Fallback:** If `LocalStorage` contains corrupted JSON or empty strings, the data layer automatically seeds default mock data (e.g., initial catalog of 5 courses and a default student profile).
3. **Optimistic UI Updates:** State changes instantly update React's runtime memory and trigger a debounced `localStorage.setItem()` write operation.