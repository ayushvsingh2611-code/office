# ♞ Nami's Data Architecture & API Design: Two-Player Chess Game

As **Nami (Data Architect)**, I have designed the complete data structures, state management interfaces, move validation rules, API contracts, and mock seed data for a robust, fully offline-capable two-player web chess game.

---

## 1. Entity & Data Model Specifications

### 1.1 Core Entities & Types (`types/chess.ts`)

```typescript
export type PieceColor = 'white' | 'black';

export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';

export interface Piece {
  id: string;             // e.g. "w_pawn_1", "b_queen"
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;     // Crucial for castling and pawn first-move double step
}

export type Square = {
  row: number;            // 0-7 (Rank 8 down to Rank 1)
  col: number;            // 0-7 (File A to H)
};

export type BoardState = (Piece | null)[][]; // 8x8 matrix

export type GameStatus = 
  | 'idle' 
  | 'active' 
  | 'check' 
  | 'checkmate' 
  | 'stalemate' 
  | 'draw';

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  capturedPiece?: Piece | null;
  promotion?: PieceType;
  isCastling?: 'king-side' | 'queen-side';
  isEnPassant?: boolean;
  timestamp: string;      // ISO-8601
  san?: string;           // Standard Algebraic Notation (e.g. "Nf3", "e4", "O-O")
}

export interface GameSettings {
  timeControlSeconds?: number; // Optional timer per player (e.g., 300s = 5m)
  allowUndo: boolean;
  highlightLegalMoves: boolean;
  soundEnabled: boolean;
}

export interface GameSession {
  gameId: string;         // UUIDv4
  status: GameStatus;
  turn: PieceColor;       // Whose turn it is ('white' | 'black')
  board: BoardState;
  moveHistory: Move[];
  capturedPieces: {
    white: Piece[];       // Pieces captured BY white (black pieces)
    black: Piece[];       // Pieces captured BY black (white pieces)
  };
  timers: {
    whiteSecondsRemaining: number;
    blackSecondsRemaining: number;
  };
  winner?: PieceColor | 'draw' | null;
  createdAt: string;      // ISO-8601
  updatedAt: string;      // ISO-8601
}
```

---

## 2. State Management & Persistence

### 2.1 Zustand Store Interface (`store/useChessStore.ts`)

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameSession, Square, Move, PieceType, PieceColor } from '../types/chess';

interface ChessStore {
  session: GameSession;
  selectedSquare: Square | null;
  legalMoves: Square[];
  
  // Actions
  initializeNewGame: (settings?: { timeControlSeconds?: number }) => void;
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square, promotionPiece?: PieceType) => boolean;
  undoMove: () => void;
  resignGame: (color: PieceColor) => void;
  offerDraw: () => void;
  updateTimers: () => void;
}
```

### 2.2 LocalStorage Persistence Key
* **Storage Key**: `CHESS_GAME_SESSION_V1`
* **Auto-save trigger**: After every successful move or timer tick, state is serialized and persisted to survive page refreshes.

---

## 3. Data Validation & Integrity Rules

### 3.1 Move Validation Rules (`utils/chessRules.ts`)
1. **Turn Enforcement**: The moving piece color must match `session.turn`.
2. **Bounds Check**: Both `from` and `to` coordinates must be within bounds `[0..7, 0..7]`.
3. **Piece-Specific Movement Geometry**:
   - **Pawn**: 1 square forward (or 2 from starting rank `row 6` for white, `row 1` for black); diagonal capture; en passant.
   - **Knight**: L-shape (2+1 or 1+2 squares).
   - **Bishop**: Diagonal unobstructed sliding.
   - **Rook**: Horizontal/Vertical unobstructed sliding.
   - **Queen**: Combination of Rook and Bishop.
   - **King**: 1 square in any direction; Castling if King and Rook haven't moved and path is clear/safe.
4. **King Safety (Check Rule)**: A player cannot make any move that leaves or puts their own King in check.
5. **Pawn Promotion**: When a pawn reaches `row 0` (white) or `row 7` (black), it must promote to `Queen`, `Rook`, `Bishop`, or `Knight`.

---

## 4. API & Interface Contracts

Even though this is a local two-player game (Pass-and-Play or Local WebSocket ready), designing clear REST/WebSocket contracts ensures future expansion for online multiplayer.

### 4.1 REST API Specification (`/api/chess`)

| Endpoint | Method | Request Body / Query | Response Schema | Description |
|---|---|---|---|---|
| `/api/games` | `POST` | `{ timeControl?: number }` | `GameSession` | Initialize a new chess game |
| `/api/games/{id}` | `GET` | — | `GameSession` | Retrieve current game state |
| `/api/games/{id}/moves` | `POST` | `{ from: Square, to: Square, promotion?: PieceType }` | `{ success: boolean, session: GameSession, move: Move }` | Validate and execute a move |
| `/api/games/{id}/undo` | `POST` | — | `{ success: boolean, session: GameSession }` | Undo the last move |

### 4.2 Simulated Latency & Offline Fallback Strategy
- **Client-First Execution**: The client evaluates moves locally instantly for zero UI latency.
- **Mock Fallback**: If connected to a backend, requests timeout after `1200ms` and gracefully fall back to local offline Zustand state with a toast warning (`"Offline mode: moves saved locally"`).

---

## 5. Initial Seed Data (`data/initialBoard.ts`)

Standard starting position setup for an 8x8 chessboard:

```typescript
import { BoardState } from '../types/chess';

export const createInitialBoard = (): BoardState => {
  const board: BoardState = Array(8).fill(null).map(() => Array(8).fill(null));

  // Helper to create piece
  const p = (type: any, color: any, id: string) => ({ type, color, id, hasMoved: false });

  // Black major pieces (Rank 8 -> row 0)
  board[0] = [
    p('rook', 'black', 'b_rook_1'),
    p('knight', 'black', 'b_knight_1'),
    p('bishop', 'black', 'b_bishop_1'),
    p('queen', 'black', 'b_queen'),
    p('king', 'black', 'b_king'),
    p('bishop', 'black', 'b_bishop_2'),
    p('knight', 'black', 'b_knight_2'),
    p('rook', 'black', 'b_rook_2'),
  ];

  // Black pawns (Rank 7 -> row 1)
  board[1] = Array(8).fill(null).map((_, i) => p('pawn', 'black', `b_pawn_${i + 1}`));

  // Empty rows (Ranks 6 to 3 -> rows 2 to 5)
  for (let r = 2; r <= 5; r++) {
    board[r] = Array(8).fill(null);
  }

  // White pawns (Rank 2 -> row 6)
  board[6] = Array(8).fill(null).map((_, i) => p('pawn', 'white', `w_pawn_${i + 1}`));

  // White major pieces (Rank 1 -> row 7)
  board[7] = [
    p('rook', 'white', 'w_rook_1'),
    p('knight', 'white', 'w_knight_1'),
    p('bishop', 'white', 'w_bishop_1'),
    p('queen', 'white', 'w_queen'),
    p('king', 'white', 'w_king'),
    p('bishop', 'white', 'w_bishop_2'),
    p('knight', 'white', 'w_knight_2'),
    p('rook', 'white', 'w_rook_2'),
  ];

  return board;
};
```