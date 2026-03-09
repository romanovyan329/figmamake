Отлично. Это как раз тот момент, где приложение может стать по-настоящему профессиональным.

Сейчас карточка — это summary.
При клике должна открываться **Result Detail Screen** — полноценный разбор турнира.

Ниже — как это грамотно построить.

---

# 📲 User Flow

Stats → Results →
Tap on result card →
Open: **Tournament Performance Detail**

---

# 🏆 Экран: Tournament Result Detail

Структура должна быть логичной и аналитической.

---

## 1️⃣ Header (фиксированный блок)

* Tournament Name
* Year
* Discipline
* Format (Individual / Team)
* Final Position (#1)
* Medal / Badge

Справа:

* Prize (€5,000)

---

## 2️⃣ Итоговые показатели (Summary Block)

Карточка с ключевыми метриками:

* Total Weight
* Big Fish
* Points
* Difference from Winner (если не #1)
* Average per Day

Если это командный турнир:

* Team Name
* Team Position

---

## 3️⃣ Day-by-Day Breakdown (очень важно)

Таблица или карточки:

### Day 1

* Weight
* Sector
* Position in sector
* Weather
* Notes

### Day 2

...

### Day 3 (если есть)

Это превращает экран в реальный инструмент анализа.

---

## 4️⃣ Sector & Conditions

* Section (A, B, C)
* Peg number
* Water depth
* Bottom type
* Wind direction (если вводилось)

Это помогает анализировать повторяющиеся паттерны.

---

## 5️⃣ Competition Overview (таблица)

Показать:

Top 5 overall:

* Position
* Name
* Total Weight

Если пользователь не в топ-5:

* Показать строку пользователя отдельно

---

## 6️⃣ My Performance Analysis (если участвовал)

Автоматические расчёты:

* % от победного веса
* Difference from podium
* Best performing day
* Weakest day
* Avg weight vs tournament avg

Это уже уровень спортивной аналитики.

---

## 7️⃣ Notes & Strategy

Показать:

* Введённые заметки
* Что сработало
* Что не сработало

Кнопка:
Edit Notes

---

## 8️⃣ Дополнительные действия

Внизу:

* Compare with another tournament
* Add to Season Summary
* Export Summary (PDF позже)

---

# 🎯 UX-логика

Карточка в истории = краткий результат
Детализация = аналитический центр

Нельзя просто показать больше текста — нужно дать структуру.

---

# 📊 Если турнир был командный

Дополнительный блок:

## Team Breakdown

* Lineup
* Individual contributions (если есть)
* Strongest member
* Team average per angler

---

# 🧠 Что делает это профессиональным

1. Day-by-day breakdown
2. Comparison vs winner
3. Sector details
4. Автоматическая аналитика
5. Видимость командного состава

---

# 💡 Можно сделать 2 режима просмотра

Вверху переключатель:

Overview | Detailed

Overview — кратко
Detailed — с таблицами

---

Если хочешь — могу:

* Спроектировать точную иерархию экрана (что выше, что ниже)
* Описать какие данные обязательны в MVP
* Или предложить, как красиво показать таблицу результатов без перегруза UI
