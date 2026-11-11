Namaste! Nami here, your Data Architect. 🗺️
An E-commerce platform needs a robust, scalable, and resilient data foundation so that users never lose their cart items, filters behave predictably, and checkout flows run seamlessly. 

Here is the complete **Data Architecture, Entity-Relationship Model, State Management Structure, API Contracts, and Validation Rules** for our E-commerce website with LocalStorage persistence.

---

## 1. Database Entities & Schema (TypeScript Interfaces)

We will define our core entities using TypeScript interfaces, representing our relational data structure (even when stored locally or fetched from a mock API).

### **Entity: Product**
```ts
export interface Product {
  id: string;             // UUID or unique slug
  title: string;
  description: string;
  price: number;          // Stored in base currency units (e.g., USD cents or float)
  compareAtPrice?: number;// Original price if on sale
  category: string;       // Primary category ID/slug
  tags: string[];         // e.g., ["bestseller", "eco-friendly"]
  images: string[];       // Array of image URLs
  stock: number;          // Available inventory count
  rating: number;         // Average rating (0 - 5)
  reviewCount: number;
  attributes: {
    [key: string]: string | string[]; // e.g., { size: ["S", "M", "L"], color: ["Red", "Blue"] }
  };
  createdAt: string;      // ISO 8601
}
```

### **Entity: Category**
```ts
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null; // For hierarchical categories
  image?: string;
}
```

### **Entity: CartItem**
```ts
export interface CartItem {
  id: string;             // Unique cart line item ID (can be product.id + selected attributes hash)
  productId: string;
  product: Product;       // Embedded for instant UI rendering
  quantity: number;
  selectedAttributes?: {
    [key: string]: string; // e.g., { size: "M", color: "Red" }
  };
  addedAt: string;        // ISO 8601
}
```

### **Entity: Order**
```ts
export interface Order {
  id: string;             // e.g., "ORD-2023-1001"
  customer: {
    email: string;
    fullName: string;
    shippingAddress: Address;
  };
  items: CartItem[];
  pricing: {
    subtotal: number;
    shippingFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  paymentMethod: 'card' | 'cod' | 'paypal';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

---

## 2. State Management Structure (Zustand / Redux Store)

We partition our global state into distinct slices: **Catalog State**, **Cart State**, **UI Modal/Filter State**, and **Checkout State**.

```ts
import { Product, CartItem, Order, Category } from './entities';

export interface RootState {
  // --- Catalog & Filter Slice ---
  catalog: {
    products: Product[];
    categories: Category[];
    searchQuery: string;
    selectedCategory: string | null;
    priceRange: [number, number];
    sortBy: 'price-asc' | 'price-desc' | 'rating' | 'newest';
    isLoading: boolean;
    error: string | null;
  };

  // --- UI Modal Slice ---
  ui: {
    isCartOpen: boolean;
    isProductModalOpen: boolean;
    activeProductId: string | null; // For Product Details Modal
  };

  // --- Cart Slice ---
  cart: {
    items: CartItem[];
    promoCode: string | null;
    discountPercentage: number;
  };

  // --- Checkout / Order Slice ---
  checkout: {
    step: 'details' | 'shipping' | 'payment' | 'confirmation';
    shippingAddress: Address | null;
    latestOrder: Order | null;
  };
}
```

---

## 3. API Contracts & Mock Endpoints

Since this is a client-side heavy application with LocalStorage persistence, these contracts define how services will fetch initial data or simulate server interactions.

### **1. GET /api/products**
* **Query Parameters:** `search`, `category`, `minPrice`, `maxPrice`, `sortBy`, `limit`, `page`
* **Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_01",
        "title": "Wireless Noise-Canceling Headphones",
        "price": 299.99,
        "category": "electronics",
        "rating": 4.8,
        "stock": 15,
        "images": ["url1", "url2"]
      }
    ],
    "total": 45,
    "page": 1,
    "totalPages": 5
  }
}
```

### **2. GET /api/categories**
* **Response:**
```json
{
  "success": true,
  "data": [
    { "id": "electronics", "name": "Electronics", "slug": "electronics" },
    { "id": "apparel", "name": "Apparel & Clothing", "slug": "apparel" }
  ]
}
```

### **3. POST /api/checkout/simulate**
* **Request Payload:**
```json
{
  "items": [
    { "productId": "prod_01", "quantity": 2, "selectedAttributes": { "color": "Black" } }
  ],
  "shippingAddress": {
    "street": "123 Data Lane",
    "city": "Tech City",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```
* **Response:**
```json
{
  "success": true,
  "message": "Payment simulation successful",
  "data": {
    "orderId": "ORD-98421",
    "status": "completed",
    "estimatedDelivery": "2023-11-05",
    "totalCharged": 614.98
  }
}
```

---

## 4. Data Validation Rules (Zod Schemas)

To guarantee integrity across user inputs, cart modifications, and checkout payloads, we enforce strict validation rules.

```ts
import { z } from 'zod';

// Cart Item Validation
export const CartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  selectedAttributes: z.record(z.string()).optional(),
});

// Checkout Form Validation
export const CheckoutSchema = z.object({
  email: z.string().email("Invalid email address format"),
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  shippingAddress: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP/Postal code"),
    country: z.string().min(2, "Country is required"),
  }),
  paymentMethod: z.enum(['card', 'cod', 'paypal']),
});
```

---

## 5. LocalStorage Persistence Strategy

To ensure zero friction and high availability for offline/refreshed sessions, we map our state slices directly to browser storage keys using a synchronization middleware/subscriber pattern.

| Storage Key | Associated State Slice | Sync Strategy |
| :--- | :--- | :--- |
| `ecommerce_cart` | `cart.items`, `cart.promoCode` | **Immediate Sync:** Writes to LocalStorage on every `addItem`, `removeItem`, or `updateQuantity`. |
| `ecommerce_filters` | `catalog.selectedCategory`, `catalog.priceRange` | **Session Sync:** Persists user browsing preferences across reloads. |
| `ecommerce_last_order` | `checkout.latestOrder` | **Retention Sync:** Clears only when user starts a new shopping session or explicitly dismisses the receipt. |

### **Hydration Safeguard Rule:**
> ⚠️ **Nami's Architect Note:** Always initialize state with safe defaults (`[]` or `null`) during Server-Side Rendering (SSR) / initial client mount, then hydrate from `localStorage` inside a `useEffect` to prevent hydration mismatch errors!