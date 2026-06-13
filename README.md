<div align="center">

![JobFlow Logo](frontend/src/assets/jobflow-logo.png)

# JobFlow

**Streamline Your Job Search Journey**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![React](https://img.shields.io/badge/React-19.2.6-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24.14.1-339933?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.8.0-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)](https://www.postgresql.org/)

**A modern full-stack job application management platform that helps job seekers organize, track, and optimize their job search process with intelligent insights and seamless workflow automation.**

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Product Overview](#-product-overview)
- [Key Features](#-key-features)
- [Architecture Diagram](#-architecture-diagram)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Deployment](#-deployment)
- [Security Features](#-security-features)
- [Performance & Scalability](#-performance--scalability)
- [Future Roadmap](#-future-roadmap)
- [Resume Impact](#-resume-impact)
- [Author](#-author)
- [License](#-license)

---

## 🎯 Product Overview

JobFlow is a comprehensive job application management platform designed to transform the chaotic job search process into an organized, data-driven experience. Built for modern job seekers, JobFlow provides intelligent tracking, analytics, and automation tools that help users stay organized, make informed decisions, and land their dream roles faster.

### Problem Solved

Job seekers often struggle with:
- **Application Chaos**: Losing track of multiple applications across different companies
- **Interview Overload**: Missing interview schedules and preparation time
- **Lack of Insights**: No clear view of application success rates or patterns
- **Poor Follow-up**: Missing critical follow-up opportunities
- **Resume Versioning**: Confusion about which resume was sent to which company

### Key Benefits

- **Centralized Management**: All job applications in one organized dashboard
- **Smart Analytics**: Data-driven insights into application performance
- **Interview Scheduling**: Never miss an interview with automated reminders
- **Note Organization**: Keep detailed notes for each application and interview
- **Status Tracking**: Real-time visibility into application pipeline stages
- **Search & Filter**: Quickly find applications by company, role, or status

---

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication with refresh tokens
- **Google OAuth Integration**: Seamless social authentication with Google
- **Password Hashing**: Industry-standard bcrypt encryption for user credentials
- **Session Management**: Secure cookie-based session handling

### 📊 Job Application Tracking
- **Application Dashboard**: Centralized view of all job applications
- **Status Management**: Track applications through custom pipeline stages
- **Company & Role Details**: Store comprehensive application information
- **Application Dates**: Track submission dates and follow-up deadlines
- **Salary Information**: Record salary ranges and compensation details
- **Job Links**: Direct links to original job postings

### 📅 Interview Management
- **Interview Scheduling**: Schedule and manage upcoming interviews
- **Interviewer Details**: Store interviewer names and contact information
- **Meeting Links**: Integration with video conferencing platforms
- **Interview Notes**: Detailed notes for each interview session
- **Timeline View**: Visual timeline of all scheduled interviews

### 📝 Notes & Follow-ups
- **Structured Notes**: Organized note-taking for research, preparation, and follow-ups
- **Note Categories**: Personal notes, company research, interview preparation
- **Rich Text Support**: Detailed content formatting for comprehensive notes
- **Activity Tracking**: Automatic activity logging for all application updates

### 📈 Dashboard Analytics
- **Application Statistics**: Total applications, active applications, offers received
- **Success Metrics**: Interview rate, offer rate, rejection analysis
- **Weekly Insights**: Applications submitted per week and trends
- **Pipeline Visualization**: Visual representation of application pipeline stages
- **Performance Tracking**: Track improvement over time

### 🔍 Search & Filtering
- **Advanced Search**: Search by company name, role, or keywords
- **Status Filtering**: Filter applications by current status
- **Location-based Search**: Filter by job location
- **Quick Filters**: One-click access to common filter combinations

### 📱 Responsive Design
- **Mobile-First UI**: Optimized for all device sizes
- **Modern Interface**: Clean, intuitive user experience
- **Dark Mode Support**: Eye-friendly interface for extended use
- **Fast Performance**: Optimized loading times and smooth interactions

### 🛡️ Secure Backend
- **RESTful API**: Clean, well-documented API endpoints
- **Input Validation**: Comprehensive request validation using Zod
- **Error Handling**: Robust error handling and logging
- **Rate Limiting**: Protection against API abuse
- **CORS Configuration**: Secure cross-origin resource sharing

---

## 🏗️ Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React 19 + TypeScript]
        B[Vite Build Tool]
        C[Tailwind CSS]
        D[Zustand State Management]
        E[React Query]
    end

    subgraph "API Layer"
        F[Express.js Server]
        G[JWT Authentication]
        H[Google OAuth]
        I[RESTful Endpoints]
        J[Request Validation]
    end

    subgraph "Data Layer"
        K[PostgreSQL Database]
        L[Prisma ORM]
        M[Connection Pooling]
    end

    subgraph "External Services"
        N[Google OAuth API]
        O[Gmail SMTP]
    end

    A --> I
    D --> I
    E --> I
    I --> F
    F --> G
    F --> H
    F --> J
    F --> L
    L --> K
    K --> M
    H --> N
    F --> O

    style A fill:#61DAFB
    style F fill:#68A063
    style K fill:#4169E1
    style L fill:#2D3748
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.6 with TypeScript
- **Build Tool**: Vite 8.0.12
- **Styling**: Tailwind CSS 4.3.0
- **State Management**: Zustand 5.0.14
- **Data Fetching**: React Query 5.101.0
- **Routing**: React Router DOM 7.17.0
- **HTTP Client**: Axios 1.17.0
- **Icons**: Lucide React 1.17.0
- **Form Validation**: Zod 4.4.3

### Backend
- **Runtime**: Node.js 24.14.1
- **Framework**: Express.js 5.2.1
- **Language**: TypeScript 6.0.3
- **Authentication**: JWT 9.0.3, Passport 0.7.0
- **OAuth**: Passport Google OAuth 2.0.0
- **Password Hashing**: bcrypt 6.0.0
- **Email Service**: Nodemailer 8.0.11
- **Validation**: Zod 4.4.3
- **CORS**: cors 2.8.6
- **Cookies**: cookie-parser 1.4.7

### Database
- **Database**: PostgreSQL 15
- **ORM**: Prisma 7.8.0
- **Adapter**: Prisma PostgreSQL Adapter
- **Connection**: pg 8.21.0

### Authentication
- **Strategy**: JWT Access + Refresh Tokens
- **Social Auth**: Google OAuth 2.0
- **Password Security**: bcrypt with salt rounds
- **Session Management**: HTTP-only cookies

### Deployment
- **Platform**: Render
- **Frontend Runtime**: Node.js with Express server
- **Backend Runtime**: Node.js
- **Database**: Render PostgreSQL
- **Build Process**: Automated CI/CD via Render
- **Environment Management**: Render environment variables

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint 10.3.0
- **Type Checking**: TypeScript 6.0.2
- **Hot Reload**: Vite HMR, nodemon
- **Version Control**: Git
- **API Testing**: Postman/Insomnia

---

## 📁 Project Structure

```
JobFlow/
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   └── _redirects
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.ts
│   │   │   └── config.ts
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   └── jobflow-logo.png
│   │   ├── components/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Interview.tsx
│   │   │   ├── JobTracker.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Notes.tsx
│   │   │   ├── Profile.tsx
│   │   │   └── Register.tsx
│   │   ├── store/
│   │   │   └── useAuthStore.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── server.js
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── Dockerfile
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   │   ├── activityController.ts
│   │   │   ├── authController.ts
│   │   │   ├── interviewController.ts
│   │   │   ├── jobController.ts
│   │   │   └── noteController.ts
│   │   ├── db/
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts
│   │   ├── routes/
│   │   │   ├── activityRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── interviewRoutes.ts
│   │   │   ├── jobRoutes.ts
│   │   │   └── noteRoutes.ts
│   │   ├── services/
│   │   │   └── emailService.ts
│   │   ├── types/
│   │   │   └── express.d.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sam-wan30/JobFlow.git
   cd JobFlow
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Environment Variables**
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure the required environment variables (see [Environment Variables](#-environment-variables))

5. **Setup Database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

6. **Run Development Servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on `http://localhost:5001`

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

### Production Build

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build Backend**
   ```bash
   cd backend
   npm run build
   ```

3. **Start Production Servers**
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd frontend
   npm start
   ```

---

## 🔐 Environment Variables

### Backend Environment Variables (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:password@localhost:5432/jobflow` | Yes |
| `JWT_SECRET` | Secret key for JWT access tokens | `your-super-secret-jwt-key` | Yes |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens | `your-super-secret-refresh-key` | Yes |
| `PORT` | Backend server port | `5001` | No |
| `NODE_ENV` | Environment mode | `development` or `production` | No |
| `FRONTEND_URL` | Frontend application URL | `http://localhost:5173` | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `your-google-client-id` | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `your-google-client-secret` | Yes |
| `GOOGLE_CALLBACK_URL` | Google OAuth callback URL | `http://localhost:5001/api/auth/google/callback` | Yes |
| `EMAIL_SERVICE` | Email service provider | `gmail` | Yes |
| `EMAIL_USER` | Email address for sending emails | `your-email@gmail.com` | Yes |
| `EMAIL_PASSWORD` | Email password or app password | `your-email-password` | Yes |
| `EMAIL_FROM` | From address for emails | `JobFlow <noreply@jobflow.com>` | Yes |

### Frontend Environment Variables (.env)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5001` | Yes |

---

## 📡 API Overview

### Authentication Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/google` | Initiate Google OAuth | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |
| PUT | `/api/auth/avatar` | Update user avatar | Yes |

### Job Application Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/jobs` | Create new job application | Yes |
| GET | `/api/jobs` | Get all user jobs | Yes |
| GET | `/api/jobs/:id` | Get job by ID | Yes |
| PUT | `/api/jobs/:id` | Update job application | Yes |
| DELETE | `/api/jobs/:id` | Delete job application | Yes |
| GET | `/api/jobs/stats/dashboard` | Get dashboard statistics | Yes |

### Interview Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/interviews` | Schedule interview | Yes |
| GET | `/api/interviews` | Get all interviews | Yes |
| PUT | `/api/interviews/:id` | Update interview | Yes |
| DELETE | `/api/interviews/:id` | Delete interview | Yes |

### Notes Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/notes` | Create note | Yes |
| PUT | `/api/notes/:id` | Update note | Yes |
| DELETE | `/api/notes/:id` | Delete note | Yes |
| GET | `/api/activities/:jobId` | Get activities for job | Yes |

---

## 🌐 Deployment

### Render Deployment

#### Prerequisites
- Render account
- GitHub repository connected to Render
- PostgreSQL database on Render

#### Backend Deployment

1. **Create PostgreSQL Database**
   - Go to Render dashboard → New → PostgreSQL
   - Name: `jobflow-db`
   - Copy the Internal Database URL

2. **Create Backend Service**
   - Go to Render dashboard → New → Web Service
   - Connect your GitHub repository
   - **Build Settings:**
     - Runtime: Node
     - Build Command: `cd backend && npm install && npm run build`
     - Start Command: `cd backend && npm start`
   - **Environment Variables:**
     - Add all required backend environment variables
     - Use the PostgreSQL Internal Database URL for `DATABASE_URL`
   - Click "Create Web Service"

#### Frontend Deployment

1. **Create Frontend Service**
   - Go to Render dashboard → New → Web Service
   - Connect your GitHub repository
   - **Build Settings:**
     - Runtime: Node
     - Build Command: `cd frontend && npm install && npm run build`
     - Start Command: `cd frontend && npm start`
   - **Environment Variables:**
     - `VITE_API_URL`: Your backend URL (e.g., `https://jobflow-backend.onrender.com`)
   - Click "Create Web Service"

#### Post-Deployment Configuration

1. **Update Google OAuth Redirect URI**
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Add your backend URL to Authorized Redirect URIs:
     - `https://your-backend-url.onrender.com/api/auth/google/callback`

2. **Update Backend Environment Variables**
   - Add `FRONTEND_URL`: Your frontend URL
   - Update `GOOGLE_CALLBACK_URL`: Your backend callback URL
   - Redeploy backend service

### Docker Deployment

#### Local Development

```bash
docker-compose up -d --build
```

This starts:
- Frontend: http://localhost
- Backend: http://localhost:5001
- PostgreSQL: localhost:5432

---

## 🔒 Security Features

### Authentication & Authorization
- **JWT Token System**: Access tokens (15min) + Refresh tokens (7 days)
- **Secure Password Storage**: bcrypt with salt rounds
- **HTTP-Only Cookies**: Prevent XSS attacks
- **Token Refresh Mechanism**: Seamless token renewal
- **Route Protection**: Middleware-based authentication checks

### API Security
- **Input Validation**: Zod schema validation for all requests
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Rate Limiting**: Protection against API abuse
- **Error Handling**: Secure error responses without sensitive data

### Data Protection
- **Environment Variables**: Sensitive data never committed to code
- **HTTPS Enforcement**: Secure communication in production
- **Cookie Security**: Secure, httpOnly, sameSite cookies
- **User Data Isolation**: Strict user data segregation
- **Session Management**: Secure session handling

### Production Security
- **Environment Validation**: Production environment checks
- **Secret Management**: Secure secret handling
- **Dependency Updates**: Regular security updates
- **Code Review**: Security-focused development practices

---

## ⚡ Performance & Scalability

### Performance Optimizations
- **Frontend**: Code splitting, lazy loading, optimized bundle size
- **Backend**: Efficient database queries, connection pooling
- **Caching**: React Query caching for API responses
- **Image Optimization**: Optimized asset loading
- **Minification**: Production build optimization

### Scalability Considerations
- **Modular Architecture**: Easy component addition and modification
- **Database Indexing**: Optimized query performance
- **API Design**: RESTful principles for scalability
- **State Management**: Efficient state handling
- **Load Balancing Ready**: Stateless API design

### Maintainability
- **Clean Code**: Consistent coding standards
- **Type Safety**: TypeScript for type safety
- **Documentation**: Comprehensive code documentation
- **Error Logging**: Structured error tracking
- **Testing Ready**: Test-friendly architecture

---

## 🗺️ Future Roadmap

### Phase 1: Enhanced Features
- [ ] **Resume Analyzer**: AI-powered resume analysis and optimization
- [ ] **Job Recommendations**: ML-based job matching and recommendations
- [ ] **Calendar Integration**: Sync interviews with Google Calendar
- [ ] **Email Notifications**: Automated email reminders and updates
- [ ] **Application Templates**: Pre-built application templates

### Phase 2: Advanced Analytics
- [ ] **Success Metrics**: Detailed success rate analysis
- [ ] **Market Insights**: Job market trends and salary insights
- [ ] **Performance Tracking**: Long-term performance analytics
- [ ] **Export Reports**: PDF/Excel export functionality
- [ ] **Custom Dashboards**: Personalized dashboard configurations

### Phase 3: Collaboration & Mobile
- [ ] **Mobile App**: Native iOS and Android applications
- [ ] **Team Collaboration**: Shared workspaces for teams
- [ ] **Browser Extension**: Chrome extension for quick job tracking
- [ ] **API for Integrations**: Public API for third-party integrations
- [ ] **Webhooks**: Webhook support for automation

### Phase 4: Enterprise Features
- [ ] **SSO Integration**: Single Sign-On support
- [ ] **Advanced Security**: 2FA, audit logs, compliance features
- [ ] **Custom Workflows**: Customizable application workflows
- [ ] **White-labeling**: Custom branding options
- [ ] **API Rate Limits**: Tiered API access

---

## 💼 Resume Impact

This project demonstrates the following software engineering skills:

### Full-Stack Development
- **Frontend**: React 19, TypeScript, modern state management, responsive design
- **Backend**: Express.js, RESTful APIs, middleware architecture
- **Database**: PostgreSQL, Prisma ORM, schema design, migrations
- **Integration**: Third-party API integration (Google OAuth, email services)

### Authentication & Security
- **JWT Implementation**: Access/refresh token system
- **OAuth Integration**: Google OAuth 2.0 implementation
- **Security Best Practices**: Password hashing, secure cookies, input validation
- **Authorization**: Role-based access control, route protection

### Database Design
- **Schema Design**: Normalized database schema with relationships
- **ORM Usage**: Prisma for type-safe database operations
- **Query Optimization**: Efficient queries with indexing
- **Data Modeling**: Complex relationships and data integrity

### Deployment & DevOps
- **Cloud Deployment**: Render platform deployment
- **CI/CD**: Automated build and deployment pipelines
- **Environment Management**: Production environment configuration
- **Docker**: Containerization for consistent deployments
- **Monitoring**: Error handling and logging practices

### System Design
- **Architecture**: Scalable microservices architecture
- **API Design**: RESTful API design principles
- **State Management**: Efficient client-side state management
- **Performance Optimization**: Code splitting, caching, lazy loading

### Clean Architecture
- **Code Organization**: Modular, maintainable code structure
- **Type Safety**: TypeScript for type safety across the stack
- **Error Handling**: Comprehensive error handling strategies
- **Testing Ready**: Test-friendly architecture and design patterns

### Production Engineering
- **Production-Ready Code**: Error handling, validation, logging
- **Security**: Security best practices in production
- **Performance**: Production performance optimization
- **Scalability**: Architecture designed for growth

---

## 👨‍💻 Author

**Samiksha**

- **GitHub**: [Sam-wan30](https://github.com/Sam-wan30)
- **LinkedIn**: [Samiksha](https://linkedin.com/in/samiksha)
- **Portfolio**: [samiksha.dev](https://samiksha.dev)
- **Email**: samistudies30@gmail.com

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🙏 Acknowledgments

- **React Team**: For the amazing React framework
- **Vite Team**: For the lightning-fast build tool
- **Prisma Team**: For the excellent ORM
- **Render Team**: For the seamless deployment platform
- **Open Source Community**: For the incredible tools and libraries

---

<div align="center">

**Built with ❤️ by Samiksha**

[⬆ Back to Top](#jobflow)

</div>

