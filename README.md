# TableQuest - Table Finder App

Find and book the perfect gaming table for your next board game night.

## Screenshots

![App Screenshot](public/TableFinder_Screen.jpeg)

## Project Info

- **Repository:** [GitHub link here]
- **Live URL:** [Deployment link here]

## Features

- Browse and search for gaming tables
- View table amenities (WiFi, Power Outlet, Quiet, etc.)
- User profiles and preferences
- Interactive map of available tables
- Modern UI with shadcn-ui and Tailwind CSS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

```sh
git clone <YOUR_GIT_URL>
cd table-finder-app
npm install
```

### Development

Start the development server with hot reload:

```sh
npm run dev
```

### Build

To create a production build:

```sh
npm run build
```

### Lint

To check code quality:

```sh
npm run lint
```

## Project Structure

- `src/components/` – UI components (e.g., GamingTableListItem, GamingTableMap, Navbar)
- `src/pages/` – App pages (e.g., ProfilePage)
- `src/integrations/supabase/` – Supabase integration
- `src/lib/` – Utility libraries
- `public/` – Static assets

## Technologies Used

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [shadcn-ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (for backend)

## Deployment

You can deploy this app using [Vercel](https://vercel.com/), [Netlify](https://www.netlify.com/), or any static hosting provider.
