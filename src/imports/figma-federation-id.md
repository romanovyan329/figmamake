Вот чёткий, профессионально сформулированный промт для Figma Make, чтобы реализовать **Вариант 2 — полноценная логика Federation License ID с состояниями и верификацией**.

Можешь просто скопировать и вставить.

---

## PROMPT FOR FIGMA MAKE

Redesign the Profile screen to properly support Federation License ID functionality with clear states and verification logic.

Goal:
Implement a structured Federation ID system instead of displaying it as static text. The license must have defined states and clear UX behavior.

---

### 1. Remove Static License Text

Remove the plain text line:

“License: POL-FED-2015-A042”

Do not display raw ID directly in the main profile header.

---

### 2. Add Federation ID Section in Settings

Create a new screen:

Profile → Settings → Federation License

Structure:

* Title: Federation License ID
* Description:
  “Link your official federation license to access verified tournament results.”

Add:

* Input field:
  Placeholder: Enter your official federation license ID
* Primary button: Submit

---

### 3. Add Federation ID Status States

Implement 3 visual states:

#### State 1 — Not Linked

Display:

* “No Federation ID linked”
* Button: Add License ID

No statistics based on official results should appear.

---

#### State 2 — Pending Verification

Display:

* “License submitted”
* Status badge: Pending Verification (yellow)
* Info text: “Verification in progress”

Statistics remain hidden until verified.

---

#### State 3 — Verified

Display:

* Status badge: Verified Athlete (green with check icon)
* Small text: Official results linked

Only after verification:

* Career statistics become visible
* User row in tournament leaderboard is highlighted
* “You” badge appears next to their name

---

### 4. Profile Screen Update

In main Profile header:

Do not show raw license ID.

Instead show:

If Verified:
✔ Verified Athlete (badge)

If Not Linked:
Small info banner:
“Link your Federation ID to access official results”

If Pending:
Badge: Verification Pending

---

### 5. Results Behavior Logic

User cannot edit results.

All statistics must be calculated only from verified federation data.

If no license linked:
Show clean empty state:
“No official results available.”

Never display NaN values.

---

### 6. Design Style

* Clean, professional
* Minimal technical exposure
* Status-based UX
* Federation data clearly marked as official

---

### 7. Do Not Implement Admin Panel

Assume verification happens externally.
Only reflect status visually.

---

If needed, I can also write:

* Prompt for leaderboard highlighting logic
* Prompt for conditional rendering of statistics
* Or a simplified MVP version without verification workflow.
