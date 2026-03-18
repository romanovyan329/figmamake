You are a senior product designer.

Refactor the "My Vessel" profile into a FLEXIBLE MULTI-SPORT PROFILE.

IMPORTANT:
- User is not only a boat owner
- User can be: fisher, surfer, sailor, jet ski rider, kayaker
- Profile must support MULTIPLE activity types

Keep UI style (dark, soft cards, gradients)

---

## 🧠 CORE STRUCTURE

Replace:
"My Vessel"

With:
"My Profile"

---

## 👤 1. PROFILE HEADER

Top block:

- Avatar
- Name
- Location (optional)
- Sports tags:
  [Fishing] [Sailing] [Surf] [Jet Ski] [Kayak]

CTA:
- "Edit Profile"

---

## 🧩 2. MY EQUIPMENT (REPLACES VESSEL)

Rename block:
"My Equipment"

User can have MULTIPLE items:

Examples:
- Boat (Motor Yacht)
- Jet Ski
- Surfboard
- Kayak
- Fishing gear

---

### EQUIPMENT CARD:

- Name (Sea Spirit / Yamaha FX / Custom Surfboard)
- Type (Boat / Jet Ski / Surfboard)
- Optional specs:
  - Length / Power / Model
  - OR custom fields depending on type

CTA:
- Add Equipment
- Edit
- Delete

---

## 🛠 3. MAINTENANCE → UNIVERSAL CARE LOG

Rename:
"Maintenance Reminders" → "Care & Maintenance"

Make universal:

Examples:
- Oil change (Jet Ski)
- Wax board (Surf)
- Replace fishing line
- Engine service

---

### ITEM STRUCTURE:

- Title
- Equipment reference
- Due date
- Status (Overdue / Upcoming / Done)

CTA:
- Add Reminder

---

## 📒 4. ACTIVITY LOG (NEW)

Replace old "Logbook"

Now:
"Activity Log"

---

### CONTENT:

- Fishing session
- Surf session
- Ride
- Trip

Each entry:
- Type
- Duration
- Distance (optional)
- Notes

---

## 🏆 5. TOURNAMENT PROFILE (NEW BLOCK)

Add block:

"My Competitions"

Content:
- Registered tournaments
- Completed tournaments
- Results (rank)

---

## 📊 6. STATS (NEW)

Dynamic based on sport:

Examples:
- Total sessions
- Total distance
- Best result
- Wins

---

## ⚙️ 7. SETTINGS BUTTON (TOP RIGHT ICON)

Current gear icon →

Open:
- Profile settings
- Sports selection
- Units (km / knots)

---

## 🔁 UX RULES

- Profile adapts based on selected sports
- If user selects only "Surf" → no boat fields
- If user selects "Boat" → show vessel specs

---

## ⚡ MVP PRIORITY

Must have:
- Add sport types
- Add equipment
- Add maintenance logs
- View tournaments

Nice to have:
- Stats
- Multi-equipment filtering

---

OUTPUT:
- Updated profile screen
- New flexible structure
- Clean UX with scalable logic
