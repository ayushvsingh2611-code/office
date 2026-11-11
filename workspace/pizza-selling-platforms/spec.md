# 🍕 Straw Hat Slice: Pizza Selling Platform — Business Analysis & Specifications

As **Hancock** (Requirements & UX Research Specialist for the Straw Hat Dev Crew), I have prepared the comprehensive specification for our pizza selling platform: **"Straw Hat Slice"**. 

This document outlines the User Stories, Project Scope, Functional Requirements, Non-Functional Requirements, Edge Cases, and Acceptance Criteria in clean, production-grade Markdown.

---

## 1. User Stories

### Persona 1: Hungry Student (Zoro / College Student)
* **As a** hungry student browsing late at night,
* **I want** to quickly customize a pizza and place an order without creating a mandatory password account (Guest Checkout),
* **So that** I can satisfy my hunger in under 3 clicks and track delivery right to my dorm room.

### Persona 2: Family Planner (Nami / Budget-Conscious Parent)
* **As a** parent planning a family weekend dinner,
* **I want** to browse combo deals, apply discount coupon codes, save favorite custom pizzas to my profile, and schedule an order for a specific future delivery time,
* **So that** I can feed my family affordably and ensure dinner arrives exactly when guests arrive.

### Persona 3: Kitchen Staff / Store Manager (Sanji / Head Chef)
* **As a** kitchen staff member managing incoming orders,
* **I want** a real-time kitchen display screen (KDS) that updates instantly when a customer pays and moves orders through preparation stages (*Received $\rightarrow$ Baking $\rightarrow$ Out for Delivery $\rightarrow$ Delivered*),
* **So that** orders are prepared accurately and dispatch is streamlined without missing tickets.

---

## 2. Project Scope & Boundaries

### In-Scope (Prototype & MVP Deliverables)
* **User Authentication & Profiles**: Email/Password registration, JWT-based login, role-based access control (Customer, Delivery Driver, Kitchen Staff, Admin).
* **Interactive Pizza Builder**: Step-by-step custom pizza creation (Crust type/size, Sauce selection, Cheese level, Toppings with price calculation).
* **Menu & Catalog**: Pre-configured specialty pizzas, sides, beverages, and combo deals with filtering and search.
* **Shopping Cart & Checkout**: LocalStorage-backed cart state, discount coupon code engine, Stripe payment gateway integration (Credit/Debit card + simulated test cards).
* **Real-Time Order Tracking**: WebSocket-powered live kitchen display board and customer tracking page with status updates.
* **Admin & Kitchen Dashboard**: Order management, menu item CRUD, and stock/inventory toggles.

### Out-of-Scope (Future Production Milestones)
* Native mobile iOS/Android applications (deferred to Phase 2; web app is fully responsive).
* Multi-store franchise geographic routing and store locator algorithms (single flagship store inventory for MVP).
* Third-party aggregator API integrations (DoorDash/UberEats dispatch APIs).
* Advanced biometric authentication (FaceID/TouchID).

---

## 3. Functional Requirements

* **FR-01: User Management**: The system must allow users to register with email/password, log in securely via JWT, and manage delivery addresses. Guest checkout must also be supported.
* **FR-02: Interactive Pizza Builder**: The system must provide a visual or step-by-step customizer enabling users to select crust (Thin, Stuffed, Pan), sauce (Marinara, BBQ, White Garlic), cheese quantity, and meat/veggie toppings, dynamically calculating the total price based on size and toppings count.
* **FR-03: Cart & Coupon Engine**: The system must maintain cart state across sessions, allow quantity adjustments, item removals, and apply percentage or fixed-amount discount coupon codes with validation rules (expiration date, min order value).
* **FR-04: Secure Checkout & Payment**: The system must integrate with Stripe Checkout to process payments securely and handle webhook events (`payment_intent.succeeded`, `payment_intent.payment_failed`) to update order statuses.
* **FR-05: Real-Time Order Tracking & KDS**: The system must broadcast order status changes in real-time via WebSockets to both the Kitchen Display Screen (KDS) and the customer's live tracking view.
* **FR-06: Role-Based Dashboard**: The system must provide protected dashboards for Admins (menu management, analytics), Kitchen Staff (order pipeline), and Customers (order history).

---

## 4. Non-Functional Requirements

* **NFR-01: Performance**: The frontend application must achieve a Lighthouse Performance score $\ge$ 90, with First Contentful Paint (FCP) under 1.5 seconds.
* **NFR-02: Scalability**: The backend API must handle up to 500 concurrent users during peak dinner hours with an API response time under 250ms for menu catalog queries.
* **NFR-03: Security**: All data in transit must be encrypted via TLS 1.3. Passwords must be hashed using bcrypt (cost factor $\ge$ 12). API endpoints must enforce strict input sanitization, CSRF protection, and JWT authorization headers.
* **NFR-04: Reliability & Availability**: The platform must target 99.9% uptime during operational hours, with graceful error recovery and robust fallback states for payment gateway or WebSocket disconnections.
* **NFR-05: Responsiveness**: The UI must be fully responsive and optimized for mobile phones (320px width upwards), tablets, and desktop displays.

---

## 5. Edge Cases & Boundary Conditions

1. **Empty Cart State**: When a user accesses the checkout page with an empty cart, the system must display an empty state banner with a "Return to Menu" call-to-action button.
2. **Rapid Multi-Clicks**: The "Place Order" and "Add to Cart" buttons must implement debounce/throttling and loading spinner states to prevent duplicate order submissions or double charges.
3. **Inventory Out-of-Stock**: If a topping or pizza becomes unavailable mid-order (e.g. pepperoni runs out in the kitchen), the system must alert the user before final payment and prompt them to modify their selection.
4. **Invalid Coupon Codes**: Entering expired, invalid, or minimum-threshold-unmet coupon codes must trigger inline validation error messages without breaking the checkout flow.
5. **Network Interruption / WebSocket Reconnection**: If WebSocket connection drops during order tracking, the UI must gracefully fall back to polling every 10 seconds and display a non-intrusive reconnection banner.
6. **Long Text Overflow**: Customer delivery notes and custom pizza names exceeding character limits must wrap cleanly or truncate with ellipsis without breaking card or table layouts.

---

## 6. Acceptance Criteria

### User Story A: Custom Pizza Builder
* **Given** a user is on the Pizza Builder page (`/builder`),
* **When** they select "Stuffed Crust", "BBQ Sauce", "Extra Cheese", and add "Pepperoni" and "Mushrooms",
* **Then** the dynamic summary updates instantly, the total price reflects the selected size and topping additions, and clicking "Add to Cart" successfully adds the custom pizza to the cart with all selected modifiers intact.

### User Story B: Secure Stripe Checkout & Webhook
* **Given** a user has items in their cart and proceeds to checkout,
* **When** they enter valid delivery details and complete Stripe payment testing credentials,
* **Then** the payment is authorized, an order record is created in the database with status `Paid`, a success confirmation screen with an order ID is displayed, and the Kitchen Display Screen receives the order instantly via WebSocket.

### User Story C: Coupon Code Application
* **Given** a user is reviewing their cart with a subtotal of $35.00,
* **When** they enter a valid coupon code `LUFFY10` (10% off orders over $20),
* **Then** the discount is applied ($3.50 deducted), the new total is correctly recalculated ($31.50), and a success badge is shown. If an invalid code `ZORO00` is entered, an error message "Invalid coupon code" appears and the total remains unchanged.