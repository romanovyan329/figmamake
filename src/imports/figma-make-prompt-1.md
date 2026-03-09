Вот готовый, чёткий и профессионально сформулированный промт для Figma Make, чтобы изменить текущую логику приложения с self-input модели на federation-controlled results model.

Ты можешь просто скопировать и вставить его.

---

## PROMPT FOR FIGMA MAKE

Redesign the application logic from a self-reported results model to an official federation-controlled results model.

Goal:
Remove all functionality that allows users to manually enter, edit, or modify tournament results.
Transform the app into an official results viewing and career analytics platform where only federation administrators can publish results externally.

---

### 1. Remove User Result Editing

Completely remove:

* “Edit Result Details” buttons
* “Add Your Result” screens
* Any manual weight/position input forms
* Editable result fields in tournament screens
* Any self-entered performance logic

The user must not be able to create or edit tournament results.

---

### 2. Tournament Result Logic Update

Implement the following states for tournaments:

* Upcoming
* In Progress
* Results Pending
* Results Published

If tournament is finished but results are not uploaded:

Display:
“Results Pending – Official results will be published by the federation.”

Disable any result editing.

---

### 3. Result Detail Screen Redesign

Convert Result Detail screen into read-only official format.

Structure:

1. Header:

* Tournament name
* Status badge (Published / Pending)
* Discipline
* Format

2. Official Leaderboard:

* Position
* Athlete Name
* Country / Team
* Total Weight / Points
* Big Fish

3. Participant Detail Screen:
   When tapping a participant:

* Day-by-day breakdown
* Sector / Peg
* Points per day
* Final total
* Official position

All data is non-editable.

---

### 4. “My Result” Identification

Instead of manual entry:

Add Federation ID linking system.

In Profile:
Add required field:
“Federation License ID”

If ID matches a participant in published results:

* Highlight user row in leaderboard
* Show “You” badge
* Enable “View My Official Result”

If not linked:
Display:
“Link your Federation ID to see your official results.”

---

### 5. Career Analytics Update

All statistics must be calculated only from officially published results.

Remove:

* Any analytics based on user-entered data.

If no official results:
Display clean empty state:
“No official results available yet.”

Charts (Position Dynamics, Avg Position, etc.) must use federation data only.

If no data:
Show placeholder message, not NaN.

---

### 6. Remove All NaN States

Replace any NaN kg or NaN% with:

— No Data —
or
Results Not Available

Never display raw system values.

---

### 7. Admin Controlled Concept (UI Placeholder)

Do not design admin panel inside the app.

Instead, assume:
Results are uploaded externally by federation admins.

Add small label under published results:
“Official Federation Results”

Optional:
Show “Published on [date]”

---

### 8. Overall UX Tone

The app is now:

An official competitive fishing performance platform powered by federation results.

It is not a self-report tracking app.

Design must feel:

* Authoritative
* Professional
* Data-driven
* Read-only for results

---

Если хочешь, я могу дополнительно:

* написать второй промт для добавления Federation ID linking логики
* или описать архитектуру данных (Users, FederationResults, TournamentResults, ParticipantResults)
* или продумать как визуально выделить “официальность” данных в интерфейсе (бейджи, цвета, статус-блоки).
