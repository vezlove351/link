# link.wwa — личный link-tree

Next.js (App Router) + Supabase + Tailwind. Публичная страница со ссылками и простая парольная админка.

## Стек

- Next.js 14 (App Router, TypeScript)
- Supabase (Postgres) — хранение кнопок и ссылок
- Tailwind CSS
- Vercel — деплой

## Схема БД

См. [supabase/migrations/0001_init.sql](supabase/migrations/0001_init.sql).

- `buttons(id, title, icon_url, position, created_at)`
- `links(id, button_id -> buttons.id on delete cascade, label, url, position)`

RLS включён: публичное чтение разрешено всем, запись — только через сервисный ключ (server actions в админке).

## Настройка

1. Создайте проект в [Supabase](https://supabase.com).
2. В SQL Editor выполните содержимое `supabase/migrations/0001_init.sql`.
3. Скопируйте `.env.local.example` в `.env.local` и заполните:

   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ADMIN_PASSWORD=...
   ```

   `SUPABASE_SERVICE_ROLE_KEY` и `ADMIN_PASSWORD` — секреты, не должны попадать в клиентский код (используются только в server actions / middleware).

4. Установите зависимости и запустите:

   ```
   npm install
   npm run dev
   ```

5. Публичная страница: `http://localhost:3000/`
   Админка: `http://localhost:3000/admin` (запросит пароль, ставит httpOnly cookie на 30 дней)

## Деплой на Vercel

1. Импортируйте репозиторий в Vercel.
2. В Project Settings → Environment Variables добавьте те же 4 переменные, что и в `.env.local`.
3. Deploy.

## Структура

```
app/
  page.tsx                 — публичная страница
  admin/
    page.tsx                — список кнопок/ссылок (админка)
    login/page.tsx           — форма пароля
    actions.ts                — server actions (CRUD)
    AdminButtonCard.tsx        — карточка кнопки + её ссылки
    NewButtonForm.tsx           — форма создания кнопки
  api/admin/login/route.ts  — проверка пароля, установка cookie
  api/admin/logout/route.ts — сброс cookie
components/
  LinkButton.tsx            — кнопка на публичной странице (ссылка напрямую или аккордеон)
lib/
  supabase.ts               — публичный и админский Supabase-клиенты
  auth.ts                   — проверка пароля/токена (Node crypto, для route handlers)
  types.ts                  — типы Button/Link/Database
middleware.ts               — защита /admin по cookie (Web Crypto, Edge runtime)
supabase/migrations/0001_init.sql
```

## Как это работает

- Если у кнопки ровно одна ссылка — рендерится как `<a>`, ведущая прямо на URL.
- Если ссылок несколько — кнопка раскрывает список label'ов под собой (аккордеон), клик по label ведёт по его URL.
- В админке позиции кнопок/ссылок меняются стрелками вверх/вниз (обмен значений `position` у соседних записей).
- Все мутации идут через server actions с сервисным ключом Supabase, минуя RLS.
