# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Scrum Poker is an Angular 18 application for facilitating planning poker sessions. It uses Firebase Firestore for real-time data synchronization and is deployed to Firebase Hosting.

## Common Commands

### Development
- `npm start` - Start development server at http://localhost:4200/
- `npm run watch` - Build with watch mode (development configuration)
- `npm run build` - Production build (outputs to `dist/`)
- `npm run analyze` - Build with source maps and analyze bundle sizes

### Testing
- `npm test` - Run all unit tests via Karma
- No single test command - use Karma UI to run individual test specs

### Code Quality
- `npm run lint` - Lint TypeScript and HTML files
- `npm run format` - Format all TypeScript, CSS, LESS, and HTML files with Prettier
- `npm run format-staged` - Format only staged files (used in pre-commit hook)

### Angular CLI
- `ng generate component component-name` - Generate new component
- `ng generate service service-name` - Generate new service
- `ng generate directive|pipe|guard|interface|enum|module` - Generate other Angular artifacts

## Architecture

### Core Patterns

**Service-Based Architecture**: Each Firestore collection has a corresponding service and model:
- Services are in `src/app/services/` (e.g., `table.service.ts`, `user.service.ts`)
- Models are in `src/app/model/` (e.g., `table.model.ts`, `user.model.ts`)
- All services use the centralized `FirestoreService` for database operations

**ID Management**: The application uses a composite ID pattern:
- `tableId`: UUID v4 for each poker session (from URL or localStorage)
- `userId`: UUID v4 for each user (stored in localStorage)
- `mergedId`: Combination of `${tableId}-${userId}` for user-specific data within a table
- ID utilities are in `src/app/utils/id.ts`

**Real-time Observables**: Services expose RxJS Observables for reactive data flow:
- `FirestoreService` wraps Firestore queries with Observables
- Component subscriptions via `async` pipe in templates
- All Firestore operations use `@angular/fire` library

### Firestore Collections

The database schema (defined in `src/types.ts` as `CollectionName`):
- `tables` - Poker session metadata
- `tasks` - Items to be estimated
- `users` - User profiles (owners, players, spectators)
- `cards` - Available estimation cards
- `votes` - User votes on tasks
- `userRoles` - Role assignments (owner/player/spectator)
- `countdowns` - Session timers
- `minutes` - Meeting notes
- `suggestions` - User suggestions/feedback
- `owners`, `players`, `spectators` - User type collections

### Key Components

**TableComponent** (`src/app/table/`): Main application component that:
- Orchestrates all services and state management
- Manages voting sessions (reveal cards, start new voting)
- Handles task creation/deletion
- Manages user roles and table ownership
- Uses standalone component architecture (no NgModule)

**Routing**: Custom URL matcher in `app.routes.ts`:
- Root path (`/`) - Creates or loads default table
- `/:id` path - Joins specific table by UUID
- Invalid UUIDs redirect to `PageNotFoundComponent`

### State Management

No NgRx or similar state library. State is managed through:
1. Firestore real-time subscriptions
2. Component-level RxJS Observables
3. LocalStorage for user identity and current table

### Styling

- **TailwindCSS** for utility classes (configured for tree-shaking in `tailwind.config.js`)
- **ng-zorro-antd** for UI components (Ant Design for Angular)
- **LESS** preprocessor (primary styles in `src/styles.less`)
- Component-specific styles in separate CSS files
- **Important**: Only import ng-zorro component styles that are actually used (no global CSS bundle)

### Environment Configuration

- `environment.common.ts` - Shared configuration
- `environment.ts` - Production config (Firebase, reCAPTCHA keys)
- `environment.development.ts` - Development config
- Angular's `fileReplacements` in `angular.json` swaps environments based on build configuration

## Development Guidelines

### Code Style
- ESLint enforces `eqeqeq: always` (strict equality)
- Prettier configuration: 2 spaces, single quotes, no semicolons, arrow parens always
- Angular style guide: `app` prefix for components/directives, kebab-case for component selectors
- Husky pre-commit hook runs `format-staged` and `lint`

### Service Pattern
When creating new features:
1. Define model interface in `src/app/model/`
2. Add collection name to `CollectionName` type in `src/types.ts`
3. Create service in `src/app/services/` that injects `FirestoreService`
4. Use `FirestoreService` methods for all CRUD operations
5. Expose Observables for reactive data access

### ID Pattern
- Always use `getTableId()`, `getUserId()`, or `getMergedId()` from utils/id.ts
- Never generate IDs directly with `uuid.v4()`
- Document IDs match the entity's ID property for consistency

### Firebase Deployment
- Build outputs to `dist/browser/` (specified in `firebase.json`)
- Single-page app with wildcard rewrite to `index.html`
- Cloud Run configuration in `apphosting.yaml`

## Version Control

- Uses semantic-release for automated versioning
- Conventional commits expected (analyzed by semantic-release)
- Version displayed in app from `package.json`
- Releases published to GitHub automatically on main branch
