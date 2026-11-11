# Nami's Data Architecture & API Design: Flashcard Study Hub

Namaste! I am **Nami**, your Data Architect. I have structured the complete data architecture, entity relationships, validation rules, state management stores, and RESTful API contracts for the **Flashcard Study Hub**. 

---

## 1. Entity-Relationship & Data Models (TypeScript Interfaces)

Below are the core domain entities required for deck management, study sessions, quiz evaluations, and analytics.

### Core Domain Types (`src/types/flashcard.ts`)

```typescript
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CardDifficultyRating = 'again' | 'hard' | 'good' | 'easy';
export type QuizQuestionType = 'multiple-choice' | 'true-false' | 'fill-in-the-blank';

export interface Flashcard {
  id: string; // UUID v4 or ULID
  deckId: string; // Foreign Key -> Deck.id
  front: string; // Question or prompt (Markdown supported)
  back: string; // Answer or explanation (Markdown supported)
  hint?: string; // Optional hint for study mode
  codeSnippet?: string; // Optional code block
  difficultyRating: CardDifficultyRating; // Last reviewed rating
  reviewCount: number;
  correctCount: number;
  createdAt: string; // ISO-8601 timestamp
  updatedAt: string; // ISO-8601 timestamp
}

export interface Deck {
  id: string; // UUID v4
  title: string; // e.g. "AWS Certified Solutions Architect"
  description: string; // Detailed summary
  category: string; // e.g. "Cloud Computing", "TypeScript", "System Design"
  tags: string[]; // e.g. ["aws", "certifications", "networking"]
  difficulty: DifficultyLevel;
  icon: string; // Emoji or Lucide icon name
  cardCount: number; // Denormalized count for performance
  isPublic: boolean;
  author: string;
  createdAt: string; // ISO-8601 timestamp
  updatedAt: string; // ISO-8601 timestamp
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: string;
  endTime?: string;
  cardsStudied: number;
  correctCount: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface QuizQuestion {
  id: string;
  deckId: string;
  type: QuizQuestionType;
  prompt: string;
  options?: string[]; // For multiple choice
  correctAnswer: string; // Exact match or option index string
  explanation: string;
}

export interface QuizResult {
  id: string;
  deckId: string;
  deckTitle: string;
  score: number; // Percentage 0-100
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTakenSeconds: number;
  completedAt: string; // ISO-8601 timestamp
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface UserStats {
  totalDecksCreated: number;
  totalCardsStudied: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  currentStreakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
}
```

---

## 2. Validation Rules & Integrity Constraints

1. **Deck Validation:**
   - `title`: Required, 3 to 100 characters.
   - `description`: Optional, max 500 characters.
   - `category`: Required, selected from approved enum/list or custom string (max 50 chars).
   - `tags`: Array of strings, max 10 tags per deck, each tag max 30 chars lowercase.

2. **Flashcard Validation:**
   - `front`: Required, non-empty markdown string (max 2000 chars).
   - `back`: Required, non-empty markdown string (max 2000 chars).
   - `hint`: Optional, max 300 chars.
   - `deckId`: Must reference an existing `Deck.id` (Referential Integrity on client storage).

3. **Quiz Evaluation Rules:**
   - Multiple choice questions must provide at least 2 and at most 6 distinct options.
   - Fill-in-the-blank questions perform case-insensitive exact matching (with optional regex trim).

---

## 3. State Management Structure (Zustand Store)

The state manager handles persistent storage via `localStorage` with automatic fallback to rich default seed decks.

### State Interface (`src/store/useFlashcardStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Deck, Flashcard, QuizResult, UserStats, CardDifficultyRating } from '../types/flashcard';

interface FlashcardState {
  decks: Deck[];
  cards: Record<string, Flashcard[]>; // Keyed by deckId
  quizResults: QuizResult[];
  userStats: UserStats;
  
  // Actions - Decks
  addDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'cardCount'>) => string;
  updateDeck: (id: string, updates: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;

  // Actions - Cards
  addCard: (deckId: string, card: Omit<Flashcard, 'id' | 'deckId' | 'createdAt' | 'updatedAt' | 'reviewCount' | 'correctCount' | 'difficultyRating'>) => void;
  updateCard: (cardId: string, updates: Partial<Flashcard>) => void;
  deleteCard: (cardId: string) => void;
  reviewCard: (cardId: string, rating: CardDifficultyRating) => void;

  // Actions - Quiz & Stats
  saveQuizResult: (result: Omit<QuizResult, 'id' | 'completedAt'>) => void;
  resetProgress: () => void;
  importData: (jsonData: string) => boolean;
  exportData: () => string;
}
```

---

## 4. Realistic Mock Seed Data (`src/data/seedData.ts`)

When a user opens the app for the first time, LocalStorage is initialized with pre-built educational decks so the app is instantly engaging.

```typescript
import { Deck, Flashcard } from '../types/flashcard';

export const INITIAL_DECKS: Deck[] = [
  {
    id: 'deck-aws-01',
    title: 'AWS Certified Solutions Architect Associate',
    description: 'Core AWS services, VPC architecture, IAM security policies, and S3 storage tiers.',
    category: 'Cloud Computing',
    tags: ['aws', 'cloud', 'architecture', 'certification'],
    difficulty: 'intermediate',
    icon: '☁️',
    cardCount: 5,
    isPublic: true,
    author: 'Nami Data Architect',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-02-15T10:30:00.000Z',
  },
  {
    id: 'deck-ts-02',
    title: 'Advanced TypeScript & Design Patterns',
    description: 'Generics, conditional types, mapped types, utility types, and architectural patterns.',
    category: 'Programming',
    tags: ['typescript', 'javascript', 'frontend', 'types'],
    difficulty: 'advanced',
    icon: '📘',
    cardCount: 4,
    isPublic: true,
    author: 'Nami Data Architect',
    createdAt: '2025-01-12T09:15:00.000Z',
    updatedAt: '2025-02-18T14:20:00.000Z',
  }
];

export const INITIAL_CARDS: Record<string, Flashcard[]> = {
  'deck-aws-01': [
    {
      id: 'card-aws-1',
      deckId: 'deck-aws-01',
      front: 'What is the primary difference between S3 Standard and S3 Glacier Instant Retrieval?',
      back: '**S3 Standard** is designed for frequently accessed data with 99.999999999% durability and low latency. **S3 Glacier Instant Retrieval** is optimized for archive data accessed once a quarter with millisecond retrieval at a lower storage cost.',
      hint: 'Think about retrieval speed and access frequency.',
      difficultyRating: 'good',
      reviewCount: 3,
      correctCount: 3,
      createdAt: '2025-01-10T08:05:00.000Z',
      updatedAt: '2025-02-01T12:00:00.000Z',
    },
    {
      id: 'card-aws-2',
      deckId: 'deck-aws-01',
      front: 'Explain the purpose of an AWS VPC Security Group vs Network ACL (NACL).',
      back: '- **Security Group**: Operates at the *instance* level, stateful (return traffic is automatically allowed).\n- **Network ACL**: Operates at the *subnet* level, stateless (rules for both inbound and outbound traffic must be explicitly defined).',
      hint: 'Stateful vs Stateless & Instance vs Subnet.',
      difficultyRating: 'easy',
      reviewCount: 5,
      correctCount: 5,
      createdAt: '2025-01-10T08:10:00.000Z',
      updatedAt: '2025-02-03T15:30:00.000Z',
    },
    {
      id: 'card-aws-3',
      deckId: 'deck-aws-01',
      front: 'What are the key components of an AWS Transit Gateway?',
      back: 'An AWS Transit Gateway connects VPCs and on-premises networks through a central hub. Key components include **Attachments** (VPCs/VPNs), **Route Tables**, and **Associations/Propagations**.',
      hint: 'Centralized hub-and-spoke networking.',
      difficultyRating: 'hard',
      reviewCount: 4,
      correctCount: 2,
      createdAt: '2025-01-10T08:15:00.000Z',
      updatedAt: '2025-02-10T09:00:00.000Z',
    },
    {
      id: 'card-aws-4',
      deckId: 'deck-aws-01',
      front: 'What is Amazon DynamoDB Accelerator (DAX)?',
      back: 'DAX is a fully managed, in-memory cache for DynamoDB that delivers up to 10-performance improvement—from milliseconds to microseconds—for read-heavy workloads.',
      hint: 'In-memory caching for NoSQL.',
      difficultyRating: 'good',
      reviewCount: 2,
      correctCount: 2,
      createdAt: '2025-01-10T08:20:00.000Z',
      updatedAt: '2025-02-12T11:00:00.000Z',
    },
    {
      id: 'card-aws-5',
      deckId: 'deck-aws-01',
      front: 'Explain AWS IAM Role vs IAM User.',
      back: '- **IAM User**: Has permanent credentials (password/access keys) associated with a specific person or application.\n- **IAM Role**: Does not have static credentials; it is assumed by trusted entities (users, EC2 instances, or AWS services) for temporary security credentials.',
      hint: 'Permanent identity vs temporary assumed trust.',
      difficultyRating: 'easy',
      reviewCount: 6,
      correctCount: 6,
      createdAt: '2025-01-10T08:25:00.000Z',
      updatedAt: '2025-02-14T16:00:00.000Z',
    }
  ],
  'deck-ts-02': [
    {
      id: 'card-ts-1',
      deckId: 'deck-ts-02',
      front: 'What is a Conditional Type in TypeScript? Give a syntax example.',
      back: 'Conditional types select one of two possible types based on a condition expressed as a type relationship test:\n```typescript\ntype IsString<T> = T extends string ? true : false;\n```',
      hint: 'Uses the `extends` keyword with a ternary operator.',
      difficultyRating: 'hard',
      reviewCount: 3,
      correctCount: 1,
      createdAt: '2025-01-12T09:20:00.000Z',
      updatedAt: '2025-02-05T10:00:00.000Z',
    },
    {
      id: 'card-ts-2',
      deckId: 'deck-ts-02',
      front: 'How does `ReturnType<T>` utility type work under the hood?',
      back: 'It extracts the return type of a function type using an `infer` keyword:\n```typescript\ntype ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;\n```',
      hint: 'Uses `infer` within a conditional type.',
      difficultyRating: 'advanced' as any,
      reviewCount: 2,
      correctCount: 1,
      createdAt: '2025-01-12T09:25:00.000Z',
      updatedAt: '2025-02-08T14:00:00.000Z',
    },
    {
      id: 'card-ts-3',
      deckId: 'deck-ts-02',
      front: 'What is the difference between `unknown` and `any`?',
      back: '- **`any`**: Opts out of type checking entirely, allowing any operations.\n- **`unknown`**: Type-safe counterpart to `any`. You must perform type narrowing (typeof, instanceof, type guards) before operating on an unknown value.',
      hint: 'Strict type safety vs escaping type checker.',
      difficultyRating: 'easy',
      reviewCount: 5,
      correctCount: 5,
      createdAt: '2025-01-12T09:30:00.000Z',
      updatedAt: '2025-02-10T10:00:00.000Z',
    },
    {
      id: 'card-ts-4',
      deckId: 'deck-ts-02',
      front: 'What are Template Literal Types in TypeScript?',
      back: 'Template literal types build upon string literal types, allowing you to expand strings into unions:\n```typescript\ntype Greeting = "Hello" | "Hi";\ntype Target = "World" | "Developer";\ntype AllGreetings = `${Greeting} ${Target}`; // "Hello World" | "Hello Developer" | "Hi World" | "Hi Developer"\n```',
      hint: 'String interpolation at the type level.',
      difficultyRating: 'good',
      reviewCount: 3,
      correctCount: 2,
      createdAt: '2025-01-12T09:35:00.000Z',
      updatedAt: '2025-02-15T11:00:00.000Z',
    }
  ]
};
```

---

## 5. RESTful API Contracts & Service Layer

Even though the app persists data locally in `localStorage`, structuring the service layer as asynchronous API contracts ensures seamless transition to a cloud backend (AWS DynamoDB + API Gateway + Lambda) in the future.

### API Service Specification (`src/services/flashcardService.ts`)

| Endpoint | Method | Query / Body Params | Response Schema | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/decks` | `GET` | `category?`, `search?` | `Deck[]` | Retrieve all study decks with optional filters |
| `/api/decks` | `POST` | `CreateDeckRequest` | `Deck` | Create a new study deck |
| `/api/decks/:id` | `GET` | — | `{ deck: Deck, cards: Flashcard[] }` | Fetch deck details and all associated cards |
| `/api/decks/:id` | `PUT` | `UpdateDeckRequest` | `Deck` | Update deck metadata |
| `/api/decks/:id` | `DELETE` | — | `{ success: boolean }` | Delete deck and cascade delete its cards |
| `/api/decks/:deckId/cards` | `POST` | `CreateCardRequest` | `Flashcard` | Add a new flashcard to a deck |
| `/api/cards/:id` | `PUT` | `UpdateCardRequest` | `Flashcard` | Update card front/back or record review rating |
| `/api/quizzes/evaluate` | `POST` | `{ deckId: string, answers: UserAnswer[] }` | `QuizResult` | Evaluate quiz responses and return score breakdown |

---

## 6. LocalStorage Persistence Strategy

- **Storage Key:** `flashcard_hub_storage_v1`
- **Persistence Middleware:** Configured with Zustand `persist` middleware.
- **Data Export/Import:** JSON string backup/restore feature enabling users to share custom decks effortlessly.

---
*Nami Data Architect sign-off. Schema finalized, validated, and ready for frontend integration.*