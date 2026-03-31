# Organic Crop Disease & Natural Remedy Knowledge Platform

> **A comprehensive web platform for farmers in Telangana & Andhra Pradesh to identify organic crop diseases and discover natural remedies based on regional land types.**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Functional Modules](#core-functional-modules)
3. [User Interface Specifications](#user-interface-specifications)
4. [Backend Architecture](#backend-architecture)
5. [System Architecture Plan](#system-architecture-plan)
6. [Technical Requirements](#technical-requirements)
7. [Recommended Tech Stack (100% Free)](#recommended-tech-stack-100-free)
8. [Future Enhancements](#future-enhancements)

---

## Project Overview

### Vision

Build a **regional organic farming intelligence system** that serves as:

- A **Disease Knowledge Platform** — comprehensive database of crop diseases with visual identification
- An **Organic Remedy Preparation & Tracking System** — natural medicine guides with preparation tracking
- A **Shelf-life Safety Tracker** — automated alerts for remedy expiration

### Target Users

| User Type                | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| **Farmers**              | Primary users who upload disease data, track remedies, and manage preparations |
| **Agricultural Experts** | Contributors who validate disease information and remedies                     |
| **Admin**                | Platform managers who moderate content and manage system settings              |

### Key Constraints

- **Budget**: Must use only **free tools and platforms** for development and deployment
- **Accessibility**: Fully **mobile responsive** for field use
- **Localization**: **Multi-language** support (English & Telugu) is mandatory

---

## Core Functional Modules

### 1. Disease Knowledge System

A comprehensive database for crop disease identification and management.

#### Disease Entry Fields

| Field                 | Description                                | Required |
| --------------------- | ------------------------------------------ | -------- |
| **Title**             | Primary disease name                       | Yes      |
| **Description**       | Detailed symptoms and characteristics      | Yes      |
| **Affected Crops**    | List of crops vulnerable to this disease   | Yes      |
| **Organic Solutions** | Recommended natural treatments             | Yes      |
| **Regional Aliases**  | Local names across different regions       | No       |
| **Land Types**        | Applicable soil types                      | Yes      |
| **Media**             | Images and videos of diseased crops/leaves | Yes      |

#### User Capabilities

- Upload images or videos of diseased crops
- Provide disease details with organic solutions
- Tag diseases with relevant land types
- Add regional aliases for local searchability

---

### 2. Land Type System

Regional soil classification for personalized disease filtering.

#### Supported Land Types

| Land Type     | Common Regions          |
| ------------- | ----------------------- |
| Red Soil      | Telangana highlands     |
| Black Soil    | Deccan plateau areas    |
| Sandy Soil    | Coastal regions         |
| Alluvial Soil | River basin areas       |
| Laterite Soil | Eastern Ghats foothills |

> **Note**: Land type list is extendable for future regional expansion.

#### Functionality

- Users select a **default land type** during onboarding
- Selection persists across sessions
- All disease listings are **filtered by land relevance**
- Users can switch land type anytime from settings

---

### 3. Multi-Language Support

Mandatory localization for regional accessibility.

#### Supported Languages

- **English** (Primary)
- **Telugu** (Regional)

#### Implementation Requirements

- Single data source with multi-language field support
- Language toggle accessible from any screen
- All content (diseases, remedies, aliases, UI) translated
- Language preference persists per user session

---

### 4. Organic Remedy Knowledge System

A dedicated module for natural crop medicine preparation and usage.

#### Built-in Remedy Library

| Category           | Remedies                                   |
| ------------------ | ------------------------------------------ |
| **Neem-based**     | Neem Seed Kernel Extract, Neem Oil         |
| **Cow-based**      | Panchagavya, Jeevamrutham, Beejamrutham    |
| **Plant Extracts** | Chilli-Garlic Extract, Dashaparna Kashayam |
| **Fermented**      | Agniastra, Brahmastra                      |
| **Other Natural**  | Buttermilk Spray, Vermiwash                |

#### Remedy Detail Structure

Each remedy entry must include:

| Section                  | Content                                   |
| ------------------------ | ----------------------------------------- |
| **Description**          | What the remedy is and its origins        |
| **Preparation Method**   | Step-by-step preparation guide            |
| **Mode of Action**       | How the remedy works on pests/diseases    |
| **Target Usage**         | Diseases and crops it's effective against |
| **Benefits**             | Advantages over chemical alternatives     |
| **Application Method**   | How to apply (spray, drench, etc.)        |
| **Storage Instructions** | Proper storage conditions                 |
| **Shelf Life**           | Duration of effectiveness                 |

---

### 5. Remedy Lifecycle Tracking (Per User)

Personal tracking system for remedy preparation and expiration.

#### Tracking Fields

| Field                | Description                           |
| -------------------- | ------------------------------------- |
| **Remedy Name**      | Selected from library or custom       |
| **Preparation Date** | Date batch was prepared               |
| **Quantity**         | Amount prepared                       |
| **Shelf Life**       | Duration until expiry                 |
| **Expiry Date**      | Auto-calculated from preparation date |
| **Notes**            | User observations or modifications    |

#### Alert System

| Alert Type        | Trigger              | Action               |
| ----------------- | -------------------- | -------------------- |
| **Expiring Soon** | 3 days before expiry | Warning notification |
| **Expired**       | On expiry date       | Critical alert       |

---

### 6. Disease ↔ Remedy Mapping

Intelligent linking between diseases and recommended treatments.

#### Display Format

- Each disease detail page shows **Recommended Organic Remedies**
- Remedies displayed as **clickable cards** with:
    - Remedy name
    - Effectiveness indicator
    - Quick preview
- Click navigates to full **Remedy Detail Page**

---

## User Interface Specifications

### Home Page

```
┌─────────────────────────────────────────┐
│  [Land Type ▼]        [Language: EN/TE] │
├─────────────────────────────────────────┤
│  [🔍 Search diseases, crops, remedies]  │
├─────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  Image  │ │  Image  │ │  Image  │   │
│  │ Disease │ │ Disease │ │ Disease │   │
│  │  Name → │ │  Name → │ │  Name → │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  [Disease Grid - Scrollable]            │
└─────────────────────────────────────────┘
```

#### Components

- **Land Type Selector**: Persistent dropdown with saved preference
- **Language Toggle**: Switch between English and Telugu
- **Search Bar**: Unified search across diseases, crops, and remedies
- **Disease Grid**: Card-based display with image, name, and navigation arrow

---

### Disease Detail Page

#### Tab Structure

| Tab          | Content                                                              |
| ------------ | -------------------------------------------------------------------- |
| **Details**  | Title, description, affected crops, regional aliases, land relevance |
| **Remedies** | Linked organic remedies as clickable cards                           |
| **Media**    | Uploaded field videos and images                                     |

---

### Remedy Detail Page

#### Sections

- Preparation method (step-by-step)
- Mode of action
- Benefits and advantages
- Application instructions
- Storage guidelines
- Shelf life information

---

### My Preparations (User Dashboard)

#### Features

- Create custom crop medicine entries
- Log prepared batches with dates
- View expiry timeline
- Receive and manage alerts
- Add personal notes

---

## Backend Architecture

### Core Responsibilities

| Module                   | Functions                                        |
| ------------------------ | ------------------------------------------------ |
| **Media Service**        | Image/video upload, compression, storage         |
| **Localization Service** | Multi-language content management                |
| **Filter Engine**        | Land type and language-based filtering           |
| **Search Service**       | Full-text search across diseases, aliases, crops |
| **Mapping Service**      | Disease-remedy relationship management           |
| **Notification Service** | Expiry alerts and reminders                      |

### Search Capabilities

#### Search By

- Disease name (primary and aliases)
- Crop name
- Remedy name
- Symptoms/keywords

#### Filter By

- Land type
- Language
- Disease category
- Remedy type

### Data Model Considerations

```
User
├── preferences (language, land_type)
├── preparations[]
└── custom_remedies[]

Disease
├── translations{}
├── media[]
├── land_types[]
├── aliases[]
└── remedy_mappings[]

Remedy
├── translations{}
├── preparation_steps[]
├── target_diseases[]
└── shelf_life_days
```

---

## System Architecture Plan

This section provides a comprehensive technical blueprint for implementing the platform.

### High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Mobile Web    │  │   Desktop Web   │  │   PWA (Offline) │             │
│  │   (Responsive)  │  │   (Full View)   │  │   (Field Use)   │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┼────────────────────┘                       │
│                                ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    FRONTEND APPLICATION (SPA)                        │   │
│  │   React/Vue.js + Tailwind CSS + i18n (Telugu/English)               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS / REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │   Rate Limiting │ Authentication │ Request Validation │ CORS        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │   Disease    │ │   Remedy     │ │    User      │ │  Preparation │      │
│  │   Service    │ │   Service    │ │   Service    │ │   Service    │      │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │
│  │   Search     │ │   Media      │ │ Notification │ │    i18n      │      │
│  │   Service    │ │   Service    │ │   Service    │ │   Service    │      │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             DATA LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │    PostgreSQL    │  │  Object Storage  │  │   Redis Cache    │          │
│  │    (Supabase)    │  │   (Cloudinary)   │  │   (Optional)     │          │
│  │                  │  │                  │  │                  │          │
│  │  • Users         │  │  • Disease Images│  │  • Session Data  │          │
│  │  • Diseases      │  │  • Remedy Videos │  │  • Search Cache  │          │
│  │  • Remedies      │  │  • User Uploads  │  │  • API Responses │          │
│  │  • Preparations  │  │                  │  │                  │          │
│  │  • Translations  │  │                  │  │                  │          │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Component Architecture

#### Frontend Architecture

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LanguageToggle.tsx
│   │   ├── LandTypeSelector.tsx
│   │   ├── SearchBar.tsx
│   │   └── LoadingSpinner.tsx
│   ├── disease/
│   │   ├── DiseaseCard.tsx
│   │   ├── DiseaseGrid.tsx
│   │   ├── DiseaseDetail.tsx
│   │   └── DiseaseMediaGallery.tsx
│   ├── remedy/
│   │   ├── RemedyCard.tsx
│   │   ├── RemedyDetail.tsx
│   │   └── RemedySteps.tsx
│   └── preparation/
│       ├── PreparationForm.tsx
│       ├── PreparationList.tsx
│       ├── ExpiryTimeline.tsx
│       └── AlertBanner.tsx
├── pages/
│   ├── Home.tsx
│   ├── DiseaseList.tsx
│   ├── DiseaseDetail.tsx
│   ├── RemedyList.tsx
│   ├── RemedyDetail.tsx
│   ├── MyPreparations.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useLanguage.ts
│   ├── useLandType.ts
│   ├── useSearch.ts
│   └── usePreparations.ts
├── contexts/
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── LandTypeContext.tsx
├── services/
│   ├── api.ts
│   ├── diseaseService.ts
│   ├── remedyService.ts
│   ├── preparationService.ts
│   └── mediaService.ts
├── i18n/
│   ├── en.json
│   └── te.json
├── utils/
│   ├── dateUtils.ts
│   ├── expiryCalculator.ts
│   └── validators.ts
└── types/
    ├── disease.ts
    ├── remedy.ts
    ├── user.ts
    └── preparation.ts
```

#### Backend Architecture

```
src/
├── api/
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── disease.routes.ts
│   │   ├── remedy.routes.ts
│   │   ├── preparation.routes.ts
│   │   ├── search.routes.ts
│   │   └── media.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── disease.controller.ts
│   │   ├── remedy.controller.ts
│   │   ├── preparation.controller.ts
│   │   ├── search.controller.ts
│   │   └── media.controller.ts
│   └── middlewares/
│       ├── auth.middleware.ts
│       ├── validation.middleware.ts
│       ├── rateLimit.middleware.ts
│       └── upload.middleware.ts
├── services/
│   ├── disease.service.ts
│   ├── remedy.service.ts
│   ├── preparation.service.ts
│   ├── search.service.ts
│   ├── notification.service.ts
│   ├── media.service.ts
│   └── i18n.service.ts
├── models/
│   ├── user.model.ts
│   ├── disease.model.ts
│   ├── remedy.model.ts
│   ├── preparation.model.ts
│   └── translation.model.ts
├── utils/
│   ├── expiryCalculator.ts
│   ├── searchIndexer.ts
│   └── imageProcessor.ts
├── config/
│   ├── database.ts
│   ├── cloudinary.ts
│   └── auth.ts
└── jobs/
    ├── expiryChecker.job.ts
    └── notificationSender.job.ts
```

---

### Database Schema Design

#### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA (PostgreSQL)                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     users       │       │   user_prefs    │       │  preparations   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │       │ id (PK)         │
│ email           │  │    │ user_id (FK) ───┼───────│ user_id (FK)────│
│ password_hash   │  │    │ language        │       │ remedy_id (FK)  │
│ name            │  └────│ land_type_id(FK)│       │ prepared_date   │
│ phone           │       │ notifications   │       │ quantity        │
│ role            │       │ created_at      │       │ shelf_life_days │
│ created_at      │       │ updated_at      │       │ expiry_date     │
│ updated_at      │       └─────────────────┘       │ notes           │
└─────────────────┘                                 │ status          │
                                                    │ created_at      │
                                                    └─────────────────┘
          │
          │
          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   land_types    │       │    diseases     │       │disease_land_types│
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │◄──────│ id (PK)         │───────│ disease_id (FK) │
│ code            │       │ slug            │       │ land_type_id(FK)│
│ name_en         │       │ created_by (FK) │       └─────────────────┘
│ name_te         │       │ verified        │
│ description_en  │       │ created_at      │       ┌─────────────────┐
│ description_te  │       │ updated_at      │       │ disease_trans   │
│ regions         │       └─────────────────┘       ├─────────────────┤
└─────────────────┘               │                 │ id (PK)         │
                                  │                 │ disease_id (FK) │
                                  │                 │ language        │
                                  ▼                 │ title           │
┌─────────────────┐       ┌─────────────────┐       │ description     │
│    remedies     │       │disease_remedies │       │ symptoms        │
├─────────────────┤       ├─────────────────┤       │ solutions       │
│ id (PK)         │◄──────│ disease_id (FK) │       │ aliases[]       │
│ slug            │       │ remedy_id (FK)  │       └─────────────────┘
│ category        │       │ effectiveness   │
│ shelf_life_days │       └─────────────────┘       ┌─────────────────┐
│ created_at      │                                 │  remedy_trans   │
│ updated_at      │                                 ├─────────────────┤
└─────────────────┘                                 │ id (PK)         │
                                                    │ remedy_id (FK)  │
┌─────────────────┐       ┌─────────────────┐       │ language        │
│  disease_media  │       │    alerts       │       │ name            │
├─────────────────┤       ├─────────────────┤       │ description     │
│ id (PK)         │       │ id (PK)         │       │ preparation     │
│ disease_id (FK) │       │ user_id (FK)    │       │ mode_of_action  │
│ type (img/video)│       │ preparation_id  │       │ benefits        │
│ url             │       │ alert_type      │       │ application     │
│ thumbnail_url   │       │ scheduled_at    │       │ storage         │
│ caption_en      │       │ sent_at         │       └─────────────────┘
│ caption_te      │       │ status          │
│ order           │       └─────────────────┘
│ created_at      │
└─────────────────┘
```

#### Key Tables Definition

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    role VARCHAR(20) DEFAULT 'farmer' CHECK (role IN ('farmer', 'expert', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Land Types Table
CREATE TABLE land_types (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_te VARCHAR(100) NOT NULL,
    description_en TEXT,
    description_te TEXT,
    regions TEXT[],
    is_active BOOLEAN DEFAULT TRUE
);

-- Diseases Table
CREATE TABLE diseases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_by UUID REFERENCES users(id),
    verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disease Translations Table (Multi-language support)
CREATE TABLE disease_translations (
    id SERIAL PRIMARY KEY,
    disease_id UUID REFERENCES diseases(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'te')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    symptoms TEXT,
    solutions TEXT,
    aliases TEXT[],
    UNIQUE(disease_id, language)
);

-- Remedies Table
CREATE TABLE remedies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    shelf_life_days INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remedy Translations Table
CREATE TABLE remedy_translations (
    id SERIAL PRIMARY KEY,
    remedy_id UUID REFERENCES remedies(id) ON DELETE CASCADE,
    language VARCHAR(5) NOT NULL CHECK (language IN ('en', 'te')),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    preparation_steps JSONB NOT NULL,
    mode_of_action TEXT,
    benefits TEXT[],
    application_method TEXT,
    storage_instructions TEXT,
    UNIQUE(remedy_id, language)
);

-- User Preparations Table
CREATE TABLE preparations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    remedy_id UUID REFERENCES remedies(id),
    custom_remedy_name VARCHAR(200),
    prepared_date DATE NOT NULL,
    quantity VARCHAR(50),
    shelf_life_days INTEGER NOT NULL,
    expiry_date DATE GENERATED ALWAYS AS (prepared_date + shelf_life_days) STORED,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_disease_trans_lang ON disease_translations(language);
CREATE INDEX idx_remedy_trans_lang ON remedy_translations(language);
CREATE INDEX idx_preparations_user ON preparations(user_id);
CREATE INDEX idx_preparations_expiry ON preparations(expiry_date);
CREATE INDEX idx_disease_aliases ON disease_translations USING GIN(aliases);
```

---

### API Design Specification

#### RESTful API Endpoints

| Category         | Method | Endpoint                           | Description                    |
| ---------------- | ------ | ---------------------------------- | ------------------------------ |
| **Auth**         | POST   | `/api/auth/register`               | User registration              |
|                  | POST   | `/api/auth/login`                  | User login                     |
|                  | POST   | `/api/auth/logout`                 | User logout                    |
|                  | POST   | `/api/auth/refresh`                | Refresh access token           |
|                  | GET    | `/api/auth/me`                     | Get current user               |
| **Diseases**     | GET    | `/api/diseases`                    | List diseases (with filters)   |
|                  | GET    | `/api/diseases/:slug`              | Get disease detail             |
|                  | POST   | `/api/diseases`                    | Create disease (authenticated) |
|                  | PUT    | `/api/diseases/:id`                | Update disease                 |
|                  | DELETE | `/api/diseases/:id`                | Delete disease (admin)         |
| **Remedies**     | GET    | `/api/remedies`                    | List all remedies              |
|                  | GET    | `/api/remedies/:slug`              | Get remedy detail              |
|                  | GET    | `/api/remedies/category/:category` | Get remedies by category       |
| **Preparations** | GET    | `/api/preparations`                | Get user preparations          |
|                  | POST   | `/api/preparations`                | Create preparation             |
|                  | PUT    | `/api/preparations/:id`            | Update preparation             |
|                  | DELETE | `/api/preparations/:id`            | Delete preparation             |
|                  | GET    | `/api/preparations/expiring`       | Get expiring preparations      |
| **Search**       | GET    | `/api/search`                      | Unified search                 |
|                  | GET    | `/api/search/diseases`             | Search diseases                |
|                  | GET    | `/api/search/remedies`             | Search remedies                |
| **Media**        | POST   | `/api/media/upload`                | Upload image/video             |
|                  | DELETE | `/api/media/:id`                   | Delete media                   |
| **Land Types**   | GET    | `/api/land-types`                  | List all land types            |
| **User**         | GET    | `/api/user/preferences`            | Get user preferences           |
|                  | PUT    | `/api/user/preferences`            | Update preferences             |

#### API Request/Response Examples

```json
// GET /api/diseases?landType=red-soil&language=te&page=1&limit=10

// Response
{
    "success": true,
    "data": {
        "diseases": [
            {
                "id": "uuid-123",
                "slug": "leaf-blight",
                "title": "ఆకు కుళ్ళు",
                "description": "వరి, జొన్నలలో...",
                "symptoms": "ఆకుల పసుపు మచ్చలు...",
                "affectedCrops": ["వరి", "జొన్నల"],
                "landTypes": ["red-soil", "black-soil"],
                "primaryImage": "https://cdn.example.com/diseases/leaf-blight.jpg",
                "remedies": [
                    {
                        "id": "uuid-456",
                        "slug": "neem-oil",
                        "name": "వేప నూనె",
                        "effectiveness": "high"
                    }
                ],
                "verified": true
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 45,
            "totalPages": 5
        }
    }
}
```

```json
// POST /api/preparations
// Request
{
  "remedyId": "uuid-456",
  "customRemedyName": null,
  "preparedDate": "2026-02-23",
  "quantity": "5 liters",
  "shelfLifeDays": 15,
  "notes": "Prepared for paddy field application"
}

// Response
{
  "success": true,
  "data": {
    "id": "uuid-789",
    "remedyId": "uuid-456",
    "remedyName": "Neem Oil",
    "preparedDate": "2026-02-23",
    "expiryDate": "2026-03-10",
    "quantity": "5 liters",
    "status": "active",
    "daysUntilExpiry": 15
  }
}
```

---

### Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │    User      │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│Email/Password │ │  Google OAuth │ │  Phone OTP    │
│   Register    │ │    Login      │ │   (Future)    │
└───────┬───────┘ └───────┬───────┘ └───────────────┘
        │                 │
        └────────┬────────┘
                 ▼
        ┌────────────────┐
        │ Supabase Auth  │
        │                │
        │ • JWT Tokens   │
        │ • Session Mgmt │
        │ • Role Claims  │
        └───────┬────────┘
                │
                ▼
        ┌────────────────┐
        │  Access Token  │──────────────────┐
        │  (15 min TTL)  │                  │
        └────────────────┘                  │
                                            ▼
        ┌────────────────┐         ┌────────────────┐
        │ Refresh Token  │         │   API Request  │
        │  (7 day TTL)   │         │  with Bearer   │
        └────────────────┘         │     Token      │
                                   └───────┬────────┘
                                           │
                                           ▼
                                   ┌────────────────┐
                                   │ Auth Middleware│
                                   │                │
                                   │ • Verify JWT   │
                                   │ • Check Expiry │
                                   │ • Extract User │
                                   │ • Check Role   │
                                   └───────┬────────┘
                                           │
                              ┌────────────┼────────────┐
                              │            │            │
                              ▼            ▼            ▼
                        ┌─────────┐  ┌─────────┐  ┌─────────┐
                        │ Farmer  │  │ Expert  │  │  Admin  │
                        │  Role   │  │  Role   │  │  Role   │
                        └─────────┘  └─────────┘  └─────────┘
```

#### Role-Based Access Control (RBAC)

| Resource            | Farmer   | Expert   | Admin |
| ------------------- | -------- | -------- | ----- |
| View diseases       | ✓        | ✓        | ✓     |
| Create disease      | ✓        | ✓        | ✓     |
| Verify disease      | ✗        | ✓        | ✓     |
| Delete disease      | Own only | Own only | ✓     |
| View remedies       | ✓        | ✓        | ✓     |
| Create remedy       | ✗        | ✓        | ✓     |
| Manage preparations | Own only | Own only | ✓     |
| Manage users        | ✗        | ✗        | ✓     |
| View analytics      | ✗        | ✗        | ✓     |

---

### Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CACHING ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  CDN Cache  │────▶│  App Cache  │────▶│  Database   │
│  (Browser)  │     │ (Cloudflare)│     │ (In-Memory) │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘

Cache Layers:

1. Browser Cache (Client-side)
   ├── Static assets (JS, CSS, images): 1 year
   ├── API responses (GET): 5 minutes
   └── User preferences: Session storage

2. CDN Cache (Edge)
   ├── Static pages: 1 hour
   ├── Disease images: 24 hours
   └── API responses: Bypass (dynamic)

3. Application Cache (In-Memory/Redis)
   ├── Disease list by land type: 15 minutes
   ├── Remedy list: 1 hour
   ├── Search results: 5 minutes
   └── User session: 30 minutes

Cache Invalidation Strategy:
├── Time-based expiry (TTL)
├── Event-based invalidation (on write)
└── Manual purge (admin action)
```

---

### Notification System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NOTIFICATION SYSTEM                                  │
└─────────────────────────────────────────────────────────────────────────────┘

             ┌─────────────────┐
             │   Cron Job      │
             │ (Daily at 6 AM) │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Expiry Checker │
             │     Service     │
             └────────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ 3 Days   │ │  Today   │ │ Already  │
   │  Away    │ │  Expiry  │ │ Expired  │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │ Warning  │ │ Critical │ │ Expired  │
   │  Alert   │ │  Alert   │ │  Alert   │
   └────┬─────┘ └────┬─────┘ └────┬─────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
             ┌─────────────────┐
             │ Notification    │
             │    Queue        │
             └────────┬────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │  In-App  │ │   Push   │ │   Email  │
   │  Alert   │ │ (Future) │ │ (Future) │
   └──────────┘ └──────────┘ └──────────┘
```

---

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT ARCHITECTURE (FREE TIER)                    │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   Cloudflare    │
                              │   (DNS + CDN)   │
                              │      FREE       │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
           ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
           │     Vercel      │ │   Supabase      │ │   Cloudinary    │
           │   (Frontend)    │ │  (Backend/DB)   │ │   (Media CDN)   │
           │                 │ │                 │ │                 │
           │  • React SPA    │ │  • PostgreSQL   │ │  • Image Store  │
           │  • Edge Network │ │  • Auth         │ │  • Video Store  │
           │  • Auto SSL     │ │  • REST API     │ │  • Transform    │
           │  • Preview URLs │ │  • Realtime     │ │  • Optimization │
           │                 │ │  • Edge Funcs   │ │                 │
           │  FREE: 100GB/mo │ │  FREE: 500MB DB │ │  FREE: 25 GB    │
           └─────────────────┘ └─────────────────┘ └─────────────────┘
                    │                  │                  │
                    │                  │                  │
                    ▼                  ▼                  ▼
           ┌─────────────────────────────────────────────────────────┐
           │                    MONITORING STACK                     │
           ├─────────────────────────────────────────────────────────┤
           │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
           │  │   Sentry    │  │  Supabase   │  │  Vercel     │     │
           │  │  (Errors)   │  │  Dashboard  │  │  Analytics  │     │
           │  │   FREE      │  │    FREE     │  │    FREE     │     │
           │  └─────────────┘  └─────────────┘  └─────────────┘     │
           └─────────────────────────────────────────────────────────┘
```

#### Environment Configuration

```bash
# Frontend (.env)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyxxx
VITE_CLOUDINARY_CLOUD_NAME=your-cloud
VITE_API_BASE_URL=https://xxx.supabase.co/functions/v1

# Supabase Edge Functions (.env)
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

### CI/CD Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CI/CD PIPELINE                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Code      │    │   GitHub     │    │    Vercel    │    │  Production  │
│    Push      │───▶│   Actions    │───▶│   Preview    │───▶│   Deploy     │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  CI Checks:  │
                    │              │
                    │ • Lint       │
                    │ • Type Check │
                    │ • Unit Tests │
                    │ • Build      │
                    └──────────────┘

Branch Strategy:
├── main (production) ──────────▶ vercel.app
├── develop (staging) ──────────▶ staging.vercel.app
└── feature/* (preview) ────────▶ preview-xxx.vercel.app
```

---

### Performance Optimization Strategies

| Area             | Strategy                                  | Target           |
| ---------------- | ----------------------------------------- | ---------------- |
| **Initial Load** | Code splitting, lazy loading              | < 3s on 3G       |
| **Images**       | WebP format, responsive images, lazy load | LCP < 2.5s       |
| **API Calls**    | Request batching, caching, pagination     | < 200ms response |
| **Bundle Size**  | Tree shaking, compression, minification   | < 200KB gzipped  |
| **Database**     | Indexed queries, connection pooling       | < 100ms query    |
| **PWA**          | Service worker, offline caching           | Offline access   |

#### Lighthouse Targets

| Metric         | Target Score      |
| -------------- | ----------------- |
| Performance    | > 90              |
| Accessibility  | > 95              |
| Best Practices | > 95              |
| SEO            | > 90              |
| PWA            | Pass all criteria |

---

### Error Handling & Logging

```typescript
// Global Error Handler Structure
interface AppError {
  code: string;
  message: string;
  messageKey: string;  // i18n key for translated message
  statusCode: number;
  details?: object;
  timestamp: string;
  requestId: string;
}

// Error Response Format
{
  "success": false,
  "error": {
    "code": "DISEASE_NOT_FOUND",
    "message": "The requested disease does not exist",
    "messageKey": "errors.disease.notFound",
    "statusCode": 404,
    "requestId": "req_abc123",
    "timestamp": "2026-02-23T10:30:00Z"
  }
}

// Logging Levels
enum LogLevel {
  DEBUG = 'debug',   // Development only
  INFO = 'info',     // General operations
  WARN = 'warn',     // Potential issues
  ERROR = 'error',   // Errors needing attention
  FATAL = 'fatal'    // Critical system failures
}
```

---

### Security Implementation Checklist

| Category             | Implementation                              | Status   |
| -------------------- | ------------------------------------------- | -------- |
| **Authentication**   | JWT with short expiry + refresh tokens      | Required |
| **Password**         | bcrypt hashing (10+ rounds)                 | Required |
| **Input Validation** | Zod/Yup schema validation                   | Required |
| **SQL Injection**    | Parameterized queries (Supabase handles)    | Required |
| **XSS**              | Content Security Policy, output encoding    | Required |
| **CSRF**             | SameSite cookies, token validation          | Required |
| **File Upload**      | Type validation, size limits, virus scan    | Required |
| **Rate Limiting**    | 100 req/min per IP (API), 10 req/min (auth) | Required |
| **HTTPS**            | Enforced via Vercel/Cloudflare              | Required |
| **Headers**          | HSTS, X-Frame-Options, X-Content-Type       | Required |
| **Secrets**          | Environment variables, no hardcoding        | Required |
| **Audit Logs**       | Track sensitive operations                  | Phase 2  |

---

## Technical Requirements

### Architecture Approach: Hybrid

The platform uses a **Hybrid Architecture** — combining Supabase BaaS for data/auth with a custom API layer for complex logic. This approach was chosen for:

- **Speed**: Auto-generated CRUD APIs from Supabase (zero backend code for simple operations)
- **Security**: Server-side validation and role enforcement via custom API routes
- **AI-Ready**: Custom API layer serves as the plug-in point for future AI features
- **Free**: All services stay within free tier limits

```
┌──────────────┐    ┌──────────────────────────────────────┐
│              │    │            SUPABASE (BaaS)            │
│              │───▶│  • Auto REST API (Simple CRUD)        │
│   React      │    │  • PostgreSQL Database                │
│   Frontend   │    │  • Authentication (JWT + OAuth)       │
│   (Vite)     │    │  • Realtime Subscriptions             │
│              │    └──────────────────────────────────────┘
│              │
│              │    ┌──────────────────────────────────────┐
│              │───▶│     VERCEL API ROUTES (Serverless)    │
│              │    │  • Complex Business Logic              │
│              │    │  • Role-Based Access Control            │
│              │    │  • Expiry Alert Cron Jobs               │
│              │    │  • AI Endpoints (Future)                │
└──────────────┘    └──────────────────────────────────────┘
```

#### Request Routing Strategy

| Operation                  | Route To                    | Reason                              |
| -------------------------- | --------------------------- | ----------------------------------- |
| Disease/Remedy listing     | **Supabase Direct**         | Simple CRUD, auto API               |
| Search (full-text)         | **Supabase Direct**         | PostgreSQL FTS built-in             |
| Create disease (by expert) | **Custom API**              | Role check + validation + audit     |
| Create preparation         | **Custom API**              | Expiry calculation + business rules |
| Expiry alert check         | **Vercel Cron**             | Scheduled background job            |
| User signup/login          | **Supabase Auth**           | Built-in auth                       |
| Image upload               | **Cloudinary**              | Optimized media storage             |
| AI features (future)       | **Custom API → AI Service** | Isolated, pluggable                 |

### Deployment Constraints

| Requirement        | Specification                                                         |
| ------------------ | --------------------------------------------------------------------- |
| **Cost**           | Free tier only (no paid services)                                     |
| **Responsiveness** | Mobile-first, works on low-end devices                                |
| **Offline**        | Consider PWA for limited offline access                               |
| **Performance**    | Fast load times on 3G connections                                     |
| **Architecture**   | Hybrid (Supabase BaaS + Vercel API Routes)                            |
| **AI-Ready**       | Custom API layer supports future AI integration with zero refactoring |

---

## Recommended Tech Stack (100% Free)

This section provides a detailed breakdown of the recommended technology stack, optimized for zero-cost deployment while maintaining production-quality capabilities.

### Stack Overview (Hybrid Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HYBRID TECH STACK (100% FREE)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   FRONTEND          BACKEND (BaaS)    BACKEND (Custom)  DATABASE           │
│   ─────────         ──────────────    ────────────────  ────────           │
│   React 19          Supabase          Vercel API Routes PostgreSQL         │
│   TypeScript        Auto REST API     (Serverless)      (via Supabase)     │
│   Tailwind CSS      Edge Functions    Business Logic                       │
│   Vite              Row Level Sec.    Role Enforcement                     │
│                                       Cron Jobs                            │
│                                                                             │
│   MEDIA             AUTH              MONITORING        ADDITIONAL         │
│   ─────             ────              ──────────        ──────────         │
│   Cloudinary        Supabase Auth     Sentry            react-i18next      │
│                     (JWT + OAuth)     Vercel Analytics   Zod (Validation)  │
│                                                         React Query        │
│                                                                             │
│   INFRASTRUCTURE    AI-READY (Future)                                      │
│   ──────────────    ─────────────────                                      │
│   Vercel (Hosting)  /api/ai/* routes                                       │
│   Cloudflare (CDN)  HuggingFace (FREE)                                    │
│   GitHub (CI/CD)    Google Gemini (FREE)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Data Flow:
  Simple CRUD ──────▶ Supabase Auto API (zero backend code)
  Complex Logic ────▶ Vercel API Routes (serverless functions)
  AI Features ──────▶ Vercel API Routes → External AI APIs (future)
```

---

### Frontend Stack

#### React 19 + TypeScript + Vite

| Aspect             | Details                                                                         |
| ------------------ | ------------------------------------------------------------------------------- |
| **Why React**      | Largest ecosystem, extensive community support, excellent Telugu/i18n libraries |
| **Why TypeScript** | Type safety reduces bugs, better IDE support, self-documenting code             |
| **Why Vite**       | Lightning-fast HMR, optimized builds, modern ES modules                         |
| **Cost**           | **FREE** (Open source)                                                          |

```bash
# Project initialization
npm create vite@latest crop-disease-platform -- --template react-ts
```

**Key Dependencies:**

| Package                 | Purpose                          | Size  |
| ----------------------- | -------------------------------- | ----- |
| `react-router-dom`      | Client-side routing              | ~15KB |
| `@tanstack/react-query` | Server state management, caching | ~35KB |
| `react-i18next`         | Multi-language support (EN/TE)   | ~20KB |
| `zustand`               | Lightweight global state         | ~2KB  |
| `react-hook-form`       | Form handling                    | ~25KB |
| `zod`                   | Schema validation                | ~12KB |

---

#### Tailwind CSS

| Aspect           | Details                                                   |
| ---------------- | --------------------------------------------------------- |
| **Why Tailwind** | Utility-first, mobile-responsive, small production bundle |
| **RTL Support**  | Built-in for future Telugu script needs                   |
| **Cost**         | **FREE** (Open source)                                    |

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Recommended Plugins:**

| Plugin                    | Purpose                     |
| ------------------------- | --------------------------- |
| `@tailwindcss/forms`      | Better form element styling |
| `@tailwindcss/typography` | Rich text/prose styling     |
| `tailwind-merge`          | Efficient class merging     |
| `clsx`                    | Conditional class names     |

---

### Backend Stack

#### Supabase (Backend-as-a-Service)

| Aspect               | Details                                                                          |
| -------------------- | -------------------------------------------------------------------------------- |
| **What it provides** | PostgreSQL database, REST API, Authentication, Edge Functions, Realtime, Storage |
| **Why Supabase**     | All-in-one solution, generous free tier, open source, excellent docs             |
| **Cost**             | **FREE**                                                                         |

**Free Tier Limits:**

| Resource                    | Limit          |
| --------------------------- | -------------- |
| Database                    | 500 MB         |
| Storage                     | 1 GB           |
| Bandwidth                   | 2 GB/month     |
| Edge Function Invocations   | 500K/month     |
| Monthly Active Users (Auth) | Unlimited      |
| API Requests                | Unlimited      |
| Realtime connections        | 200 concurrent |

```typescript
// Supabase client initialization
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
)
```

---

#### Supabase Edge Functions (Serverless)

| Aspect         | Details                                                    |
| -------------- | ---------------------------------------------------------- |
| **Runtime**    | Deno (TypeScript native)                                   |
| **Use Cases**  | Complex business logic, external API calls, scheduled jobs |
| **Cold Start** | ~50ms (very fast)                                          |
| **Cost**       | **FREE** (500K invocations/month)                          |

```typescript
// Example: Expiry notification checker
// supabase/functions/check-expiry/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    const { data: expiringPreps } = await supabase
        .from('preparations')
        .select('*, users(email)')
        .lte('expiry_date', threeDaysFromNow.toISOString())
        .eq('status', 'active')

    // Queue notifications...

    return new Response(JSON.stringify({ processed: expiringPreps?.length }))
})
```

---

### Database

#### PostgreSQL (via Supabase)

| Aspect         | Details                                     |
| -------------- | ------------------------------------------- |
| **Version**    | PostgreSQL 15                               |
| **Extensions** | pg_trgm (fuzzy search), uuid-ossp, pgcrypto |
| **Backup**     | Daily automatic backups (7-day retention)   |
| **Cost**       | **FREE** (500MB included)                   |

**Why PostgreSQL over Alternatives:**

| Feature              | PostgreSQL        | MongoDB        | MySQL   |
| -------------------- | ----------------- | -------------- | ------- |
| JSON support         | ✓ JSONB (indexed) | ✓ Native       | Limited |
| Full-text search     | ✓ Built-in        | ✓ Atlas Search | Limited |
| Array columns        | ✓ Native          | ✓ Native       | ✗       |
| Row Level Security   | ✓ Built-in        | ✗              | ✗       |
| Free tier (Supabase) | 500MB             | 512MB          | 1GB     |

**Row Level Security (RLS) Example:**

```sql
-- Users can only see their own preparations
ALTER TABLE preparations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own preparations" ON preparations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users create own preparations" ON preparations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own preparations" ON preparations
  FOR UPDATE USING (auth.uid() = user_id);
```

---

### Authentication

#### Supabase Auth

| Aspect      | Details                                             |
| ----------- | --------------------------------------------------- |
| **Methods** | Email/Password, Magic Link, Google OAuth, Phone OTP |
| **JWT**     | Auto-generated, 1-hour expiry, refresh tokens       |
| **MFA**     | Available (TOTP)                                    |
| **Cost**    | **FREE** (Unlimited MAU)                            |

```typescript
// Authentication examples
import { supabase } from './supabaseClient'

// Email/Password signup
const { data, error } = await supabase.auth.signUp({
    email: 'farmer@example.com',
    password: 'securepassword',
    options: {
        data: {
            name: 'రాము',
            preferred_language: 'te',
            land_type: 'red-soil',
        },
    },
})

// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        redirectTo: `${window.location.origin}/auth/callback`,
    },
})

// Get current user
const {
    data: { user },
} = await supabase.auth.getUser()
```

---

### Media Storage & CDN

#### Cloudinary

| Aspect             | Details                                                 |
| ------------------ | ------------------------------------------------------- |
| **Purpose**        | Image/video upload, transformation, CDN delivery        |
| **Why Cloudinary** | Auto-optimization, format conversion, responsive images |
| **Cost**           | **FREE**                                                |

**Free Tier Limits:**

| Resource         | Limit                    |
| ---------------- | ------------------------ |
| Storage          | 25 GB                    |
| Bandwidth        | 25 GB/month              |
| Transformations  | 25K/month                |
| Video processing | 500 video-on-demand mins |

```typescript
// Cloudinary upload widget integration
import { Cloudinary } from "@cloudinary/url-gen"
import { AdvancedImage } from "@cloudinary/react"
import { fill } from "@cloudinary/url-gen/actions/resize"
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity"
import { format, quality } from "@cloudinary/url-gen/actions/delivery"
import { auto } from "@cloudinary/url-gen/qualifiers/format"
import { auto as autoQuality } from "@cloudinary/url-gen/qualifiers/quality"

const cld = new Cloudinary({
  cloud: { cloudName: 'your-cloud-name' }
})

// Optimized disease image
const diseaseImage = cld
  .image('diseases/leaf-blight')
  .resize(fill().width(400).height(300).gravity(autoGravity()))
  .delivery(format(auto()))
  .delivery(quality(autoQuality()))

// Component usage
<AdvancedImage cldImg={diseaseImage} alt="Leaf Blight" />
```

**Image Transformation Examples:**

| Use Case   | Transformation                     | Result                |
| ---------- | ---------------------------------- | --------------------- |
| Thumbnail  | `c_thumb,w_150,h_150`              | 150x150 crop          |
| Card image | `c_fill,w_400,h_300,q_auto,f_auto` | Auto-quality WebP     |
| Full view  | `c_limit,w_1200,q_auto,f_auto`     | Max 1200px, optimized |
| Mobile     | `c_fill,w_300,dpr_2.0`             | Retina-ready          |

---

### Hosting & Deployment

#### Vercel (Frontend Hosting)

| Aspect       | Details                                                |
| ------------ | ------------------------------------------------------ |
| **Features** | Edge network, auto SSL, preview deployments, analytics |
| **Build**    | Automatic from GitHub push                             |
| **Cost**     | **FREE**                                               |

**Free Tier Limits:**

| Resource                      | Limit              |
| ----------------------------- | ------------------ |
| Bandwidth                     | 100 GB/month       |
| Serverless Function Execution | 100 GB-hours/month |
| Build Minutes                 | 6,000/month        |
| Deployments                   | Unlimited          |
| Team Members                  | 1                  |

```json
// vercel.json configuration
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
    "headers": [
        {
            "source": "/assets/(.*)",
            "headers": [
                {
                    "key": "Cache-Control",
                    "value": "public, max-age=31536000, immutable"
                }
            ]
        }
    ]
}
```

---

#### Cloudflare (DNS & CDN)

| Aspect             | Details                                      |
| ------------------ | -------------------------------------------- |
| **Features**       | Global CDN, DDoS protection, SSL, caching    |
| **Why Cloudflare** | Additional caching layer, security, free SSL |
| **Cost**           | **FREE**                                     |

**Free Tier Features:**

- Unlimited bandwidth
- Global CDN (275+ cities)
- SSL/TLS encryption
- DDoS protection
- 3 page rules
- Basic analytics

---

### Internationalization (i18n)

#### react-i18next

| Aspect             | Details                                                |
| ------------------ | ------------------------------------------------------ |
| **Features**       | Lazy loading, namespaces, pluralization, interpolation |
| **Telugu support** | Full Unicode support                                   |
| **Cost**           | **FREE** (Open source)                                 |

```typescript
// i18n configuration
// src/i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import te from './locales/te.json'

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            te: { translation: te },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
```

```json
// src/i18n/locales/en.json
{
    "common": {
        "appName": "Organic Crop Health",
        "search": "Search diseases, crops, remedies...",
        "landType": "Land Type",
        "language": "Language"
    },
    "diseases": {
        "title": "Crop Diseases",
        "symptoms": "Symptoms",
        "affectedCrops": "Affected Crops",
        "remedies": "Recommended Remedies"
    },
    "preparations": {
        "title": "My Preparations",
        "preparedOn": "Prepared on",
        "expiresOn": "Expires on",
        "daysLeft": "{{count}} day left",
        "daysLeft_plural": "{{count}} days left",
        "expired": "Expired"
    }
}
```

```json
// src/i18n/locales/te.json
{
    "common": {
        "appName": "సేంద్రీయ పంట ఆరోగ్యం",
        "search": "వ్యాధులు, పంటలు, మందుల కోసం వెతకండి...",
        "landType": "భూమి రకం",
        "language": "భాష"
    },
    "diseases": {
        "title": "పంట వ్యాధులు",
        "symptoms": "లక్షణాలు",
        "affectedCrops": "ప్రభావిత పంటలు",
        "remedies": "సిఫార్సు చేసిన మందులు"
    },
    "preparations": {
        "title": "నా తయారీలు",
        "preparedOn": "తయారు చేసిన తేదీ",
        "expiresOn": "గడువు తేదీ",
        "daysLeft": "{{count}} రోజు మిగిలింది",
        "daysLeft_plural": "{{count}} రోజులు మిగిలినవి",
        "expired": "గడువు ముగిసింది"
    }
}
```

---

### Monitoring & Analytics

#### Sentry (Error Tracking)

| Aspect       | Details                                                  |
| ------------ | -------------------------------------------------------- |
| **Features** | Error tracking, performance monitoring, release tracking |
| **Cost**     | **FREE**                                                 |

**Free Tier Limits:**

| Resource                 | Limit        |
| ------------------------ | ------------ |
| Errors                   | 5,000/month  |
| Performance transactions | 10,000/month |
| Team members             | Unlimited    |
| Data retention           | 30 days      |

```typescript
// Sentry initialization
import * as Sentry from '@sentry/react'

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
    ],
    tracesSampleRate: 0.1, // 10% of transactions
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
})
```

---

#### Vercel Analytics

| Aspect       | Details                                             |
| ------------ | --------------------------------------------------- |
| **Features** | Real user metrics, Core Web Vitals, geographic data |
| **Cost**     | **FREE** (2,500 events/month on Hobby)              |

```typescript
// Enable in React app
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
    </>
  )
}
```

---

### Development Tools (All Free)

| Tool                | Purpose                | Cost              |
| ------------------- | ---------------------- | ----------------- |
| **VS Code**         | Code editor            | FREE              |
| **GitHub**          | Version control, CI/CD | FREE              |
| **Figma**           | UI/UX design           | FREE (3 projects) |
| **Postman**         | API testing            | FREE              |
| **TablePlus**       | Database GUI           | FREE (limited)    |
| **Supabase Studio** | Database management    | FREE (included)   |
| **Chrome DevTools** | Debugging, performance | FREE              |
| **Lighthouse**      | Performance auditing   | FREE              |

---

### CI/CD Pipeline (GitHub Actions)

| Aspect      | Details                               |
| ----------- | ------------------------------------- |
| **Trigger** | Push to main/develop, Pull requests   |
| **Jobs**    | Lint, Type check, Test, Build, Deploy |
| **Cost**    | **FREE** (2,000 mins/month)           |

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
    push:
        branches: [main, develop]
    pull_request:
        branches: [main]

jobs:
    quality:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '20'
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Lint
              run: npm run lint

            - name: Type check
              run: npm run type-check

            - name: Run tests
              run: npm run test

            - name: Build
              run: npm run build
              env:
                  VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
                  VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}

    # Vercel handles deployment automatically via GitHub integration
```

---

### Complete Package.json

```json
{
    "name": "crop-disease-platform",
    "private": true,
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "type-check": "tsc --noEmit",
        "test": "vitest",
        "test:coverage": "vitest --coverage"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.22.0",
        "@supabase/supabase-js": "^2.39.0",
        "@tanstack/react-query": "^5.17.0",
        "@cloudinary/url-gen": "^1.14.0",
        "@cloudinary/react": "^1.11.0",
        "react-i18next": "^14.0.0",
        "i18next": "^23.7.0",
        "i18next-browser-languagedetector": "^7.2.0",
        "zustand": "^4.4.0",
        "react-hook-form": "^7.49.0",
        "@hookform/resolvers": "^3.3.0",
        "zod": "^3.22.0",
        "date-fns": "^3.2.0",
        "clsx": "^2.1.0",
        "tailwind-merge": "^2.2.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@vitejs/plugin-react": "^4.2.0",
        "typescript": "^5.3.0",
        "vite": "^5.0.0",
        "vitest": "^1.2.0",
        "tailwindcss": "^3.4.0",
        "postcss": "^8.4.0",
        "autoprefixer": "^10.4.0",
        "eslint": "^8.56.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "@typescript-eslint/eslint-plugin": "^6.19.0",
        "@typescript-eslint/parser": "^6.19.0",
        "@sentry/react": "^7.99.0"
    }
}
```

---

### Free Tier Summary

| Service        | Free Tier Limits                     | Sufficient For     |
| -------------- | ------------------------------------ | ------------------ |
| **Supabase**   | 500MB DB, 1GB storage, 2GB bandwidth | 10K+ users         |
| **Cloudinary** | 25GB storage, 25GB bandwidth         | 50K+ images        |
| **Vercel**     | 100GB bandwidth, unlimited deploys   | 100K+ visits/month |
| **Cloudflare** | Unlimited bandwidth, CDN             | Unlimited          |
| **Sentry**     | 5K errors/month                      | MVP-scale          |
| **GitHub**     | Unlimited repos, 2K CI mins          | Full development   |

**Estimated Monthly Capacity (Free Tier):**

- **Users**: 5,000+ active users
- **Diseases**: 500+ disease entries
- **Images**: 10,000+ uploaded images
- **API Calls**: 1,000,000+ requests
- **Page Views**: 100,000+ views

---

### Alternative Stack Options

If primary choices don't fit, consider these alternatives:

| Layer        | Primary               | Alternative 1     | Alternative 2     |
| ------------ | --------------------- | ----------------- | ----------------- |
| **Frontend** | React + Vite          | Next.js           | Vue 3 + Vite      |
| **Backend**  | Supabase              | Firebase          | PocketBase        |
| **Database** | PostgreSQL (Supabase) | MongoDB Atlas     | PlanetScale       |
| **Storage**  | Cloudinary            | Supabase Storage  | Uploadcare        |
| **Hosting**  | Vercel                | Netlify           | Cloudflare Pages  |
| **Auth**     | Supabase Auth         | Clerk (free tier) | Auth0 (free tier) |

### Security Considerations

- **Authentication**: Supabase Auth (JWT + OAuth) for all user sessions
- **Server-Side Validation**: Zod schema validation in Vercel API routes (not bypassable)
- **Row Level Security**: Supabase RLS policies for simple CRUD data access
- **Role Enforcement**: Custom middleware in API routes for expert/admin operations
- **Media Restrictions**: File type validation and size limits (10MB images, 50MB videos)
- **Rate Limiting**: Applied at API route level (100 req/min per IP)
- **HTTPS**: Enforced via Vercel and Cloudflare
- **Audit Logging**: Server-side tracking of sensitive operations (disease create/delete, admin actions)

---

## Future Enhancements

### Phase 2: AI-Powered Features

#### Image-Based Disease Detection

- User uploads or captures photo of affected crop
- AI model analyzes image patterns
- System suggests possible diseases with confidence scores
- Links to relevant remedies automatically

### Phase 3: Extended Localization

#### Additional Languages

- Hindi
- Tamil
- Kannada
- Marathi

### Phase 4: Smart Notifications

#### Multi-Channel Alerts

| Channel  | Status  | Use Case               |
| -------- | ------- | ---------------------- |
| In-app   | Phase 1 | Immediate alerts       |
| SMS      | Future  | Critical expiry alerts |
| WhatsApp | Future  | Rich media reminders   |

### Phase 5: Community Features

- Expert verification badges
- User ratings on remedies
- Community forums
- Success story sharing

---

## Success Metrics

| Metric               | Target                           |
| -------------------- | -------------------------------- |
| **User Adoption**    | 1,000+ active farmers in Year 1  |
| **Content Coverage** | 100+ diseases, 50+ remedies      |
| **User Retention**   | 40% monthly active users         |
| **Mobile Usage**     | 80%+ traffic from mobile devices |

---

## Summary

This platform transforms traditional organic farming knowledge into an accessible digital resource, empowering farmers in Telangana and Andhra Pradesh with:

- **Easy disease identification** through visual and text-based search
- **Proven organic remedies** with detailed preparation guides
- **Personal tracking** for remedy preparation and shelf-life management
- **Regional relevance** through land type filtering and local language support

> **Final Goal**: Become the go-to digital companion for organic farmers in South India.
