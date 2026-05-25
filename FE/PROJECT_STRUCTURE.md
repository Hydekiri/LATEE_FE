# LATEE Frontend - Project Structure

```
FE/
│
├── public/
│   └── images/
│       └── VirtualPatient/
│
├── src/
│   │
│   ├── app/                                    🔀 Next.js App Router (Routing Layer)
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── test.tsx
│   │   │
│   │   ├── (auth)/                            🔐 Authentication Routes
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (main)/                            🏠 Main Application Routes
│   │   │   ├── aboutUs/
│   │   │   │   └── page.tsx
│   │   │   ├── assessment/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   └── page.tsx
│   │   │   ├── home/
│   │   │   │   └── page.tsx
│   │   │   ├── progress/
│   │   │   │   └── page.tsx
│   │   │   └── practice/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           ├── page.tsx
│   │   │           └── take/
│   │   │               └── page.tsx
│   │   │
│   │   └── api/
│   │       └── page.tsx
│   │
│   ├── components/                            🧩 Shared UI Components
│   │   ├── common/
│   │   │   └── HeroSection.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Home_Header.tsx
│   │   │   ├── Login_Header.tsx
│   │   │   ├── NavLanding.tsx
│   │   │   ├── footer_vta.jsx
│   │   │   ├── herosection.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── navbarbasicpage.tsx
│   │   │   ├── searchbar.tsx
│   │   │   └── testimonial.tsx
│   │   │
│   │   ├── providers/
│   │   │   └── providers.tsx
│   │   │
│   │   └── ui/
│   │       └── ui.tsx
│   │
│   ├── features/                              🎯 Feature Modules (Domain Logic)
│   │   │
│   │   ├── assessment/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── AssessmentList.tsx
│   │   │       ├── AssessmentOverview.tsx
│   │   │       ├── ContinueAssessment.tsx
│   │   │       └── subComponents/
│   │   │           └── CaseInfo.tsx
│   │   │
│   │   ├── auth/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── Login_Banner.tsx
│   │   │       └── Login_Form.tsx
│   │   │
│   │   ├── blog/
│   │   │   └── page.tsx
│   │   │
│   │   ├── progress/
│   │   │   └── page.tsx
│   │   │
│   │   ├── virtual-patient/
│   │   │   └── page.tsx
│   │   │
│   │   └── practice/                          🩺 Practice Module
│   │       ├── page.tsx
│   │       │
│   │       ├── components/
│   │       │   ├── Practice_Card.tsx
│   │       │   ├── Practice_Details.tsx
│   │       │   │
│   │       │   └── subComponents/
│   │       │       ├── CaseOverview.tsx
│   │       │       ├── PatientInfo.tsx
│   │       │       │
│   │       │       └── tabs/
│   │       │           ├── AboutPatient.tsx
│   │       │           ├── Evaluation.tsx
│   │       │           ├── Expert.tsx
│   │       │           ├── FQA.tsx
│   │       │           └── Results.tsx
│   │       │
│   │       └── takePractice/
│   │           ├── components/
│   │           │   ├── TakePracticePage.tsx
│   │           │   ├── Header.tsx
│   │           │   ├── PatientSidebar.tsx
│   │           │   ├── ChatArea.tsx
│   │           │   ├── ChatMessage.tsx
│   │           │   └── AiAssistantSidebar.tsx
│   │           │
│   │           └── types/
│   │               └── index.ts
│   │
│   ├── services/                              🌐 API Service Layer
│   │   ├── auth-service.ts
│   │   ├── user-service.ts
│   │   ├── patient-service.ts
│   │   └── aiAssistant-service.tsx
│   │
│   ├── types/                                 📘 TypeScript Definitions
│   │   ├── api.d.ts
│   │   ├── next-auth.d.ts
│   │   └── practice.ts
│   │
│   ├── config/                                ⚙️ Configuration Files
│   │   ├── env.ts
│   │   └── fonts.ts
│   │
│   ├── data/                                  📊 Mock & Static Data
│   │   ├── mockData.ts
│   │   └── patient.ts
│   │
│   ├── hooks/                                 🎣 Custom React Hooks
│   │   └── use-media-query.ts
│   │
│   ├── utils/                                 🛠️ Utility Functions
│   │   └── cookies.tsx
│   │
│   ├── assets/                                🎨 Static Assets
│   │   ├── fonts/
│   │   └── icons/
│   │
│   └── lib/                                   📚 Third-party Library Configs
│
└── 📦 Root Configuration Files
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── next-env.d.ts
    ├── eslint.config.mjs
    ├── postcss.config.mjs
    └── README.md
```

## 📚 Directory Structure Guidelines

### `/src/app` - Routing Layer
- Uses Next.js App Router conventions
- Route groups: `(auth)`, `(main)`
- Dynamic routes: `[id]`
- Each route has a `page.tsx` file

### `/src/features` - Feature Modules
- Self-contained feature modules
- Each feature contains its own components, logic, and types
- Example: `practice/` contains all practice-related components

### `/src/components` - Shared Components
- `common/` - Reusable UI components
- `layout/` - Layout components (headers, footers, navigation)
- `providers/` - React context providers
- `ui/` - Base UI primitives

### `/src/services` - API Integration
- Service layer for backend communication
- Each service handles a specific domain

### `/src/types` - Type Definitions
- Global TypeScript types and interfaces
- API response types
- Third-party library type extensions

## ✨ Key Features
1. **Practice Module** - Virtual patient practice sessions
2. **Assessment Module** - Student assessments and progress
3. **Auth Module** - Login and registration
4. **Blog Module** - Educational content

## 📝 Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Files: kebab-case for routes, PascalCase for components
- Folders: kebab-case or camelCase consistently
