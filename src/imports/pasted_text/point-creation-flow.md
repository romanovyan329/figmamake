Когда пользователь нажимает **Add Point** и выбирает тип (Marina / Anchorage / Fuel / Danger / Custom), лучше сделать **очень быстрый и простой flow**, потому что на воде люди не хотят заполнять длинные формы.

Оптимальный UX — **2 шага**:

1. выбрать точку на карте
2. заполнить краткую информацию

---

# Flow создания точки

### Шаг 1 — выбрать точку на карте

После выбора типа:

```
Tap on map to place point
```

На карте появляется маркер.

Открывается **bottom sheet**.

---

# Форма создания точки

## Основная информация

Name
(например: "South Bay Marina")

Type
(уже выбран, но можно изменить)

Coordinates
(автоматически из карты)

---

## Дополнительная информация

Description / Notes

Пример:

```
Good anchorage in calm weather
Depth ~6m
```

---

## Специфичные поля по типу точки

### Marina

• docking available
• water
• electricity
• repair
• phone number

---

### Anchorage

• depth
• bottom type
(sand / mud / rocks)

• protection from wind

---

### Fuel station

• fuel type (diesel / petrol)
• opening hours

---

### Danger zone

• type of danger

например:

```
rocks
shallow water
reef
strong current
```

---

# Дополнительные опции

### Photos

Можно добавить фото точки.

---

### Tags

Например:

```
good fishing
safe anchorage
night stop
```

---

# Кнопки

Bottom:

```
Cancel
Save Point
```

---

# После сохранения

Маркер появляется на карте.

При нажатии открывается карточка:

```
Point name
Type
Distance
Coordinates
Notes
Edit
Navigate
```

---

# Очень полезная функция

Добавить:

```
Distance from my boat
```

например:

```
3.4 NM away
```

---

# Важное UX правило

Создание точки должно занимать **5–7 секунд максимум**.

Поэтому обязательные поля только:

```
Name
Type
Coordinates
```

Все остальное — **optional**.

---

# Как выглядит карточка точки на карте

При тапе на маркер:

```
South Bay Marina
Marina

Distance: 2.4 NM

Docking
Fuel
Water

Navigate
Edit
```

---

# Что можно добавить позже (очень крутая фича)

**Weather at point**

```
Wind 14 kt
Waves 0.9 m
```

Это делает карту **очень полезной**.

---

Если хочешь, я могу ещё показать:

• **как должен выглядеть идеальный экран точки (очень красивый UX)**
• **какие типы точек реально используются в морских приложениях**
• **3 функции карты, которые делают приложение реально крутым для яхтсменов**.
