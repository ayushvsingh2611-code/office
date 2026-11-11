*(Stretches arms, cracks knuckles, and steps up to the whiteboard with a marker)*

Yosh! Captain Luffy dropped the anchor on Milestone 1, and now it's time for **Milestone 2: Requirements Analysis (R)**! As your resident Business Analyst, Hancock, I’ve crunched the data, analyzed the user journey, and mapped out the blueprints for our Grand Line-worthy Real-Estate Property Portal. 

No sloppy navigation here—every detail is locked in. Let’s dive straight into the specs! ⚓💎

---

# 📋 Milestone 2: Requirements & Business Analysis Deliverables
**Project:** Real-Estate Property Portal  
**Analyst:** Hancock (Requirements & Business Analyst)  

---

## 1. 👥 User Stories
* **US-01 (Property Browsing):** *As a prospective homebuyer, I want to view a paginated list of property cards with key details (image, price, address, bedrooms, bathrooms) so that I can quickly scan available homes.*
* **US-02 (Filtering):** *As a user, I want to filter property listings by price range and number of bedrooms so that I can find homes within my specific budget and spatial needs.*
* **US-03 (Mortgage Calculation):** *As a financial planner, I want to input property price, down payment, interest rate, and loan term into a mortgage calculator so that I can estimate my monthly mortgage payments instantly.*
* **US-04 (Agent Consultation):** *As an interested buyer, I want to click a "Book Consultation" button on a property page and fill out a modal form so that I can schedule a meeting with the listing agent.*

---

## 2. 🎯 Project Scope & Boundaries

### **In-Scope (MVP):**
* **Property Listings Grid/List View:** Responsive UI displaying mock or real property data cards.
* **Filter Engine:** Dual-slider or input fields for Price (Min/Max) and Bedrooms (Dropdown/Buttons).
* **Mortgage Calculator Module:** Interactive UI calculating monthly Principal & Interest (P&I).
* **Agent Consultation Modal:** Pop-up form capturing user details (Name, Email, Phone, Preferred Date/Time) with success confirmation.
* **Basic Navigation:** Header, Footer, and Property Details view.

### **Out-of-Scope (Future Milestones):**
* User authentication (Sign up / Login / Saved favorites).
* Real payment gateway integration for booking deposits.
* Advanced mapping APIs (Google Maps integration—basic static map placeholder for MVP).
* Agent backend dashboard (leads will be logged to console/mock database for MVP).

---

## 3. ⚙️ Functional Requirements (FR)
* **FR-1 (Listings):** The system shall fetch and display a list of properties with at least the following attributes: Image URL, Title, Price, Address, Bedrooms, Bathrooms, and Square Footage.
* **FR-2 (Filtering Logic):** The filter component shall update the property list dynamically (or via an "Apply Filters" CTA) when the user modifies the Price Range or Bedroom count.
* **FR-3 (Mortgage Calculation Logic):** 
  * Formula used: $M = P \frac{r(1+r)^n}{(1+r)^n - 1}$
  * Where $P$ is principal loan amount, $r$ is monthly interest rate (annual rate / 12), and $n$ is number of payments (loan term in years * 12).
* **FR-4 (Modal Behavior):** Clicking "Contact Agent" on any property card shall open a modal overlay, blurring background content, and trapping focus inside the modal until closed.
* **FR-5 (Form Validation):** The consultation form shall validate email format and ensure mandatory fields (Name, Phone, Date) are not empty before submission.

---

## 4. 🚀 Non-Functional Requirements (NFR)
* **NFR-1 (Performance):** The property listings page must load and render within **2.0 seconds** on standard broadband connections.
* **NFR-2 (Responsiveness):** The UI must be fully responsive, scaling seamlessly across mobile devices (320px+), tablets, and desktop viewports.
* **NFR-3 (Accessibility):** All interactive elements (filters, buttons, modal close icon) must support keyboard navigation (Tab, Enter, Escape) and include appropriate `aria-labels` conforming to WCAG 2.1 AA standards.
* **NFR-4 (Reliability):** The mortgage calculator must compute and display results in **less than 100ms** upon input change.

---

## 5. ⚠️ Edge Cases & Boundary Conditions
* **EC-1 (No Results Found):** If filters return zero matching properties, display a clear empty-state UI component with a "Reset Filters" button.
* **EC-2 (Extreme Mortgage Inputs):** 
  * If Down Payment $\ge$ Property Price, the loan amount becomes $0, and the monthly payment must display as `$0/month` without throwing a division-by-zero error.
  * Negative numbers or non-numeric characters entered into the mortgage calculator fields must be blocked or auto-corrected to `0`.
* **EC-3 (Invalid Price Ranges):** If a user sets the *Min Price* higher than the *Max Price*, display an inline validation error: *"Minimum price cannot exceed maximum price."*
* **EC-4 (Modal Interruption):** If a user clicks outside the modal content area (backdrop click) or presses the `Escape` key, the consultation modal shall close (with a confirmation prompt if form fields are partially filled).

---

## 6. ✅ Acceptance Criteria (Gherkin Format)

### **Scenario 1: Filtering by Price and Bedrooms**
```gherkin
Given the user is on the property listings page
When the user sets the Minimum Price to "$200,000" and Maximum Price to "$500,000"
And selects "3" Bedrooms
And clicks the "Apply Filters" button
Then only properties priced between $200k-$500k with exactly 3 bedrooms should be displayed
```

### **Scenario 2: Calculating Mortgage Payments**
```gherkin
Given the user opens the Mortgage Calculator tool
When the user enters a Property Price of "$400,000", Down Payment of "$80,000", Interest Rate of "6%", and Loan Term of "30 years"
Then the calculator should dynamically display the correct estimated monthly payment
```

### **Scenario 3: Booking an Agent Consultation**
```gherkin
Given the user is viewing a specific property listing
When the user clicks the "Contact Agent" button
Then the consultation modal should open
And when the user fills in valid Name, Email, Phone, and Preferred Date, then clicks "Submit Request"
Then a success message should appear and the modal should close after 3 seconds
```

---
*(Dusts hands off)* There you have it, Captain! The requirements are watertight and ready for the design and dev squads to set sail. Shall we move to Milestone 3? ✨