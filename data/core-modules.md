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

## User Interface Specifications

### Disease List Page

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

### Disease Detail Page

#### Tab Structure

| Tab | Content |
|-----|---------|
| **Details** | Title, description, affected crops, regional aliases, land relevance |
| **Remedies** | Linked organic remedies as clickable cards |
| **Videos** | Uploaded field videos |
| **Images** | Uploaded field images |

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
```
