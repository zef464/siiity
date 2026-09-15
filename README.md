# 📚 My Library (Books, Movies & TV Shows Tracking Platform)

> **Full-stack pet-проект на Next.js 14+ (App Router)** для управления личной медиатекой. Разработан с фокусом на продуктивную архитектуру, безопасность, строгую типизацию и полную автономность в формате **Self-Hosted** с использованием **Docker** и **Nginx**.

![Next.js](https://img.shields.io/badge/Next.js_14+-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📋 Содержание

- [🎯 Зачем этот проект?](#-зачем-этот-проект)
- [🛠 Стек технологий](#-стек-технологий)
- [🏗 System Design \& Архитектура](#-system-design--архитектура)
- [🗄 Схема базы данных (Prisma Schema)](#-схема-базы-данных-prisma-schema)
- [📁 Структура директорий проекта](#-структура-директорий-проекта)
- [🚀 Быстрый старт (Локальная разработка)](#-быстрый-старт-локальная-разработка)
- [🐳 Деплой на Production (VPS + Docker + Nginx)](#-деплой-на-production-vps--docker--nginx)
  - [1. Dockerfile (Multi-stage сборка)](#1-dockerfile-multi-stage-сборка)
  - [2. Production Docker Compose (`docker-compose.prod.yml`)](#2-production-docker-compose-docker-composeprodyml)
  - [3. Конфигурация Nginx (`nginx.conf`)](#3-конфигурация-nginx-nginxconf)
  - [4. Запуск и применение миграций](#4-запуск-и-применение-миграций)
- [🌐 Поддержка локализации (next-intl)](#-поддержка-локализации-next-intl)

---

## 🎯 Зачем этот проект?

Цель **My Library** — не просто сделать базовый CRUD для трекинга просмотренного и прочитанного, а продемонстрировать полноценную **System Design архитектуру** современной full-stack веб-платформы:

* **Автоматическое обогащение данных:** Пользователь вводит только название, а приложение само подтягивает постеры, описания и обложки через TMDB API и Open Library API.
* **Динамические статусы карточек:** Система автоматически различает медиа-типы. Для книг отображаются статусы `Читаю` / `Прочитано`, а для фильмов и сериалов — `Смотрю` / `Просмотрено`.
* **Изоляция и безопасность:** Никаких публично доступных портов СУБД. База данных спрятана во внутреннюю закрытую Docker-сеть.
* **Производительность:** Серверный рендеринг (React Server Components) минимизирует объем JavaScript, отправляемого в браузер.
* **Интернационализация (i18n):** Полноценная поддержка переключения языков (RU/EN) на уровне серверных компонентов через `next-intl`.

---

## 🛠 Стек технологий

| Слой | Технология | Назначение |
| :--- | :--- | :--- |
| **Framework** | **Next.js 14+ (App Router)** | Full-stack веб-фреймворк с SSR, RSC, Route Handlers и оптимзацией изображений. |
| **Language** | **TypeScript** | Гарантирует сквозную типизацию от схемы СУБД до UI-компонентов. |
| **Database** | **PostgreSQL (Docker)** | Надежная реляционная СУБД для хранения пользователей, сессий и элементов медиатеки. |
| **ORM** | **Prisma** | Безопасная работа с СУБД, автогенерация типов, миграции структуры. |
| **Auth** | **NextAuth.js (Auth.js v5)** | Авторизация через OAuth (GitHub) и менеджмент сессий. |
| **i18n** | **next-intl** | Стандарт локализации для Next.js App Router (RU / EN). |
| **Styling** | **Tailwind CSS + Lucide Icons** | Быстрая верстка тёмного/светлого адаптивного UI. |
| **APIs** | **TMDB API & Open Library API** | Автоматический поиск и парсинг информации о фильмах, сериалах и книгах. |
| **DevOps** | **Docker Compose + Nginx** | Контейнеризация и оркестрация сервисов с Nginx в качестве Reverse Proxy. |

---

## 🏗 System Design & Архитектура

### Схема потоков данных (Data Flow) & Сетевая изоляция

```
                  ┌─────────────────────────────────────────┐
                  │            Браузер (Клиент)             │
                  └────────────────────┬────────────────────┘
                                       │  HTTP (80) / HTTPS (443)
                                       ▼
                  ┌─────────────────────────────────────────┐
                  │            Nginx Reverse Proxy          │
                  │        (SSL Termination & Domain)       │
                  └────────────────────┬────────────────────┘
                                       │  Internal Proxy (http://app:3000)
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Docker Internal Network (Замкнутая приватная сеть `app-network`)           │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Контейнер: app (Next.js Node Server)                                  │  │
│  │                                                                       │  │
│  │   ┌──────────────────────────┐    ┌──────────────────────────────┐    │  │
│  │   │  next-intl Middleware    │    │   NextAuth Middleware        │    │  │
│  │   └────────────┬─────────────┘    └──────────────┬───────────────┘    │  │
│  │                │                                 │                    │  │
│  │                ▼                                 ▼                    │  │
│  │   ┌──────────────────────────┐    ┌──────────────────────────────┐    │  │
│  │   │ Server Components (SSR)  │    │ Route Handlers / Server Act. │    │  │
│  │   └────────────┬─────────────┘    └──────────────┬───────────────┘    │  │
│  │                │                                 │                    │  │
│  │                └────────────────┬────────────────┘                    │  │
│  │                                 │ Prisma Client                       │  │
│  └─────────────────────────────────┼─────────────────────────────────────┘  │
│                                    │ db:5432 (Только внутри Docker)         │
│                                    ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Контейнер: db (PostgreSQL + Volume `postgres_data`)                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────┬────────────────────────────────────────┘
                                     │ Server-Side External Fetch (API Keys Safe)
                                     ▼
                   ┌──────────────────────────────────┐
                   │  TMDB API / Open Library API /   │
                   │           GitHub OAuth           │
                   └──────────────────────────────────┘
```

### Главные архитектурные решения:
1. **Защита СУБД:** Порт `5432` СУБД PostgreSQL не публикуется во внешнюю сеть хоста. Доступ к БД возможен **только** внутри изолированной Docker-сети `app-network` по внутреннему DNS-имени `db:5432`.
2. **Безопасность API-ключей:** Все обращения к сторонним API (TMDB, Open Library) выполняются строго на сервере (Route Handlers). API-ключи никогда не попадают в клиентский JS-бандл.
3. **Единый Reverse Proxy:** Nginx выступает фронтальным сервером, принимает внешние соединения, отдаёт статику, кэширует запросы и проксирует их на сервис Next.js (`http://app:3000`).
4. **Персистентность данных:** Все данные СУБД сохраняются в монтируемом volume `postgres_data`, сохраняя целостность данных при перезапуске или обновлении контейнеров.

---

## 🗄 Схема базы данных (Prisma Schema)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  items         Item[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Item {
  id        String   @id @default(cuid())
  title     String
  type      String   // "movie" | "serial" | "book"
  status    String   @default("planned") // "planned" | "in_progress" | "completed"
  rating    Int?
  notes     String?
  plot      String?
  coverUrl  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 📁 Структура директорий проекта

```
my-library/
├── app/                  # Next.js App Router
│   └── [locale]/         # Динамический роут для i18n (/ru, /en)
│       ├── api/          # Route Handlers (TMDB, OpenLibrary, Items API)
│       ├── login/        # Страница авторизации
│       ├── layout.tsx    # Корневой layout с провайдерами и шрифтами Geist
│       └── page.tsx      # Главная страница (Дашборд медиатеки)
├── components/           # React UI-компоненты (ItemCard, ItemForm и др.)
├── messages/             # Словари локализации (ru.json, en.json)
├── lib/                  # Конфигурация Auth.js (auth.ts) и инстанс Prisma (prisma.ts)
├── prisma/               # Схема СУБД (schema.prisma) и миграции
├── nginx/                # Конфигурация Nginx Reverse Proxy (nginx.conf)
├── .env.example          # Шаблон переменных окружения
├── docker-compose.yml    # Compose для локальной разработки
├── docker-compose.prod.yml # Production Compose сборка
└── Dockerfile            # Оптимизированный multi-stage Dockerfile
```

---

## 🚀 Быстрый старт (Локальная разработка)

### 1. Пререквизиты
Убедитесь, что у вас установлены:
* **Node.js** (версия 20 или новее)
* **Docker** & **Docker Compose**
* **Git**

### 2. Клонирование и установка зависимостей
```bash
git clone https://github.com/your-username/my-library.git
cd my-library
npm install
```

### 3. Настройка переменных окружения
Создайте локальный файл `.env`:
```bash
cp .env.example .env
```

Заполните значения в `.env`:
```env
# База данных PostgreSQL (для локального запуска)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/siiity?schema=public"

# NextAuth / Auth.js
NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth App
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# TMDB API Key
TMDB_API_KEY="your_tmdb_api_key"
```

### 4. Запуск PostgreSQL в Docker
```bash
docker compose up db -d
```

### 5. Применение миграций Prisma
```bash
npx prisma db push
```

### 6. Запуск сервера разработки
```bash
npm run dev
```
Откройте браузер по адресу: `http://localhost:3000`

---

## 🐳 Деплой на Production (VPS + Docker + Nginx)

Для развертывания проекта на собственном VPS используются 3 основных файла конфигурации:

### 1. Dockerfile (Multi-stage сборка)

Создайте файл `Dockerfile` в корне проекта:

```dockerfile
# 1. Зависимости
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci

# 2. Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate
RUN npm run build

# 3. Финальный образ (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Production Docker Compose (`docker-compose.prod.yml`)

Создайте файл `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: library-db
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: strong_prod_password_here
      POSTGRES_DB: siiity
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: library-app
    restart: always
    environment:
      DATABASE_URL: "postgresql://postgres:strong_prod_password_here@db:5432/siiity?schema=public"
      NEXTAUTH_SECRET: "your-production-secret-at-least-32-chars"
      NEXTAUTH_URL: "https://your-domain.com"
      GITHUB_CLIENT_ID: "your_prod_github_id"
      GITHUB_CLIENT_SECRET: "your_prod_github_secret"
      TMDB_API_KEY: "your_tmdb_api_key"
    depends_on:
      - db
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: library-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### 3. Конфигурация Nginx (`nginx/nginx.conf`)

Создайте директорию `nginx` и файл `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout 65;

    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # HTTP сервер (редирект на HTTPS или проксирование)
    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;

        # Челлендж для Let's Encrypt (Certbot)
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    # HTTPS сервер
    server {
        listen 443 ssl;
        server_name your-domain.com www.your-domain.com;

        # Пути к сертификатам SSL (Certbot)
        ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Кэширование статических файлов Next.js
        location /_next/static/ {
            proxy_pass http://app:3000/_next/static/;
            proxy_cache_bypass $http_upgrade;
            expires 365d;
            access_log off;
        }

        # Проксирование всех остальных запросов на приложение Next.js
        location / {
            proxy_pass http://app:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 4. Запуск и применение миграций

Выполните команды на вашем VPS:

```bash
# 1. Запуск контейнеров в фоновом режиме
docker compose -f docker-compose.prod.yml up --build -d

# 2. Применение миграций БД внутри контейнера приложения
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

---

## 🌐 Поддержка локализации (next-intl)

Все тексты интерфейса вынесены в файлы словарей в папке `messages/`:

* `messages/ru.json` — Русскоязычная локализация.
* `messages/en.json` — Англоязычная локализация.

Пример структуры файла переводов:

```json
{
  "ItemCard": {
    "edit": "Редактировать",
    "delete": "Удалить",
    "save": "Сохранить",
    "cancel": "Отмена",
    "confirmDelete": "Вы уверены?",
    "statusPlanned": "Запланировано",
    "statusReading": "Читаю",
    "statusWatching": "Смотрю",
    "statusRead": "Прочитано",
    "statusWatched": "Завершено"
  },
  "ItemForm": {
    "placeholder_movie": "Название фильма...",
    "placeholder_book": "Название книги...",
    "placeholder_serial": "Название сериала...",
    "movie": "Фильм",
    "serial": "Сериал",
    "book": "Книга",
    "searching": "Поиск...",
    "addButton": "Добавить"
  }
}
```

Смена языка происходит без перезагрузки страницы благодаря динамическому роутингу App Router (`app/[locale]/...`).