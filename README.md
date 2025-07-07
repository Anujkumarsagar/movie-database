<div align="center">

# 🎬 Movie Database

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Prisma-Latest-green?logo=prisma" alt="Prisma">
  <img src="https://img.shields.io/badge/Redis-Latest-red?logo=redis" alt="Redis">
  <img src="https://img.shields.io/github/license/Anujkumarsagar/movie-database" alt="License">
  <img src="https://img.shields.io/github/last-commit/Anujkumarsagar/movie-database" alt="Last Commit">
</p>

<p align="center">
  A modern, high-performance movie database built with TypeScript, Prisma, and Redis
</p>

[Features](#-features) •
[Installation](#-installation) •
[Documentation](#-documentation) •
[Contributing](#-contributing)

</div>

---

## ✨ Features

<div align="center">

|  Core Features  |  Technical Stack  |  Performance  |
|----------------|------------------|---------------|
| 🎯 Movie Management | 📝 TypeScript | ⚡ Redis Caching |
| 🔍 Advanced Search | 💾 Prisma ORM | 🚀 Fast Queries |
| 🔄 Real-time Updates | 📦 Redis | 📊 Optimized Data |
| 🎨 Modern UI | 🛠 RESTful API | 🔧 Type Safety |

</div>

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 16+
Redis 6+
PostgreSQL/MySQL
```

### One-Click Setup

```bash
# Clone the repository
git clone https://github.com/Anujkumarsagar/movie-database.git

# Install dependencies
cd movie-database && npm install

# Setup environment
cp .env.example .env

# Start development server
npm run dev
```

## 🏗 Architecture

<div align="center">

```mermaid
graph TD
    A[Client] --> B[API Layer]
    B --> C[Redis Cache]
    B --> D[Prisma ORM]
    D --> E[Database]
    C --> B
```

</div>

## 📁 Project Structure

```
movie-database/
├── 📂 src/
│   ├── 🔧 config/
│   │   ├── redis.ts
│   │   └── prisma.ts
│   ├── 🎮 controllers/
│   ├── 📊 models/
│   ├── 🛣 routes/
│   ├── ⚙️ services/
│   ├── 🔨 utils/
│   └── 📝 types/
├── 📂 prisma/
│   ├── schema.prisma
│   └── migrations/
└── 📂 public/
```

## ⚙️ Environment Setup

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/moviedb"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD="your_password"

# API Configuration
API_PORT=3000
NODE_ENV="development"
```

## 🔥 Core Features

<div align="center">

| Feature | Description | Status |
|---------|------------|--------|
| Authentication | JWT-based auth with Redis sessions | ✅ |
| Movie Management | CRUD operations with caching | ✅ |
| Search | Full-text search with Redis | ✅ |
| Real-time Updates | WebSocket integration | 🟡 |
| Analytics | Usage statistics and metrics | 🟡 |

</div>

## 🛠 Development Commands

```bash
# Database Management
npm run db:migrate    # Run database migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio

# Redis Operations
npm run cache:clear  # Clear Redis cache
npm run cache:stats  # View cache statistics

# Development
npm run dev         # Start development server
npm run build      # Build for production
npm run test       # Run tests
```

## 📈 Performance Optimizations

- ⚡ Redis caching for frequently accessed data
- 🔄 Automatic cache invalidation
- 📊 Optimized database queries
- 🚀 Connection pooling
- 📱 Response compression

## 🔐 Security Features

- 🔒 Rate limiting
- 🛡️ CORS protection
- 🔑 JWT authentication
- 🚫 XSS prevention
- 📝 Request validation

## 👥 Contributing

<div align="center">

| Step | Description |
|------|-------------|
| 1️⃣ | Fork the repo |
| 2️⃣ | Create feature branch |
| 3️⃣ | Commit changes |
| 4️⃣ | Push to branch |
| 5️⃣ | Open pull request |

</div>

## 📚 Documentation

<div align="center">

[![Prisma Docs](https://img.shields.io/badge/Prisma-Docs-green?style=for-the-badge&logo=prisma)](https://www.prisma.io/docs/)
[![Redis Docs](https://img.shields.io/badge/Redis-Docs-red?style=for-the-badge&logo=redis)](https://redis.io/documentation)
[![TypeScript Docs](https://img.shields.io/badge/TypeScript-Docs-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/docs/)

</div>

## 📄 License

<div align="center">

MIT © [Anujkumarsagar](https://github.com/Anujkumarsagar)

</div>

---

<div align="center">

### 🌟 Support This Project

[![Star on GitHub](https://img.shields.io/github/stars/Anujkumarsagar/movie-database.svg?style=social)](https://github.com/Anujkumarsagar/movie-database/stargazers)
[![Follow](https://img.shields.io/github/followers/Anujkumarsagar?style=social)](https://github.com/Anujkumarsagar)

**Created with ❤️ by [Anuj Kumar Sagar](https://github.com/Anujkumarsagar)**  
Last updated: 2025-07-07 17:40:17 UTC

</div>
