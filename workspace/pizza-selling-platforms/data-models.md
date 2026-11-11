# 🍕 PizzaCraft Platform — Data Architecture & API Specification
**Author:** Nami, Data Architect  
**Project:** Pizza Selling Platform ("PizzaCraft")  
**Standards:** Open Agent Skills Specification (Database Schema Modeling & API/Interface Design)

---

## 1. Entity Relational Design & Database Schema

The PizzaCraft platform utilizes a relational data model (designed for PostgreSQL / Supabase / Prisma ORM) with robust foreign key constraints, cascading behaviors, and precise timestamp tracking.

### Entity Relationship Diagram (Overview)
* **`User`** (1) ──< (`Order`)
* **`Restaurant`** (1) ──< (`MenuCategory`) ──< (`MenuItem`) ──< (`MenuItemCustomization`)
* **`Order`** (1) ──< (`OrderItem`) ──< (`OrderItemCustomization`)
* **`Order`** (1) ─── (`Delivery`)
* **`Restaurant`** (1) ──< (`Review`)
* **`User`** (1) ──< (`Review`)

---

### Table Schemas

#### 1. `users` Table
Stores customer, delivery driver, and restaurant admin profiles.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique user identifier |
| `email` | `VARCHAR(255)` | **Unique**, `NOT NULL`, Valid Email | User email for login & notifications |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Customer / staff full name |
| `phone` | `VARCHAR(20)` | `NOT NULL`, E.164 regex | Contact phone number |
| `role` | `ENUM` | `NOT NULL`, Default: `'customer'` | `customer`, `delivery_partner`, `restaurant_admin`, `platform_admin` |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Last update timestamp |

---

#### 2. `restaurants` Table
Stores pizzeria branches or cloud kitchens.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique restaurant identifier |
| `name` | `VARCHAR(150)` | `NOT NULL` | Pizzeria brand/branch name |
| `slug` | `VARCHAR(150)` | **Unique**, `NOT NULL` | URL-friendly identifier |
| `description` | `TEXT` | Optional | Short bio / specialty |
| `address` | `JSONB` | `NOT NULL` | Street, city, zip, lat/lng coordinates |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Kitchen contact number |
| `image_url` | `VARCHAR(500)` | `NOT NULL` | Storefront banner image |
| `rating` | `DECIMAL(3,2)` | `NOT NULL`, Default: `5.00` | Average review rating (1.00 - 5.00) |
| `is_open` | `BOOLEAN` | `NOT NULL`, Default: `true` | Operational status |
| `prep_time_minutes`| `INTEGER` | `NOT NULL`, Default: `25` | Estimated preparation time |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Last update timestamp |

---

#### 3. `menu_categories` Table
Categorizes menu items (e.g., "Artisan Pizzas", "Stuffed Crust", "Sides", "Beverages", "Desserts").
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique category identifier |
| `restaurant_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`restaurants.id`, `ON DELETE CASCADE`) | Parent restaurant |
| `name` | `VARCHAR(100)` | `NOT NULL` | Category name |
| `display_order` | `INTEGER` | `NOT NULL`, Default: `0` | UI sort order |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Record creation timestamp |

---

#### 4. `menu_items` Table
Individual pizzas, drinks, or sides available for order.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique item identifier |
| `category_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`menu_categories.id`, `ON DELETE CASCADE`) | Parent category |
| `name` | `VARCHAR(150)` | `NOT NULL` | Item title (e.g., "Truffle Mushroom Artisan Pizza") |
| `description` | `TEXT` | `NOT NULL` | Ingredients and flavor profile |
| `base_price` | `DECIMAL(10,2)` | `NOT NULL`, `>= 0` | Base price for standard size |
| `image_url` | `VARCHAR(500)` | `NOT NULL` | High-res food photography |
| `is_vegetarian` | `BOOLEAN` | `NOT NULL`, Default: `false` | Veg dietary flag |
| `is_spicy` | `BOOLEAN` | `NOT NULL`, Default: `false` | Spice level indicator |
| `is_available` | `BOOLEAN` | `NOT NULL`, Default: `true` | In-stock status |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Last update timestamp |

---

#### 5. `menu_item_options` Table (Pizza Customizations / Sizes / Toppings)
Defines customization groups per menu item (e.g., Size Selection, Crust Type, Extra Toppings, Sauce).
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique option group identifier |
| `menu_item_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`menu_items.id`, `ON DELETE CASCADE`) | Target menu item |
| `group_name` | `VARCHAR(100)` | `NOT NULL` | Group title (e.g., "Choose Size", "Crust Style", "Add Toppings") |
| `min_select` | `INTEGER` | `NOT NULL`, Default: `0` | Minimum selections required |
| `max_select` | `INTEGER` | `NOT NULL`, Default: `1` | Maximum selections allowed (1 for radio, >1 for checkboxes) |
| `option_name` | `VARCHAR(100)` | `NOT NULL` | Specific option (e.g., "Large 14\"", "Stuffed Crust", "Extra Mozzarella") |
| `price_delta` | `DECIMAL(10,2)` | `NOT NULL`, Default: `0.00` | Extra cost added to base price |

---

#### 6. `orders` Table
Tracks customer orders, pricing totals, and delivery lifecycle.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique order identifier |
| `user_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`users.id`, `ON DELETE RESTRICT`) | Customer who placed order |
| `restaurant_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`restaurants.id`, `ON DELETE RESTRICT`) | Fulfilling restaurant |
| `status` | `ENUM` | `NOT NULL`, Default: `'received'` | `received`, `preparing`, `baked`, `out_for_delivery`, `delivered`, `cancelled` |
| `subtotal` | `DECIMAL(10,2)` | `NOT NULL`, `>= 0` | Sum of items before tax/delivery |
| `delivery_fee` | `DECIMAL(10,2)` | `NOT NULL`, `>= 0` | Delivery charge |
| `tax` | `DECIMAL(10,2)` | `NOT NULL`, `>= 0` | Applicable sales tax |
| `discount` | `DECIMAL(10,2)` | `NOT NULL`, Default: `0.00` | Promo code discount |
| `total` | `DECIMAL(10,2)` | `NOT NULL`, `>= 0` | Grand total (`subtotal + delivery_fee + tax - discount`) |
| `delivery_address` | `JSONB` | `NOT NULL` | Delivery street address and coordinates |
| `special_instructions`| `TEXT` | Optional | Delivery driver notes (e.g. "Ring doorbell") |
| `payment_status` | `ENUM` | `NOT NULL`, Default: `'pending'` | `pending`, `paid`, `failed`, `refunded` |
| `payment_method` | `VARCHAR(50)` | `NOT NULL` | `stripe`, `apple_pay`, `google_pay`, `cash_on_delivery` |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Order placement time |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL`, Default: `NOW()` | Last status update time |

---

#### 7. `order_items` Table
Line items inside an order.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Unique order item identifier |
| `order_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`orders.id`, `ON DELETE CASCADE`) | Parent order |
| `menu_item_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`menu_items.id`, `ON DELETE RESTRICT`) | Ordered menu item |
| `quantity` | `INTEGER` | `NOT NULL`, `>= 1` | Quantity ordered |
| `unit_price` | `DECIMAL(10,2)` | `NOT NULL`, `>= 0` | Unit price including customizations at time of order |
| `customizations`| `JSONB` | Optional | Snapshot of selected options & price deltas |

---

#### 8. `deliveries` Table
Real-time tracking for out-of-kitchen delivery.
| Column | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` / `UUID` | **Primary Key** | Delivery tracking ID |
| `order_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`orders.id`, `ON DELETE CASCADE`) | Target order |
| `driver_id` | `VARCHAR(36)` / `UUID` | **Foreign Key** (`users.id`, `ON DELETE SET NULL`) | Assigned driver |
| `current_location`| `JSONB` | Optional | Live GPS coordinates `{ lat, lng, timestamp }` |
| `estimated_delivery_time`| `TIMESTAMP WITH TIME ZONE` | `NOT NULL` | ETA |
| `delivered_at` | `TIMESTAMP WITH TIME ZONE` | Optional | Actual completion time |

---

## 2. Validation Rules & Data Integrity

### Validation Constraints (Zod / API Validation Schema)
1. **User Sign-up:**
   - `email`: Must be valid RFC 5322 email string.
   - `password`: Minimum 8 characters, at least 1 uppercase letter, 1 number, and 1 special character.
   - `phone`: E.164 standard regex `^\+[1-9]\d{1,14}$`.
2. **Menu Item Customizations:**
   - Selected options must respect `min_select` and `max_select` defined in `menu_item_options`.
   - `quantity` must be an integer between 1 and 99.
3. **Checkout Calculations:**
   - `total` must equal `subtotal + delivery_fee + tax - discount` within a tolerance of `0.01`.
   - `subtotal` must equal the exact summation of `(item.unit_price * item.quantity)` for all items in cart.

---

## 3. State Management Structure (Client-Side & Store)

The client application (React / Zustand / Redux Toolkit) manages state across four primary slices:

### 1. `authStore`
* `user`: `User | null`
* `token`: `string | null`
* `isAuthenticated`: `boolean`
* `login(credentials)` / `logout()` / `updateProfile(data)`

### 2. `cartStore`
* `items`: Array of `CartItem`
  ```typescript
  interface CartItem {
    cartItemId: string; // Unique UUID for exact custom config
    menuItemId: string;
    name: string;
    basePrice: number;
    imageUrl: string;
    quantity: number;
    selectedOptions: {
      groupId: string;
      groupName: string;
      optionId: string;
      optionName: string;
      priceDelta: number;
    }[];
    itemTotal: number; // (basePrice + sum(priceDelta)) * quantity
  }
  ```
* `restaurantId`: `string | null` (Enforces single-restaurant cart)
* `discountCode`: `string | null`
* `discountPercent`: `number`
* Actions: `addItem(item)`, `removeItem(cartItemId)`, `updateQuantity(cartItemId, qty)`, `clearCart()`

### 3. `orderStore`
* `currentOrder`: `Order | null`
* `activeDelivery`: `Delivery | null`
* `orderHistory`: `Order[]`
* `isLoading`: `boolean`
* Actions: `fetchActiveOrder(orderId)`, `updateOrderStatus(status)`, `cancelOrder(orderId)`

### 4. `uiStore`
* `isCartDrawerOpen`: `boolean`
* `isCheckoutModalOpen`: `boolean`
* `deliveryAddress`: `{ address: string; lat: number; lng: number } | null`
* `toastMessage`: `{ type: 'success'|'error'|'info'; text: string } | null`

---

## 4. RESTful API Contracts & Endpoints

### 1. Authentication
* **`POST /api/v1/auth/signup`**
  - **Request Body:** `{ email, password, full_name, phone, role }`
  - **Response (`201 Created`):** `{ token, user: { id, email, full_name, role } }`
* **`POST /api/v1/auth/login`**
  - **Request Body:** `{ email, password }`
  - **Response (`200 OK`):** `{ token, user }`

### 2. Restaurants & Menu
* **`GET /api/v1/restaurants`**
  - **Query Params:** `lat`, `lng`, `radius_km`
  - **Response (`200 OK`):** `Restaurant[]`
* **`GET /api/v1/restaurants/{id}/menu`**
  - **Response (`200 OK`):** 
    ```json
    {
      "restaurant_id": "uuid",
      "categories": [
        {
          "id": "uuid",
          "name": "Artisan Pizzas",
          "items": [
            {
              "id": "uuid",
              "name": "Truffle Mushroom",
              "description": "Wild mushrooms, truffle oil, mozzarella",
              "base_price": 18.99,
              "image_url": "https://...",
              "options": [
                {
                  "group_id": "uuid",
                  "group_name": "Choose Size",
                  "min_select": 1,
                  "max_select": 1,
                  "choices": [
                    { "id": "opt-1", "name": "Medium 12\"", "price_delta": 0.00 },
                    { "id": "opt-2", "name": "Large 14\"", "price_delta": 4.50 }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
    ```

### 3. Orders & Checkout
* **`POST /api/v1/orders`**
  - **Request Body:**
    ```json
    {
      "restaurant_id": "uuid",
      "items": [
        {
          "menu_item_id": "uuid",
          "quantity": 2,
          "selected_option_ids": ["opt-2"]
        }
      ],
      "delivery_address": {
        "street": "123 Main St",
        "city": "Seattle",
        "zip": "98101",
        "lat": 47.6062,
        "lng": -122.3321
      },
      "payment_method": "stripe",
      "special_instructions": "Leave at front porch"
    }
    ```
  - **Response (`201 Created`):**
    ```json
    {
      "order_id": "uuid",
      "status": "received",
      "subtotal": 46.98,
      "delivery_fee": 3.99,
      "tax": 4.23,
      "discount": 0.00,
      "total": 55.20,
      "client_secret": "pi_123_secret_xyz" // Stripe PaymentIntent
    }
    ```
* **`GET /api/v1/orders/{id}`**
  - **Response (`200 OK`):** Order object with live status and delivery tracker info.

---

## 5. Offline Fallback & Mock Data Specifications

When offline or disconnected from cloud backends, PizzaCraft falls back to fully typed mock data stored in browser `localStorage`.

### Seed Mock Restaurant (`localStorage` key: `pizzacraft_mock_restaurant`)
```json
{
  "id": "rest-101",
  "name": "Slice & Stone Artisan Pizzeria",
  "slug": "slice-and-stone",
  "description": "Wood-fired sourdough pizzas crafted with organic Italian flour and local toppings.",
  "address": { "street": "450 Pizza Way", "city": "Seattle", "zip": "98101", "lat": 47.6062, "lng": -122.3321 },
  "phone": "+12065550199",
  "image_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
  "rating": 4.85,
  "is_open": true,
  "prep_time_minutes": 20
}
```

### Seed Mock Menu Items
1. **Margherita D.O.P.** — `$14.99` (San Marzano tomatoes, fresh fior di latte mozzarella, basil, extra virgin olive oil).
2. **Spicy Diavola** — `$17.50` (Soppressata spicy salami, hot honey drizzle, calabrian chilis, mozzarella).
3. **Truffle Funghi** — `$19.00` (Roasted wild mushrooms, fontina cheese, white truffle cream, thyme).
4. **Garlic Parmesan Wings (6 pcs)** — `$9.99` (Crispy oven-baked wings tossed in garlic herb butter and parmesan).

---
*Architecture designed and verified by Nami, Data Architect.*