# Nami's Architecture Blueprint: Real Estate Property Portal

**Role:** Data Architect  
**Project:** Real Estate Property Portal  
**Scope:** Property Listings, Filter Engine, Mortgage Calculator State, Agent Consultation Modal, Data Validation & API Contracts.

---

## 1. Database Entities & ER Schema

Here is the relational data model designed for scalability, indexing high-frequency search fields, and maintaining strict data integrity.

### Tables & Schemas

#### `users` (Base for Buyers and Agents)
```sql
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) CHECK (role IN ('buyer', 'agent', 'admin')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `agents` (Extension for users with role='agent')
```sql
CREATE TABLE agents (
    agent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    agency_name VARCHAR(150),
    license_number VARCHAR(50) UNIQUE NOT NULL,
    bio TEXT,
    profile_image_url TEXT,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    total_deals INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `properties` (Core Listings Entity)
```sql
CREATE TABLE properties (
    property_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES agents(agent_id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    property_type VARCHAR(50) CHECK (property_type IN ('house', 'apartment', 'condo', 'townhouse', 'land')) NOT NULL,
    listing_status VARCHAR(30) CHECK (listing_status IN ('active', 'pending', 'sold', 'rent')) DEFAULT 'active',
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    bedrooms INT NOT NULL CHECK (bedrooms >= 0),
    bathrooms DECIMAL(3,1) NOT NULL CHECK (bathrooms >= 0),
    square_feet INT NOT NULL CHECK (square_feet > 0),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    year_built INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Fast Filtering (Price & Bedrooms)
CREATE INDEX idx_properties_filter ON properties(price, bedrooms, property_type, listing_status);
CREATE INDEX idx_properties_location ON properties(city, state, zip_code);
```

#### `property_images`
```sql
CREATE TABLE property_images (
    image_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(property_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0
);
```

#### `consultations` (Agent Consultation Modal Submissions)
```sql
CREATE TABLE consultations (
    consultation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(property_id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(agent_id) ON DELETE CASCADE,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_email VARCHAR(255) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    preferred_date TIMESTAMP WITH TIME ZONE NOT NULL,
    message TEXT,
    status VARCHAR(30) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. State Management Structure (Frontend / Client State)

Using a modular state pattern (e.g., Zustand / Redux Toolkit slices) to manage complex client interactions without unnecessary re-renders.

### Global Store Schema

```typescript
interface RootState {
  properties: PropertyState;
  filters: FilterState;
  mortgage: MortgageState;
  consultationModal: ConsultationModalState;
}
```

#### A. Filter State (`filters`)
```typescript
interface FilterState {
  priceRange: [number, number]; // [min, max]
  bedrooms: number | null;      // null means "Any"
  propertyType: string[];       // ['house', 'apartment']
  location: string;             // City or Zip
  sortBy: 'price_asc' | 'price_desc' | 'newest';
  page: number;
  limit: number;
  setPriceRange: (range: [number, number]) => void;
  setBedrooms: (count: number | null) => void;
  resetFilters: () => void;
}
```

#### B. Mortgage Calculator State (`mortgage`)
```typescript
interface MortgageState {
  homePrice: number;
  downPayment: number;       // Absolute value or percentage tracked internally
  loanTermYears: number;     // 15, 20, 30
  interestRate: number;      // Annual percentage (e.g., 6.5)
  propertyTaxAnnual: number;
  homeInsuranceAnnual: number;
  HOAAsMonthly: number;
  
  // Actions
  updateField: <K extends keyof MortgageState>(field: K, value: MortgageState[K]) => void;
  resetCalculator: (defaultPrice: number) => void;
}
```

#### C. Consultation Modal State (`consultationModal`)
```typescript
interface ConsultationModalState {
  isOpen: boolean;
  propertyId: string | null;
  agentId: string | null;
  step: 'form' | 'success' | 'error';
  formData: {
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    preferredDate: string;
    message: string;
  };
  openModal: (propertyId: string, agentId: string) => void;
  closeModal: () => void;
  updateForm: (fields: Partial<ConsultationModalState['formData']>) => void;
  setStep: (step: 'form' | 'success' | 'error') => void;
}
```

---

## 3. API Contracts & Endpoints

RESTful API specification with strict payload and response structures.

### 1. Get Property Listings (With Filters)
* **Endpoint:** `GET /api/v1/properties`
* **Query Parameters:**
  * `min_price` (optional, number)
  * `max_price` (optional, number)
  * `bedrooms` (optional, number)
  * `property_type` (optional, string)
  * `city` (optional, string)
  * `sort` (optional, string: `price_asc`, `price_desc`, `newest`)
  * `page` (default: 1)
  * `limit` (default: 10)

* **Response Body (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "property_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        "title": "Modern Downtown Apartment",
        "price": 450000.00,
        "bedrooms": 2,
        "bathrooms": 2.0,
        "square_feet": 1100,
        "property_type": "apartment",
        "city": "Austin",
        "state": "TX",
        "primary_image": "https://cdn.portal.com/images/prop1_main.jpg",
        "agent": {
          "agent_id": "b1ff... ",
          "name": "Sarah Jenkins",
          "phone": "+1-555-0199"
        }
      }
    ],
    "pagination": {
      "total_records": 42,
      "current_page": 1,
      "total_pages": 5,
      "per_page": 10
    }
  }
}
```

---

### 2. Submit Agent Consultation Request
* **Endpoint:** `POST /api/v1/consultations`
* **Request Headers:** `Content-Type: application/json`
* **Request Body:**
```json
{
  "property_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "agent_id": "b1ffee88-4c0b-4ef8-bb6d-6bb9bd380b22",
  "buyer_name": "John Doe",
  "buyer_email": "john.doe@example.com",
  "buyer_phone": "+1555014433",
  "preferred_date": "2023-11-20T14:30:00Z",
  "message": "I would love to tour this property this coming weekend."
}
```

* **Response Body (`201 Created`):**
```json
{
  "success": true,
  "message": "Consultation request submitted successfully.",
  "data": {
    "consultation_id": "c3ee... ",
    "status": "pending",
    "created_at": "2023-11-15T10:00:00Z"
  }
}
```

---

## 4. Data Validation Rules & Integrity

Enforcing validation at both the API Gateway/DTO layer (using Zod/Joi) and Database constraints.

### A. Property Query Validation (Zod Schema)
```typescript
import { z } from 'zod';

export const PropertyQuerySchema = z.object({
  min_price: z.coerce.number().min(0).optional(),
  max_price: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  property_type: z.enum(['house', 'apartment', 'condo', 'townhouse', 'land']).optional(),
  city: z.string().max(100).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
}).refine(data => {
  if (data.min_price && data.max_price) {
    return data.min_price <= data.max_price;
  }
  return true;
}, {
  message: "min_price cannot be greater than max_price",
  path: ["min_price"],
});
```

### B. Consultation Form Validation (Zod Schema)
```typescript
export const ConsultationSchema = z.object({
  property_id: z.string().uuid({ message: "Invalid Property ID format" }),
  agent_id: z.string().uuid({ message: "Invalid Agent ID format" }),
  buyer_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  buyer_email: z.string().email("Invalid email address format"),
  buyer_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid international phone number format"),
  preferred_date: z.string().datetime().refine(val => new Date(val) > new Date(), {
    message: "Preferred consultation date must be in the future",
  }),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional(),
});
```

### C. Mortgage Calculator Boundary Rules (Business Logic Integrity)
* **Home Price:** $10,000 to $100,000,000
* **Down Payment:** Cannot exceed `Home Price`. (Min: 0%)
* **Interest Rate:** $0.0\%$ to $30.0\%$
* **Loan Term:** Strict discrete set: `[15, 20, 30]` years.

---
*Nami signed off. Data structures are locked, indexed, and validated.*