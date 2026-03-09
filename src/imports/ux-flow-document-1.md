Отлично. Ниже — чёткая, профессиональная структура UX-флоу:
**Онбординг → Создание профиля → Команда → Регистрация → Управление турниром.**
Без лишних шагов, всё логично и понятно.

---

# 1️⃣ Онбординг (3–4 экрана максимум)

Цель — объяснить ценность и сразу завести пользователя в создание профиля.

---

### Экран 1 — Value

**Track European Fishing Tournaments**
Discover competitions and plan your season.

CTA: Continue

---

### Экран 2 — Career

**Build Your Season**
Add tournaments and track your results.

CTA: Continue

---

### Экран 3 — Analytics

**Analyze Your Performance**
Monitor progress, rankings and statistics.

CTA: Get Started

---

# 2️⃣ Создание профиля (обязательно перед использованием)

Без профиля нельзя зарегистрироваться на турнир.

## Экран: Create Profile

### Обязательные поля:

* Full Name
* Country
* Primary Discipline (Feeder / Match / Carp / etc.)
* Competition Type:

  * Individual
  * Team
* Years of Experience (optional)
* Photo (optional, но желательно)

Кнопка:
Create Profile

После этого пользователь попадает на Home.

---

# 3️⃣ Профиль — структура

## Верхний блок:

* Фото
* Имя
* Страна
* Основная дисциплина
* Тип (Individual / Team)

## Статистика:

* Seasons
* Tournaments
* Podiums
* Best Result
* Biggest Catch

## Блоки:

* My Team
* My Seasons
* Edit Profile

---

# 4️⃣ Команда — создание и управление

Если в профиле выбран Team или пользователь хочет добавить команду.

---

## Создание команды

Экран: Create Team

Поля:

* Team Name
* Country
* Main Discipline
* Logo (optional)

Кнопка: Create Team

---

## Добавление участников

Внутри Team Screen:

Кнопка: Add Member

Поля:

* Name
* Role (Captain / Angler / Reserve)
* Experience (optional)
* Notes (optional)

Важно:
Это просто локальные записи. Нет аккаунтов, нет приглашений.

---

## Редактирование команды

Внутри Team Screen:

* Edit Team Info
* Edit Member
* Remove Member
* Change Captain

---

# 5️⃣ Регистрация на турнир — полный флоу

---

## Шаг 1 — Открыть Tournament Details

Пользователь нажимает Register.

Если профиль не заполнен → перенаправление на Create Profile.

---

## Шаг 2 — Registration Screen

Поля:

Participation Type:

* Individual
* Team (если есть созданная команда)

Если Team → выпадающий список команд.

Дополнительно:

* Season (если несколько)
* Notes
* Goals (optional)

Кнопка: Confirm Participation

---

## После подтверждения:

* Турнир добавляется в My Season
* Кнопка Register меняется на:

  * Manage Entry
  * View My Entry

---

# 6️⃣ Управление участием (после регистрации)

Экран: My Tournament Entry

Блоки:

### 1. Общая информация

* Название
* Дата
* Статус

### 2. Performance Tracking

Поля для ввода:

* Day 1 Weight
* Day 2 Weight
* Big Fish
* Final Position
* Notes
* Weather

Кнопка: Save Results

---

# 7️⃣ После завершения турнира

Статус меняется на Completed.

Данные автоматически попадают в:

* Season Stats
* Profile Stats
* Waterbody Stats

---

# 8️⃣ Логика статусов

Open → можно зарегистрироваться
Added → добавлен в сезон
Completed → завершён
Closed → только просмотр

---

# 9️⃣ Empty States (очень важно)

Если:

* Нет команды → “Create Your First Team”
* Нет сезона → “Start Your First Season”
* Нет турниров → “Add Your First Tournament”

---

# 🔟 Что делает UX профессиональным

1. Никакой перегрузки на старте
2. Профиль создаётся один раз
3. Регистрация занимает 2 шага
4. Всё связано с сезоном
5. Команда — инструмент, не соцсеть

---

Если хочешь, дальше можем:

* Сделать минимальный MVP-флоу
* Продумать edge-cases (если человек меняет дисциплину, если удаляет турнир)
* Прописать модель данных
* Или спроектировать улучшенный экран профиля (он сейчас самый важный центр карьеры)
