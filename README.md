# Maison Chocolat - Bean-to-Bar Artisan Chocolate Factory Management & E-Commerce Platform

A production-grade, full-stack chocolate manufacturing operations suite and customer boutique.

## Installation & Setup

Ensure Node.js (v18+) is installed.

```bash
# Install dependencies using package-lock.json
npm install

# Run the development server
npm run dev

# Run unit and integration tests
npm test

# Build for production
npm run build

# Start the production server
npm start
```

## Dependencies & Manifests
- `package.json`: Primary package manifest specifying production and development dependencies.
- `package-lock.json`: Deterministic dependency lockfile ensuring reproducible builds across all deployment environments.
- `example.env`: Sample environment configuration for deployment variables.

## Architecture
- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **State Management**: React Context with LocalStorage persistence and fallback mock database
- **Backend API**: Node.js & Express server with RESTful endpoints
- **Testing**: Vitest unit and integration test suite in `tests/`
