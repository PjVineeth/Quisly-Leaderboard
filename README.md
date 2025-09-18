# Quisly Leaderboard

A modern, responsive leaderboard application built with React, TypeScript, and Vite. This application displays student rankings and performance data for Quisly's JEE Main test series with a beautiful, accessible UI and comprehensive filtering capabilities.

## 🚀 Features

### Core Functionality
- **Real-time Leaderboard**: Displays student rankings with live data from Quisly API
- **Multi-subject Support**: Physics, Chemistry, and Mathematics score tracking
- **Advanced Filtering**: Filter by subject (Physics, Chemistry, Maths, or All)
- **Smart Sorting**: Sort by rank, overall score, or accuracy in ascending/descending order
- **Search Functionality**: Search students by name with real-time filtering
- **Pagination**: Efficient pagination for large datasets (10 items per page)
- **Data Export**: Export filtered results to CSV format

### UI/UX Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between dark and light modes with system preference detection
- **Top Performer Cards**: Special highlight cards for top 3 performers (desktop only)
- **Current User Tracking**: Sticky bottom strip showing current user's position
- **Loading States**: Skeleton loading animations during data fetch
- **Error Handling**: Graceful error states with user-friendly messages
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation support

### Visual Design
- **Custom Design System**: Quisly's Q3 design system with custom color variables
- **Rank-based Styling**: Special visual treatment for top 3 ranks with custom gradients
- **Glass Morphism**: Modern glassmorphism effects for headers and overlays
- **Smooth Animations**: CSS transitions and hover effects throughout
- **Icon Integration**: Phosphor Icons and Lucide React for consistent iconography

## 🏗️ Code Structure

### Project Architecture
```
Quilsy-leaderboard/
├── app/                          # Next.js app directory (converted to Vite)
│   ├── globals.css              # Global styles and design system
│   └── page.tsx                 # Main leaderboard page component
├── components/                   # Reusable UI components
│   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── alert.tsx
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── leaderboard-header.tsx   # Header with search, filters, and theme toggle
│   ├── leaderboard-table.tsx    # Main data table component
│   ├── top-performer-card.tsx   # Special cards for top 3 performers
│   ├── pagination.tsx           # Pagination controls
│   ├── rank-badge.tsx           # Rank display component
│   ├── theme-provider.tsx       # Theme context provider
│   └── icons.tsx                # Icon component library
├── hooks/                       # Custom React hooks
│   └── use-toast.ts            # Toast notification hook
├── lib/                        # Utility functions
│   └── utils.ts                # Common utilities (cn, etc.)
├── public/                     # Static assets
│   ├── 1.svg, 2.svg, 3.svg    # Rank badge SVGs
│   └── placeholder.svg         # Default avatar
└── src/                        # Vite entry point
    └── main.tsx               # React app initialization
```

### Key Components

#### `app/page.tsx` - Main Application
- **State Management**: Manages all application state (data, filters, pagination, theme)
- **Data Fetching**: Handles API calls to Quisly leaderboard endpoint
- **Data Processing**: Transforms API data into application format
- **Responsive Logic**: Handles desktop/mobile layout differences
- **Export Functionality**: CSV generation and download

#### `components/leaderboard-header.tsx` - Header Component
- **Search Input**: Real-time name search functionality
- **Filter Controls**: Subject and sorting dropdowns
- **Theme Toggle**: Dark/light mode switching
- **Breadcrumb Navigation**: Context-aware navigation breadcrumbs
- **Export Button**: CSV export trigger

#### `components/leaderboard-table.tsx` - Data Table
- **Responsive Grid**: 8-column grid layout for consistent alignment
- **Avatar Display**: User profile pictures with fallbacks
- **Score Visualization**: Formatted score displays with max score indicators
- **Current User Highlighting**: Special styling for current user rows

#### `components/top-performer-card.tsx` - Top Performer Cards
- **Rank-specific Styling**: Custom gradients and borders for ranks 1-3
- **Score Breakdown**: Detailed subject-wise score display
- **Visual Hierarchy**: Avatar, rank badge, and score information layout
- **Responsive Design**: Adapts to different screen sizes

### Design System

#### Color Variables
The application uses a comprehensive design system with CSS custom properties:

```css
/* Quisly Q3 Design System */
--q3-base-*: Primary brand colors (red, orange, green, etc.)
--q3-neutral-*: Neutral colors for text and backgrounds
--q3-surface-*: Surface colors for cards and containers
--q3-stroke-*: Border and divider colors
--rank*-*: Special rank-based styling variables
```

#### Theme Support
- **Light Mode**: Clean, bright interface with subtle shadows
- **Dark Mode**: Dark backgrounds with high contrast text
- **System Preference**: Automatically detects user's system theme preference
- **Smooth Transitions**: Animated theme switching

## 🛠️ Technology Stack

### Core Technologies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework

### UI Libraries
- **Radix UI**: Accessible, unstyled UI primitives
- **shadcn/ui**: Pre-built component library
- **Phosphor Icons**: Comprehensive icon library
- **Lucide React**: Additional icon components

### State Management
- **React Hooks**: useState, useEffect, useMemo, useCallback
- **Context API**: Theme management
- **Local State**: Component-level state management

### Styling
- **CSS Custom Properties**: Design system variables
- **Tailwind CSS**: Utility classes and responsive design
- **CSS Modules**: Component-scoped styles
- **PostCSS**: CSS processing and optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Quilsy-leaderboard

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Development Scripts
```bash
pnpm dev          # Start development server (port 5173)
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px - Single column layout, horizontal scrolling table
- **Tablet**: 768px - 1024px - Optimized spacing and layout
- **Desktop**: > 1024px - Full layout with top performer cards

### Mobile Optimizations
- Horizontal scrolling for data table
- Touch-friendly button sizes
- Optimized spacing and typography
- Sticky current user strip

## 🎨 Customization

### Adding New Subjects
1. Update the `LeaderboardData` interface in `app/page.tsx`
2. Add subject option to the select component in `leaderboard-header.tsx`
3. Update the sorting logic in the `getSortValue` function
4. Add subject column to the table component

### Modifying Rank Styling
1. Update CSS variables in `app/globals.css`
2. Modify the `getRankCardClass` function in `top-performer-card.tsx`
3. Update the `getRankStyles` function in `rank-badge.tsx`

### Theme Customization
1. Modify CSS custom properties in `app/globals.css`
2. Update the `ThemeProvider` component for additional theme options
3. Add new color variables following the existing naming convention

## 🔧 API Integration

### Data Source
The application fetches data from:
```
GET https://api.quizrr.in/api/hiring/leaderboard?page=1&limit=100
```

### Data Transformation
- Maps API response to internal `LeaderboardData` interface
- Extracts subject scores from nested `subjects` array
- Handles missing or malformed data gracefully
- Calculates accuracy percentages

### Error Handling
- Network error detection and user feedback
- Graceful fallbacks for missing data
- Loading states during API calls
- Retry mechanisms for failed requests

## 📊 Performance Optimizations

### React Optimizations
- `useMemo` for expensive calculations (filtering, sorting)
- `useCallback` for event handlers to prevent re-renders
- Efficient pagination to limit DOM nodes
- Lazy loading for large datasets

### CSS Optimizations
- CSS custom properties for consistent theming
- Tailwind CSS purging for smaller bundle size
- Optimized animations and transitions
- Efficient responsive design patterns
