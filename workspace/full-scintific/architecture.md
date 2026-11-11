*Hmph!* Hancock has done her job laying out the requirements. A grand vision is useless without a ship that can withstand the roughest seas of the New World. 

As **Shanks**, System Architect of the Straw Hat Dev Crew, I present the blueprint for our **Full Scientific Calculator Engine & UI**. We will build a **Zero-Network Dependency, Local-First, High-Precision Event-Driven Architecture**.

---

# 🏗️ System Architecture & Engineering Blueprint
**Project:** Scientific Calculator Engine & UI  
**Architect:** Shanks (System Architect)  
**Target:** Production-Grade, High-Precision Local-First Application  

---

## 1. System Topology & Layered Architecture

To ensure sub-millisecond calculation speeds and zero precision loss, we decouple the **UI Rendering Layer** completely from the **Mathematical Parsing & Execution Engine**.

```
+-----------------------------------------------------------------------+
|                           PRESENTATION LAYER                          |
|  +-----------------------+  +-------------------+  +---------------+  |
|  | Display Subsystem     |  | Keypad Grid       |  | Theme Switcher|  |
|  | (LaTeX/Math Text)     |  | (Pointer/A11y)    |  | (CSS Var Engine)| |
|  +-----------+-----------+  +---------+---------+  +-------+-------+  |
+--------------|------------------------|--------------------|----------+
               |                        |                    |
               v                        v                    v
+-----------------------------------------------------------------------+
|                    STATE MANAGEMENT & INPUT DRIVER                    |
|  +-----------------------------------------------------------------+  |
|  | Input Handler (Keybindings, Touch, Buffer State Machine)        |  |
|  | Stores: Expression Buffer, History Log, Memory Registers (M+/MR) |  |
|  +-----------------------------------+-----------------------------+  |
+--------------------------------------|--------------------------------+
                                       | Token Stream
                                       v
+-----------------------------------------------------------------------+
|                       CORE MATH ENGINE (ISOLATED)                     |
|  +------------------+     +--------------------+     +-------------+  |
|  | Lexer/Tokenizer  | --> | AST Parser         | --> | Decimal.js  |  |
|  | (Token Stream)   |     | (Pratt / Standard) |     | Evaluator   |  |
|  +------------------+     +--------------------+     +-------------+  |
+--------------------------------------|--------------------------------+
                                       | Output Data / Error Contract
                                       v
+-----------------------------------------------------------------------+
|                       STORAGE & PERSISTENCE LAYER                     |
|  +-----------------------------------------------------------------+  |
|  | LocalStorage / IndexedDB (History, User Prefs, Memory State)    |  |
|  +-----------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## 2. Component Boundaries & Layering

### **Layer 1: Presentation (UI Driver)**
* **Responsibility:** Visual representation, key interaction capture, accessibility (ARIA attributes), theme toggling, and expression rendering.
* **Strict Boundary Rule:** The UI layer **never** evaluates mathematical operations directly using JavaScript’s native `eval()` or basic math operators. It receives data models and state dispatchers only.

### **Layer 2: State Orchestrator & Controller**
* **Responsibility:** Operates as a **Finite State Machine (FSM)** tracking the current expression string, cursor position, evaluation history, and memory buffers (`M+`, `M-`, `MR`, `MC`, `MS`).
* **Input Routing:** Bridges raw keyboard events (e.g., keydown `Enter`, `Shift + 6`) to standardized input tokens (e.g., `OP_POWER`).

### **Layer 3: Scientific Math Engine Engine**
* **Lexer (Tokenizer):** Converts raw string expressions into structured tokens (`NUMBER`, `OPERATOR`, `FUNCTION`, `PAREN_OPEN`, `PAREN_CLOSE`).
* **Parser (AST Generator):** Transforms tokens into an Abstract Syntax Tree using **Pratt Parsing** or an adapted **Shunting-Yard Algorithm** to enforce operator precedence (BODMAS/PEMDAS).
* **Evaluator:** Traverses the AST and executes calculations using arbitrary-precision arithmetic to circumvent IEEE 754 binary floating-point rounding bugs (`0.1 + 0.2 != 0.3`).

### **Layer 4: Persistence Subsystem**
* **Responsibility:** Asynchronous storage management for persistent memory flags, historical calculation logs, and user keybinding/theme preferences.

---

## 3. Tech Stack Recommendations

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **React + Vite** (or Pure Vanilla TS with Lit) | Rapid UI rendering with Vite’s light bundle footprint and instant HMR. |
| **Language** | **TypeScript 5.x** | Guarantees strict type safety across AST nodes, tokens, and error interfaces. |
| **Math Precision Engine** | **Decimal.js** / **BigNumber.js** | Prevents standard JS floating-point issues; provides high precision for scientific functions (trig, logarithmic, factorials). |
| **State Management** | **Zustand** | Minimalist state store with zero boilerplate, perfect for decoupled UI-to-Engine bindings. |
| **Styling** | **Tailwind CSS + CSS Variables** | Simplifies dark/light theme switching and responsive display scaling. |
| **Testing** | **Vitest** (Engine) + **Playwright** (UI/E2E) | Vitest runs sub-millisecond mathematical AST assertions; Playwright validates full keyboard integration. |

---

## 4. Deep-Dive: Math Engine Specification & Pipeline

### **Execution Pipeline Contract**

```
Raw Input String: "sin(45) + 3.2 * 10^2"
      |
      v
[ Lexical Analysis ] ──> Output: [
                             { type: 'FUNC', val: 'sin' },
                             { type: 'LPAREN', val: '(' },
                             { type: 'NUM', val: '45' },
                             { type: 'RPAREN', val: ')' },
                             { type: 'OP', val: '+' },
                             { type: 'NUM', val: '3.2' },
                             { type: 'OP', val: '*' },
                             { type: 'NUM', val: '10' },
                             { type: 'OP', val: '^' },
                             { type: 'NUM', val: '2' }
                           ]
      |
      v
[ AST Parser ]       ──> Output: Binary Tree (Respects Precedence: ^ before *, * before +)
      |
      v
[ Decimal Evaluator] ──> Output: Decimal Instance -> String Representation: "320.70710678"
```

### **Token & Node Interface Definitions (TypeScript)**

```typescript
export type TokenType = 
  | 'NUMBER' 
  | 'OPERATOR' 
  | 'FUNCTION' 
  | 'VARIABLE' 
  | 'LPAREN' 
  | 'RPAREN' 
  | 'CONSTANT';

export interface Token {
  type: TokenType;
  value: string;
  precedence?: number;
  associativity?: 'LEFT' | 'RIGHT';
}

export type ASTNode =
  | { type: 'NumberNode'; value: string }
  | { type: 'ConstantNode'; name: 'PI' | 'E' }
  | { type: 'BinaryOpNode'; operator: string; left: ASTNode; right: ASTNode }
  | { type: 'UnaryOpNode'; operator: string; argument: ASTNode }
  | { type: 'FunctionCallNode'; name: string; args: ASTNode[] };
```

---

## 5. Scalability, Precision & Error Contracts

### **1. Precision Guardrails (Floating Point Strategy)**
To avoid floating-point inaccuracies (`0.1 + 0.2 = 0.30000000000000004`):
* All numeric tokens are converted directly into `Decimal` instances.
* Configured Precision: **64 significant digits** internally.
* Output Display Rounding: Dynamic formatting up to **10 decimal places**, with auto-conversion to Scientific Notation ($1.23 \times 10^{12}$) for numbers exceeding display bounds ($> 10^{10}$ or $< 10^{-7}$).

### **2. Error Taxonomy & Handling Contract**

The Core Engine must emit structured, typed errors rather than throwing unhandled JS runtimes.

```typescript
export enum ErrorType {
  DIVIDE_BY_ZERO = 'DIVIDE_BY_ZERO',
  SYNTAX_ERROR = 'SYNTAX_ERROR',
  DOMAIN_ERROR = 'DOMAIN_ERROR',       // e.g., sqrt(-1) without complex mode
  OVERFLOW = 'OVERFLOW',               // Exceeds max precision boundaries
  UNMATCHED_PARENTHESIS = 'UNMATCHED_PARENTHESIS'
}

export interface EngineResult {
  success: boolean;
  value?: string;
  error?: {
    type: ErrorType;
    message: string;
    position?: number; // Index in string where parsing failed
  };
}
```

### **3. Angular Mode Management (Trigonometry)**
* Dynamic Evaluation Context passed to the Evaluator:
  ```typescript
  export interface EngineConfig {
    angleUnit: 'RAD' | 'DEG' | 'GRAD';
    precision: number;
  }
  ```

---

## 6. Technical Risks & Mitigation Strategies

| Technical Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Nested Infinite Recursive Evaluation** | Stack Overflow / App Crash when parsing deeply nested inputs like `((((...(1)...))))`. | Enforce a maximum recursion depth of **100 levels** in the AST parser with explicit throw conditions. |
| **Keyboard Event Collision** | Operating system shortcut conflicts or double inputs on browser fast-typing. | Implement an **Event Normalizer Middleware** using `e.preventDefault()` on target keybindings (`/`, `*`, `Enter`) with key-debounce handlers. |
| **Large Exponent Rendering Out of Bounds** | Breaking UI display grid layout with huge number strings (e.g., $100!$). | Auto-wrap results in responsive containers; automatically truncate to scientific notation ($9.3326 \times 10^{157}$) with copy-to-clipboard for raw value. |
| **State Memory Corruption** | Storing invalid states in LocalStorage leading to persistent startup crashes. | Validate persistent store schemas with a lightweight Zod/TypeGuard parser upon initialization; default fallback to clean state on error. |

---

## ⚓ Architectural Sign-off

This system architecture ensures absolute mathematical precision, zero memory leaks, sub-millisecond AST processing, and complete isolation between execution logic and presentation rendering.

*Captain Luffy's vision now has a ship ready for construction.* **Crew, proceed with setup!**