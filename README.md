# Stayly 🏨

### Modern Multi-Hotel Booking Platform

Stayly is a modern, responsive hotel booking platform built with **React, TypeScript, and Tailwind CSS**.

The project simulates a real-world hotel booking experience where users can discover hotels, search and filter properties, view detailed hotel information, select rooms, complete a multi-step booking flow, and manage their reservations.

Built as a portfolio project with a strong focus on **scalable frontend architecture, type safety, state management, accessibility, responsive design, and realistic booking flows**.

---

## 🚀 Live Demo

[View Live Demo](https://staylybooking.netlify.app/)

---

## 📸 Preview

![Stayly Preview](./public/stayly-preview.png)

---

## ✨ Features

### 🔎 Hotel Discovery

- Search hotels by destination
- URL-persisted search filters
- Price range filtering
- Star rating filtering
- Guest rating filtering
- Property type filtering
- Amenity filtering
- Location filtering
- Sorting and pagination
- Shareable and bookmarkable search URLs

### 🏨 Hotel Details

- Hotel image gallery
- Property information
- Room types and pricing
- Amenities
- Guest reviews
- Location information
- Room availability information

### 🛏️ Booking Flow

A complete multi-step booking experience:

```text
Search
  ↓
Hotel Details
  ↓
Room Selection
  ↓
Guest Information
  ↓
Payment
  ↓
Booking Confirmation
```

The booking draft is persisted during the flow so refreshing the page does not immediately destroy the user's progress.

### 👤 Authentication

- Login
- Registration
- Mock authentication
- Protected routes
- Persistent authentication session
- Redirect handling for protected pages

### 📋 User Account

- View bookings
- Cancel bookings
- Manage profile
- Manage favorite hotels
- Access booking history

### 💳 Mock Payment

The checkout flow includes a deterministic mock payment system for testing different outcomes.

| Card Prefix | Result |
|---|---|
| `4242` | Always succeeds |
| `0000` | Always fails |
| Anything else | 90% success / 10% failure |

The payment logic is isolated inside the service layer so it can later be replaced with a real payment provider without changing the checkout UI.

### 🌍 RTL & Persian UI

- Fully RTL interface
- Persian-language user experience
- Responsive layouts
- Persian-friendly typography
- Consistent design system
- RTL-aware component structure

---

## 🧠 Engineering Highlights

### TypeScript Strict Mode

The application is built with TypeScript strict mode.

The domain model is strongly typed across:

- Hotels
- Rooms
- Bookings
- Users
- Reviews
- Amenities
- Search parameters
- Service responses

This helps catch integration errors early and keeps the application easier to maintain.

---

### Server State with TanStack Query

TanStack Query is used for server-style state management and caching.

Mock API calls behave like real asynchronous requests:

```text
Component
   ↓
Custom Hook
   ↓
TanStack Query
   ↓
Service Layer
   ↓
Mock Data
```

This keeps data fetching, caching, loading states, and error states separate from presentation logic.

---

### Client State with Zustand

Zustand is intentionally used for global client state that needs to survive across multiple routes.

#### Booking Store

The booking store manages the in-progress booking draft, including:

- Selected room
- Booking dates
- Guest information
- Booking progress

The booking draft is persisted in `sessionStorage`.

#### Auth Store

The authentication store manages the current mock authentication session using `localStorage`.

Other UI state remains local to components or is stored in the URL when appropriate.

---

### URL-Based Search State

Search filters, sorting, and pagination are stored in URL search parameters.

Example:

```text
/search?destination=Paris&rating=5&page=2
```

This provides:

- Persistent search state
- Refresh-safe filters
- Shareable URLs
- Bookmarkable searches
- Browser navigation support

This approach avoids unnecessary duplication between URL state and global state.

---

### Service Layer

Data access is isolated inside:

```text
src/services/
```

Service functions return Promises and behave like real asynchronous API calls.

Components never access the static dataset directly.

The application follows this structure:

```text
UI
↓
Hooks
↓
Services
↓
Data
```

This creates a clean abstraction that makes it easier to replace the mock data layer with a real backend such as Supabase.

---

### Centralized Pricing Logic

Booking price calculations are isolated inside:

```text
src/utils/pricing.ts
```

The pricing layer handles:

- Number of nights
- Room price calculation
- Subtotal
- Discount
- Tax
- Final total

Financial calculations are kept outside UI components to avoid duplicated business logic.

---

## 🏗️ Architecture

Stayly follows a layered frontend architecture designed to separate UI, state management, business logic, validation, and data access.

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── hotel/
│   ├── room/
│   ├── review/
│   ├── booking/
│   └── auth/
│
├── pages/
│   └── route-based pages
│
├── hooks/
│   ├── hotel hooks
│   ├── booking hooks
│   └── shared hooks
│
├── services/
│   ├── hotel services
│   ├── booking services
│   ├── review services
│   └── payment service
│
├── store/
│   ├── authStore
│   ├── bookingStore
│   └── toastStore
│
├── schemas/
│   └── Zod validation schemas
│
├── types/
│   └── shared TypeScript types
│
├── data/
│   └── static mock dataset
│
├── utils/
│   ├── pricing
│   ├── formatting utilities
│   ├── cn helper
│   └── shared utilities
│
└── styles/
    └── global styles and design tokens
```

---

## 🔄 Application Flow

The main booking experience follows this flow:

```text
Home
 ↓
Search
 ↓
Search Results
 ↓
Hotel Details
 ↓
Select Room
 ↓
Guest Information
 ↓
Checkout
 ↓
Payment
 ↓
Confirmation
 ↓
My Bookings
```

Authentication is integrated into protected parts of the application without coupling authentication logic directly to individual pages.

---

## 🗺️ Search & Filtering

Search functionality is designed around realistic hotel-booking behavior.

### Filter Rules

**AND** is used between filter categories.

Example:

```text
5 Stars
AND
Paris
AND
Pool
```

**OR** is used inside the same filter category.

Example:

```text
Hotel
OR
Resort
OR
Villa
```

Search state is persisted through URL parameters.

Pagination is also URL-based, allowing users to share or bookmark a specific search result page.

---

## 💰 Booking & Pricing

Pricing is calculated independently from the UI.

```text
Number of Nights
       ↓
Room Price × Nights
       ↓
Subtotal
       ↓
Discount
       ↓
Taxes
       ↓
Final Total
```

Keeping pricing logic isolated makes the business rules easier to test, maintain, and replace.

---

## 🧪 Testing

The project includes **Playwright end-to-end tests** for critical application flows.

The E2E setup is located in:

```text
e2e/
playwright.config.ts
```

The test suite focuses on validating important user-facing flows and protected application behavior.

Run the test suite with:

```bash
npx playwright test
```

To open the latest HTML report:

```bash
npx playwright show-report
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | UI and component architecture |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| Tailwind CSS | Styling and design system |
| React Router | Routing and URL state |
| TanStack Query | Server-state management |
| Zustand | Client/global state |
| React Hook Form | Form management |
| Zod | Runtime validation |
| Lucide React | Icons |
| Playwright | End-to-end testing |
| localStorage | Mock authentication persistence |
| sessionStorage | Booking draft persistence |

---

## 🎨 Design System

The interface follows a centralized design approach using Tailwind CSS and reusable UI patterns.

The design system focuses on:

- Consistent spacing
- Typography hierarchy
- Reusable UI components
- Consistent border radius
- Shadows and elevation
- Interactive states
- Responsive breakpoints
- RTL support
- Accessible color contrast
- Consistent form controls

The goal is to make the interface feel like a cohesive booking product rather than a collection of independent pages.

---

## ♿ Accessibility

Accessibility was considered throughout the application.

Key areas include:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Accessible form controls
- Proper labels
- Button and link semantics
- Meaningful error states
- Responsive layouts
- RTL-aware UI structure

---

## 📱 Responsive Design

Stayly is designed for:

- 📱 Mobile
- 📱 Tablet
- 💻 Desktop
- 🖥️ Large screens

Layouts adapt across screen sizes while preserving the booking flow and information hierarchy.

---

## 🔐 Demo Authentication

Stayly uses mock authentication for demonstration purposes.

You can use the seeded demo users available in the application or create a new account through:

```text
/register
```

> Authentication is intentionally mocked and should not be used with real credentials.

---

## ⚠️ Project Scope & Limitations

Stayly is a portfolio project and currently uses a mock data layer instead of a production backend.

Current limitations include:

- No real backend
- Mock authentication
- Mock payment processing
- Static hotel and booking dataset
- Simplified room availability model
- No real payment gateway
- Reviews are based on seeded data
- No hotel-owner management dashboard

These limitations are intentional and allow the frontend architecture and user experience to be demonstrated without introducing unnecessary backend complexity.

---

## 🔮 Future Improvements

Possible future extensions include:

- Supabase backend
- Real authentication
- Real database persistence
- Day-by-day room inventory
- Real payment gateway
- User-submitted reviews
- Hotel owner dashboard
- Advanced availability calendar
- Real-time booking updates
- More comprehensive unit and integration test coverage
- CI/CD pipeline

---

## 📚 Architectural Decisions

### Why React + TypeScript?

The application contains a relatively large domain model with multiple interconnected entities.

TypeScript provides:

- Safer data contracts
- Better refactoring
- Better editor support
- Earlier detection of integration errors

---

### Why TanStack Query?

Instead of manually managing asynchronous data with `useEffect`, TanStack Query provides:

- Loading states
- Error states
- Caching
- Refetching
- Query lifecycle management

This keeps data-fetching concerns out of UI components.

---

### Why Zustand?

Global state is intentionally kept small.

Zustand is used for state that needs to survive across multiple routes, such as:

- Authentication
- Booking draft
- Shared application state

Local UI state remains local to components.

---

### Why URL Search Parameters?

Search filters belong to the URL because users expect booking searches to be:

- Shareable
- Bookmarkable
- Refresh-safe
- Browser-navigation friendly

This also prevents unnecessary duplication between global state and URL state.

---

### Why a Service Layer?

The service layer creates an abstraction between the UI and the data source.

```text
Component
   ↓
Hook
   ↓
Service
   ↓
Data Source
```

Because the UI depends on service functions rather than directly accessing mock data, replacing the mock implementation with a real backend becomes significantly easier.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mina-gharzi/Stayly.git
```

### 2. Navigate to the project

```bash
cd Stayly
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## 📌 Project Goals

Stayly was built to demonstrate practical frontend engineering skills beyond basic CRUD interfaces.

The project focuses on:

- Component architecture
- Type-safe application development
- State management
- URL-driven application state
- Async data handling
- Form validation
- Business logic separation
- Protected routing
- Responsive UI
- Accessibility
- End-to-end testing
- Realistic multi-step user flows

The goal is to demonstrate how a production-style frontend application can be structured, not simply how to build individual pages.

---

## 💼 Portfolio Context

Stayly is the third project in a frontend portfolio focused on building increasingly complex applications with modern React architecture.

The project represents a transition toward more structured and scalable TypeScript-based frontend systems, with an emphasis on realistic product flows and maintainable architecture.

---

## 👩‍💻 Author

**Mina Gharzi**

Frontend Developer focused on building modern, accessible, and scalable web applications with React and TypeScript.

---

## 📄 License

This is a personal portfolio project and is not licensed for commercial reuse.
