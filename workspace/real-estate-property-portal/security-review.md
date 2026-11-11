Namaste! Jinbe hoon, aapka Security Reviewer. Ek samandar ki tarah, application ke architecture mein bhi chhipe hue khatron (hidden threats) ko bahar nikalna mera kaam hai. 

Aapke **Real Estate Property Portal** (listings, filters, mortgage calculator, agent consultation modal) ka architecture security review kuch is tarah hai:

---

### 🛡️ Severity Summary

| Severity Level | Vulnerability Count | Affected Components |
| :--- | :---: | :--- |
| 🔴 **HIGH** | 2 | Authentication/Authorization, Input Validation (SQLi/XSS) |
| 🟡 **MEDIUM** | 2 | Sensitive Data Exposure, CSRF in Consultation Modal |
| 🔵 **LOW** | 1 | Rate Limiting on Mortgage/Consultation APIs |

---

### 🔍 Detailed Security Review & Findings

#### 1. Authentication & Authorization (High Risk)
*   **The Issue:** Property portals mein aam taur par 3 user roles hote hain: *Buyers, Agents, aur Admins*. Agar Agent ya Admin endpoints par proper Role-Based Access Control (RBAC) nahi hai, toh koi bhi normal user property listings delete kar sakta hai ya agent dashboard access kar sakta hai.
*   **Risk:** Broken Object Level Authorization (BOLA/IDOR). Koi user `/api/agent/consultations/102` mein ID change karke doosre user ki consultation/lead details dekh sakta hai.

#### 2. Input Validation & Filtering (High Risk)
*   **Price and Bedrooms Filter:** 
    *   *The Issue:* Filters ko agar backend par sanitize nahi kiya gaya, toh SQL Injection (SQLi) ka khatra hai. For example: `?price=500000 OR 1=1`.
    *   *The Issue:* NoSQL use kar rahe hain toh NoSQL Injection (`{ "$gt": "" }`).
*   **Agent Consultation Modal:**
    *   *The Issue:* Form inputs (Name, Email, Phone, Message) ko agar properly sanitize nahi kiya gaya, toh Stored Cross-Site Scripting (XSS) ho sakta hai jo agent ke dashboard mein execute karega.

#### 3. Sensitive Data Exposure & Secrets Handling (Medium Risk)
*   **The Issue:** Mortgage calculator ya maps ke liye agar third-party APIs (jaise Google Maps, Financial APIs) use ho rahi hain, toh unki API keys frontend code mein expose ho sakti hain.
*   **Database:** User PII (Personally Identifiable Information - Phone numbers, emails from consultation modals) agar unencrypted store hoti hai, toh DB breach hone par bada nuksan ho sakta hai.

#### 4. CSRF & Rate Limiting (Medium to Low Risk)
*   **Consultation Form:** Bina CSRF tokens ke, attacker malicious sites ke zariye fake consultation leads spam kar sakte hain.
*   **DDoS / Brute Force:** Mortgage calculator ya search APIs par heavy queries daal kar server ko crash kiya ja sakta hai agar rate limiting nahi lagi hai.

---

### ⚓ Recommendations (Jinbe's Advice)

1.  **Strict Input Sanitization & Parameterized Queries:**
    *   Filters (`price`, `bedrooms`) ke liye hamesha strict data types (integers/floats) enforce karein. 
    *   SQL queries ke liye ORM ya Prepared Statements ka hi istemal karein taaki SQLi se bacha ja sake.

2.  **Robust Authorization (RBAC & IDOR Prevention):**
    *   Har API route par verify karein ki kya logged-in user ke paas us resource ko access karne ka haq hai ya nahi. Unpredictable IDs (jaise UUIDs) use karein sequential IDs (`/properties/1`, `/properties/2`) ke bajaye.

3.  **XSS Prevention in Modals:**
    *   Agent consultation modal ke inputs ko backend par escape aur sanitize karein. Frontend par React/Angular jaise frameworks automatically XSS rokte hain, lekin `dangerouslySetInnerHTML` se door rahein.

4.  **Secure Secrets Management:**
    *   Saari API keys aur database credentials ko `.env` mein rakhein aur kabhi bhi client-side (frontend bundle) mein expose na hone dein. Agar frontend ko map ya calc API chahiye, toh ek Backend-For-Frontend (BFF) proxy layer banayein.

5.  **Rate Limiting & Captcha:**
    *   Agent consultation modal aur search/filter APIs par Rate Limiting (jaise `express-rate-limit`) lagayein aur spam bots ko rokne ke liye Google reCAPTCHA ya hCaptcha integrate karein.

Samandar ki tarah gehrayi mein jaakar security ko mazboot rakho! Koi aur sawaal ho toh bejhijhak poocho.