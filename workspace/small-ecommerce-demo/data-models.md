# Architecture Blueprint: Artisan Coffee E-Commerce
**Architect:** Nami (Data Architect)  
**Project:** Artisan Coffee Store (Catalog, Cart Drawer, Checkout, Reviews, Category Filtering)

---

## 1. Database Entities & Relationships

### Entity Relationship Diagram (ERD) Overview
* **User** (1) $\leftrightarrow$ (N) **Review**
* **User** (1) $\leftrightarrow$ (N) **Order**
* **Category** (1) $\leftrightarrow$ (N) **Product**
* **Product** (1) $\leftrightarrow$ (N) **ProductVariant** (e.g., Grind size, Bag size)
* **Product** (1) $\leftrightarrow$ (N) **Review**
* **Cart** (1) $\leftrightarrow$ (1) **User** (or Session)
* **Cart** (1) $\leftrightarrow$ (N) **CartItem** $\leftrightarrow$ (1) **ProductVariant**
* **Order** (1) $\leftrightarrow$ (N) **OrderItem** $\leftrightarrow$ (1) **ProductVariant**

---

### Schema Definitions (PostgreSQL style)

```sql
CREATE TYPE roast_level AS ENUM ('Light', 'Medium', 'Dark', 'Espresso');
CREATE TYPE grind_type AS ENUM ('Whole Bean', 'Espresso', 'Drip', 'French Press', 'Cold Brew');
CREATE TYPE order_status AS ENUM ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled');

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    origin_country VARCHAR(100),
    altitude VARCHAR(50),
    flavor_notes TEXT[], -- Array of strings e.g., ['Chocolate', 'Berry']
    roast roast_level NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    weight_grams INT NOT NULL, -- e.g., 250, 500, 1000
    grind grind_type NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    sku VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_product_review UNIQUE (product_id, user_id)
);

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES carts(id) ON DELETE CASCADE,
    variant_id INT REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    CONSTRAINT unique_cart_variant UNIQUE (cart_id, variant_id)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'Pending',
    shipping_address JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    variant_id INT REFERENCES product_variants(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);
```

---

## 2. State Management Structure (Frontend / Zustand or Redux Style)

```typescript
export interface RootState {
  catalog: CatalogState;
  cart: CartState;
  checkout: CheckoutState;
  reviews: ReviewState;
}

interface CatalogState {
  products: Product[];
  categories: Category[];
  filters: {
    categorySlug: string | null;
    roast: roast_level[];
    priceRange: [number, number];
    searchQuery: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

interface CartState {
  isOpen: boolean; // Controls Cart Drawer visibility
  cartId: string | null;
  items: {
    id: string; // cart_item id
    variantId: string;
    productId: string;
    name: string;
    roast: string;
    weight: number;
    grind: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  subtotal: number;
}

interface CheckoutState {
  isModalOpen: boolean;
  step: 'shipping' | 'payment' | 'confirmation';
  shippingAddress: {
    fullName: string;
    addressLine1: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  paymentIntentId: string | null;
  isProcessing: boolean;
  error: string | null;
}

interface ReviewState {
  items: Review[];
  averageRating: number;
  totalReviews: number;
  isLoading: boolean;
}
```

---

## 3. API Contracts (RESTful Endpoints)

### A. Product Catalog & Filtering
* **`GET /api/products`**
  * *Query Params:* `category`, `roast`, `min_price`, `max_price`, `search`, `page`, `limit`
  * *Response:*
    ```json
    {
      "data": [
        {
          "id": 1,
          "name": "Ethiopian Yirgacheffe",
          "slug": "ethiopian-yirgacheffe",
          "origin_country": "Ethiopia",
          "roast": "Light",
          "flavor_notes": ["Blueberry", "Jasmine"],
          "image_url": "https://cdn.coffee.com/ethiopia.jpg",
          "min_price": 16.00,
          "variants": [
            { "id": 101, "weight_grams": 250, "grind": "Whole Bean", "price": 16.00, "stock_quantity": 40 }
          ]
        }
      ],
      "meta": { "page": 1, "limit": 10, "total": 45 }
    }
    ```

### B. Cart Operations (Cart Drawer)
* **`POST /api/cart/items`**
  * *Payload:* `{ "variant_id": 101, "quantity": 1 }`
  * *Response:* Updated Cart Object.
* **`PATCH /api/cart/items/:id`**
  * *Payload:* `{ "quantity": 3 }`
* **`DELETE /api/cart/items/:id`**

### C. Checkout Processing
* **`POST /api/checkout/session`**
  * *Payload:* `{ "shipping_address": { ... } }`
  * *Response:* `{ "client_secret": "pi_123_secret_abc", "order_id": 42 }`

### D. Customer Reviews
* **`GET /api/products/:product_id/reviews`**
* **`POST /api/products/:product_id/reviews`**
  * *Payload:* `{ "rating": 5, "comment": "Absolute perfection for pour-over!" }`

---

## 4. Data Validation Rules & Integrity

Using validation schemas (e.g., Zod / Joi) for incoming payloads:

### Product Variant & Cart Validation
* **Quantity Constraint:** Cart item quantity must be an integer $\ge 1$ and cannot exceed `product_variants.stock_quantity`.
* **Price Integrity:** Frontend prices are **never** trusted. Backend calculates totals using the `product_variants.price` fetched directly from the database during cart calculation and checkout.

### Review Validation Logic
* **Constraint Check:** A user can only submit **one** review per product (`unique_user_product_review`).
* **Verified Purchase Rule (Business Rule):** A review can only be posted if `users.id` has an `order_status = 'Delivered'` containing that specific `product_id`.
* **Rating Bound:** Integer strictly between `1` and `5`.

### Checkout Validation Schema (Zod Example)
```typescript
import { z } from 'zod';

export const CheckoutSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(2, "Name is required"),
    addressLine1: z.string().min(5, "Valid address is required"),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().regex(/^[0-9A-Z\s-]{3,10}$/, "Invalid postal code"),
    country: z.string().length(2, "Use ISO 2-letter country code")
  }),
  paymentMethodId: z.string().startsWith("pm_", "Invalid payment method token")
});
```