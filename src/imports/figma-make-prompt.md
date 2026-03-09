Вот готовый промт, который можно вставить в Figma Make.
Он чётко описывает, что нужно изменить в логике и UI на основе твоих скринов.

---

**PROMPT FOR FIGMA MAKE**

Redesign the Tournament Result Detail screen based on the provided layout.

Goal:
Transform this screen from a full tournament leaderboard view into a professional personal performance tracking screen.
This app is a career tracking tool, not an official results database.

Remove the following:

* Full Tournament Leaderboard list of all athletes
* Long ranking table with multiple players
* Any mandatory dependency on full tournament data

Replace with this structure:

1. HEADER

* Tournament Name
* Discipline + Format
* Status (Completed)
* Final Position (if entered, otherwise show “Not Entered”)

2. PERFORMANCE SUMMARY
   Card showing:

* Total Weight
* Big Fish
* Prize (optional)
  If no data entered, show:
  — Not Entered —
  And display a primary CTA button:
  “Add Your Result”

3. TOURNAMENT OVERVIEW (optional data, not required)
   Small summary block:

* Winner Weight (manual input field)
* Average Tournament Weight (optional)
* Total Participants (optional)

If not entered, show:
— No Data Available —

4. YOUR PERFORMANCE ANALYSIS
   Automatically calculated when data exists:

* % of Winner
* Difference from Winner
* Position Percentile (if participants entered)

If winner weight not entered:
Hide comparison metrics and show:
“Add Winner Weight to unlock comparison”

5. NOTES & STRATEGY
   Editable section:

* Pre-Tournament Notes
* Post-Tournament Analysis
  Keep Edit button.

6. EDIT BUTTON
   Primary CTA at bottom:
   “Edit Result Details”

Behavior logic:

* This screen must support empty state without showing NaN.
* Never display NaN kg or NaN%.
* If no results entered, clearly show clean empty states.
* Leaderboard is not required in MVP.
* Focus on personal analytics, not public rankings.

Design style:

* Clean, professional, performance-focused.
* Clear hierarchy.
* Metrics centered and emphasized.
* Comparison metrics visually secondary to personal data.

---

Если нужно, могу дополнительно написать второй промт —
для изменения логики ввода результатов (чтобы это занимало 30–60 секунд и выглядело как профессиональный спортивный трекер).
