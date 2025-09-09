# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

TableQuest is a React-based web application for finding and booking gaming tables in Barcelona, Spain. The app specializes in connecting board game enthusiasts with available gaming venues and tables throughout Barcelona's neighborhoods.

## Development Commands

### Local Development
```powershell
# Start development server (runs on localhost:8080)
npm run dev

# Alternative for development with different package managers
bun dev  # if using bun
```

### Building
```powershell
# Production build
npm run build

# Development build (preserves development features)
npm run build:dev
```

### Code Quality
```powershell
# Run ESLint for code quality checks
npm run lint

# Preview production build locally
npm run preview
```

### Testing
This project doesn't currently have a test suite configured. Tests should be added using a framework like Vitest or Jest.

## Core Architecture

### Frontend Framework Stack
- **Vite + React 18** with TypeScript for the build system and UI framework
- **React Router 6** for client-side routing with nested routes
- **TanStack Query (React Query)** for server state management and caching
- **Tailwind CSS + shadcn/ui** for styling with a comprehensive component library

### Data Layer Architecture
The app uses a hybrid data strategy:
- **Supabase** as the primary backend database for production data
- **Graceful fallback system** to mock data when Supabase is unavailable
- **Barcelona-focused mock data** as the offline fallback dataset

### Map Integration
Dual mapping system for enhanced user experience:
- **MapBox GL** for production maps with real geographic data
- **Mock map fallback** with Barcelona-themed UI when MapBox token is unavailable
- **Token management system** via MapTokenProvider for secure API key handling

### Key Service Architecture

#### Data Services (`src/services/`)
- `supabaseService.ts` - Primary data fetching from Supabase
- `mockData.ts` - Barcelona-focused fallback data (8 gaming tables across neighborhoods)
- `gamingTableData.ts` - Core data types and mock venue/table data structures
- `geocodingService.ts` - MapBox geocoding with Barcelona-specific validation and neighborhood detection

#### Geographic Features
- **Barcelona coordinate validation** - Validates coordinates are within Barcelona boundaries
- **Neighborhood detection** - Automatically detects Barcelona neighborhoods (L'Eixample, Gràcia, Barri Gòtic, etc.)
- **Distance calculation** - Haversine formula for accurate distance from city center (Plaça de Catalunya)

### Component Structure

#### Core Layout
- `Layout.tsx` - Main app shell with SidebarProvider and Navbar
- `Navbar.tsx` - Navigation header with routing
- Uses React Router's `Outlet` for nested route rendering

#### Feature Components
- `GamingTableMap.tsx` - Dual map implementation (MapBox + mock fallback)
- `MapboxMap.tsx` - Real MapBox integration component
- `GamingTableListItem.tsx` - Individual table display cards
- `AddressLookup.tsx` - Geocoding and address search functionality
- `MapTokenProvider.tsx` - Context provider for MapBox token management
- `MapTokenDialog.tsx` - UI for setting MapBox API tokens

#### UI Foundation
- Complete shadcn/ui component library in `src/components/ui/`
- Custom animations defined in Tailwind config (fade-in, pulse-soft)
- Responsive design patterns with mobile-first approach

### Barcelona-Specific Features

The app is heavily customized for Barcelona:
- **Neighborhood boundaries** defined for 6 major districts
- **Cultural context** - References to Catalan snacks, local craft beers, traditional games
- **Geographic validation** - Ensures addresses and coordinates are Barcelona-centric
- **Mock venues** feature authentic Barcelona addresses and cultural elements
- **Bilingual support** considerations (Spanish/Catalan/English mentioned in descriptions)

## Environment Configuration

### Required Environment Variables
```env
# MapBox API token for maps and geocoding
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### MapBox Token Setup
To get a MapBox token:
1. Sign up at [mapbox.com](https://www.mapbox.com/signup)
2. Create a token with scopes: Styles:read, Fonts:read, Vision:read, Geocoding:read
3. The app includes fallback mechanisms when no token is provided

### Supabase Configuration
- Project ID: `nlmwayixattwcyklncvr`
- Public API key is committed (safe for client-side use)
- Database types are auto-generated in `src/integrations/supabase/types.ts`

## File Path Conventions

### Import Alias Configuration
- `@/` - Points to `src/` directory
- `@/components/` - UI components
- `@/services/` - Data and API services
- `@/lib/` - Utility functions
- `@/hooks/` - Custom React hooks

### Key Directories
- `src/pages/` - Route components (Home, GamingTableDetail, ProfilePage, NotFound)
- `src/components/` - Reusable UI components
- `src/services/` - Data fetching and business logic
- `src/integrations/supabase/` - Database integration
- `public/` - Static assets including app screenshot

## Development Patterns

### State Management
- **TanStack Query** for server state with automatic caching and background refetch
- **React Context** for global state (MapToken, themes)
- **Local component state** with useState for UI interactions
- **URL state** managed through React Router for shareable links

### Error Handling
- **Toast notifications** using Sonner for user feedback
- **Graceful degradation** from Supabase to mock data
- **Map fallback system** from MapBox to mock map interface
- **Geocoding error handling** with user-friendly messages

### Type Safety
- **Full TypeScript** implementation with strict settings configured
- **Database types** auto-generated from Supabase schema
- **Component prop interfaces** defined for all major components
- **Service layer types** for gaming tables, venues, and geographic data

### Responsive Design
- **Mobile-first** Tailwind CSS approach
- **Adaptive layouts** that work on desktop and mobile
- **Map interactions** optimized for touch and mouse

## Barcelona Context Integration

When working on this codebase, remember:
- All geographic features should validate against Barcelona boundaries
- Cultural references should reflect Barcelona/Catalonia (local snacks, languages, neighborhoods)
- Addresses should use Spanish/Catalan street naming conventions (Carrer, Avinguda, Plaça)
- Distance calculations are relative to Plaça de Catalunya (city center)
- Mock data represents authentic Barcelona gaming culture and venues

## Code Quality Standards

### ESLint Configuration
- TypeScript-ESLint with recommended rules
- React Hooks linting enabled
- React Refresh compatibility for hot reloading
- Unused variables warnings disabled to reduce noise

### Component Patterns
- **Functional components** with hooks throughout
- **Props interfaces** defined for type safety
- **Error boundaries** should be added for production resilience
- **Loading states** implemented with skeleton UI patterns
