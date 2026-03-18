Да — **обязательно нужно добавить смену локации**.
Иначе пользователь привязан к одной точке, а для моряков это критично (они постоянно меняют место).

Лучший UX — **3 способа выбрать локацию**.

---

# Как должна работать смена локации

В строке

**📍 46.48°, 30.72°**

нужно сделать её **кликабельной**.

При нажатии открывается экран **Change Location**.

---

# Экран: Change Location

## 1. Use Current Location

кнопка

Использует GPS.

---

## 2. Enter Coordinates

Поля:

Latitude
Longitude

Пример:

46.4825
30.7233

Кнопка:

Load Weather

---

## 3. Select on Map

Кнопка:

Pick location on map

Открывается карта → пользователь ставит точку.

---

# Дополнительно (очень полезно)

Можно добавить:

Saved Locations

Пример:

Odessa Marina
Batumi Harbor
Istanbul Coast

Это сильно ускоряет использование.

---

# Как это будет выглядеть в твоем интерфейсе

Weather
📍 Odessa Coast

или

📍 46.48°, 30.72°

↓

клик

↓

Change Location

---

# Минимальный MVP

Чтобы не усложнять:

достаточно **2 вариантов**:

Use Current Location

Enter Coordinates

---

# Промт для Figma Make

Можно вставить прямо так:

```id="j5mdyr"
Make the location label on the Weather screen clickable.

When the user taps the coordinates (for example "46.48°, 30.72°"), open a screen called "Change Location".

On this screen provide two options:

Use Current Location
(button)

Enter Coordinates

Fields:
Latitude
Longitude

Button:
Load Weather

After entering coordinates the weather screen updates to show weather for that location.
```

---

# Маленький UX апгрейд (очень рекомендую)

Добавь **иконку компаса рядом с координатами**.

Например:

📍 46.48°, 30.72°   🧭

Это делает интерфейс **намного понятнее**.

---

Если хочешь, я ещё покажу **3 критически важных параметра погоды для моряков**, которых сейчас нет на экране, но **без них приложение будет почти бесполезным для яхтинга**.
