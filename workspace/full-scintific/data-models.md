Hii! Main **Nami**, aapki **Data Architect**. 

Scientific Calculator simple dikhta hai, lekin backend aur frontend par iska **state data, expression parsing, edge-case mathematical validation, aur local/cloud storage schema** bilkul solid hona chahiye. 

Mera goal hai ye ensure karna ki calculate karte waqt:
1. State predictable aur crash-free rahe.
2. Expressions safely parse aur evaluate hon (Preventing `eval()` exploits).
3. Precision loss (like `0.1 + 0.2 = 0.30000000000000004`) handling centralized rule-engine ke through ho.

Here is the complete **Data Architecture Specification** for the Scientific Calculator.

---

# 📐 Scientific Calculator - Data Architecture Blueprint

## 1. Application State Management Structure (Client-Side)

Hum ek **Redux / Zustand-style Centralized State** define kar rahe hain jo complex scientific operations (DEG/RAD, Inverse, Hyperbolic, Memory registers) ko handle karega.

### TypeScript State Model

```typescript
export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';
export type NotationType = 'STANDARD' | 'SCIENTIFIC' | 'ENGINEERING';

export interface MemoryRegister {
  value: string; // Store as string to retain exact decimal precision
  updatedAt: number;
}

export interface HistoryItem {
  id: string; // UUID v4
  expression: string;
  formattedExpression: string; // e.g. "sin(45 deg) + 4^2"
  result: string;
  angleUnit: AngleUnit;
  timestamp: number;
}

export interface CalculatorState {
  // Current Display States
  inputBuffer: string;       // Raw user input (e.g., "sin(30)+sqrt(16)")
  displayOutput: string;     // Formatted display (e.g., "0.5 + 4")
  currentResult: string | null; // Latest calculated result
  
  // Modes & Toggles
  angleUnit: AngleUnit;      // Default: DEG
  isInverse: boolean;        // Inv mode for sin -> asin, etc.
  isHyperbolic: boolean;     // Hyp mode for sin -> sinh, etc.
  notation: NotationType;    // Standard / Scientific
  
  // Registers & Storage
  memory: MemoryRegister;    // MS, MR, M+, M-
  history: HistoryItem[];
  
  // Validation & Error Handling
  error: string | null;      // Error string e.g., "Domain Error", "Division by Zero"
  isEvaluated: boolean;      // Flag to track if '=' was pressed
}
```

---

## 2. Database Entities & Schemas (Persistence Layer)

Agar calculator cloud sync, user profiles, aur custom history/constants support karta hai, toh PostgreSQL DDL Schema structure neeche diya gaya hai:

### 2.1 Entity Relationship Diagram (Conceptual)
* **Users** `1 : N` **Calculation_History**
* **Users** `1 : 1` **User_Calculator_Settings**
* **Users** `1 : N` **Custom_Constants**

### 2.2 PostgreSQL DDL

```sql
-- Enums for Type Safety
CREATE TYPE angle_unit_enum AS ENUM ('DEG', 'RAD', 'GRAD');
CREATE TYPE notation_enum AS ENUM ('STANDARD', 'SCIENTIFIC', 'ENGINEERING');

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. User Calculator Settings
CREATE TABLE user_calculator_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    angle_unit angle_unit_enum DEFAULT 'DEG',
    notation notation_enum DEFAULT 'STANDARD',
    decimal_precision INT DEFAULT 10 CHECK (decimal_precision BETWEEN 0 AND 32),
    theme VARCHAR(50) DEFAULT 'dark',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Calculation History Table
CREATE TABLE calculation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    raw_expression TEXT NOT NULL,
    evaluated_result TEXT NOT NULL,
    angle_unit_used angle_unit_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast retrieval of recent calculations
CREATE INDEX idx_calc_history_user_time ON calculation_history(user_id, created_at DESC);

-- 4. Custom User Variables / Constants (e.g., x = 4.234)
CREATE TABLE custom_constants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    var_symbol VARCHAR(10) NOT NULL,
    var_value NUMERIC NOT NULL,
    description VARCHAR(100),
    UNIQUE(user_id, var_symbol)
);
```

---

## 3. API Interfaces & Contracts (RESTful API)

High-precision calculation fallback, expression parsing validation, ya history sync ke liye API contracts:

### 3.1 Endpoint: Evaluate Expression (Server-Side High Precision Engine)
* **URL:** `/api/v1/calculator/evaluate`
* **Method:** `POST`

#### Request Payload:
```json
{
  "expression": "sin(45) + sqrt(144) / log(100)",
  "angleUnit": "DEG",
  "precision": 16,
  "variables": {
    "x": "12.5"
  }
}
```

#### Response Payload (Success - 200 OK):
```json
{
  "status": "success",
  "data": {
    "expression": "sin(45 deg) + sqrt(144) / log(100)",
    "tokens": ["sin", "(", "45", ")", "+", "sqrt", "(", "144", ")", "/", "log", "(", "100", ")"],
    "result": "6.7071067811865475",
    "scientificNotation": "6.7071067811865475e+0",
    "executionTimeMs": 1.2
  }
}
```

#### Response Payload (Error - 422 Unprocessable Entity):
```json
{
  "status": "error",
  "error": {
    "code": "MATH_DOMAIN_ERROR",
    "message": "Invalid input: log(x) requires x > 0",
    "position": 14
  }
}
```

---

### 3.2 Endpoint: Sync History
* **URL:** `/api/v1/calculator/history`
* **Method:** `GET` | `POST`

#### POST Request Body:
```json
{
  "history": [
    {
      "expression": "ln(e^3)",
      "result": "3",
      "angleUnit": "RAD",
      "timestamp": 1717000000000
    }
  ]
}
```

---

## 4. Data Validation Rules & Math Integrity

Validations ko 3 layers me divide kiya gaya hai to ensure computational safety:

```
[ User Input ] ---> [ Layer 1: Lexical Validation ] 
               ---> [ Layer 2: AST / Syntax Validation ] 
               ---> [ Layer 3: Math Domain Validation ] 
               ---> [ High-Precision Evaluation ]
```

### 4.1 Validation Matrix

| Rule ID | Rule Name | Condition Check | Action / Error Message |
| :--- | :--- | :--- | :--- |
| **VAL-001** | **Parentheses Balance** | Count `(` must equal count `)` | Return `"Unbalanced Parentheses"` |
| **VAL-002** | **Division by Zero** | `/ 0` or expression evaluating to `/ 0` | Return `"Cannot Divide by Zero"` |
| **VAL-003** | **Log Domain** | $\log_{10}(x)$ or $\ln(x)$ where $x \le 0$ | Return `"Domain Error (log x > 0)"` |
| **VAL-004** | **Square Root Real** | $\sqrt{x}$ where $x < 0$ (if Real mode) | Return `"Invalid Real Input (sqrt negative)"` |
| **VAL-005** | **ArcTrig Domain** | $\sin^{-1}(x)$ or $\cos^{-1}(x)$ where $\|x\| > 1$ | Return `"Domain Error (-1 <= x <= 1)"` |
| **VAL-006** | **Factorial Limit** | $x!$ where $x < 0$ or $x \notin \mathbb{Z}$ or $x > 170$ | Return `"Overflow / Integer Factorial Only"` |
| **VAL-007** | **Consecutive Operators** | Reject `++`, `*/`, `^/` etc. | Prevent Input / Regex Match Reject |

### 4.2 Input Sanitization & Security Rule (JS/TS Specific)
* **Strict Anti-Injection Rule:** Direct `eval()` or `Function()` execution **strictly forbidden** hai.
* Custom Lexer/Parser (Abstract Syntax Tree - AST) or standard libraries like `mathjs` / `bignumber.js` consume symbols strictly via Tokenization.

#### JSON Validation Schema (JSON Schema for API Validation):
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CalculatorEvaluationRequest",
  "type": "object",
  "properties": {
    "expression": {
      "type": "string",
      "maxLength": 500,
      "pattern": "^[0-9a-zA-Z\\+\\-\\*/\\^\\(\\)\\.\\,\\s]+$"
    },
    "angleUnit": {
      "type": "string",
      "enum": ["DEG", "RAD", "GRAD"]
    },
    "precision": {
      "type": "integer",
      "minimum": 1,
      "maximum": 32
    }
  },
  "required": ["expression", "angleUnit"]
}
```

---

## 5. End-to-End Data Flow Execution Pipeline

1. **Input Event:** User hits a key (e.g., `sin(`).
2. **State Reducer:** Append string to `inputBuffer`, validate pattern using Lexer.
3. **Execution Phase (`=` pressed):**
   - **Tokenization:** Split input buffer into Tokens `['sin', '(', '90', ')']`.
   - **Unit Conversion:** If `angleUnit === 'DEG'`, convert `sin(90)` to `sin(90 * PI / 180)`.
   - **AST Generation:** Tree construction for operator precedence ($^\wedge > \times, / > +, -$).
   - **Safe Evaluation:** Compute using Floating Point / Arbitrary Precision Engine (`Decimal.js`).
4. **State Commit:** Update `displayOutput` with result, append calculation object to `history[]` array.

---

Ye Data Architecture scalable hai—chahe client-side pure React/Vue base system bane ya backend Microservice calculation engine ke saath merge karna ho! 

Aapko overall Schema aur Validation Flow kaisa laga? Let me know if you want any modifications!