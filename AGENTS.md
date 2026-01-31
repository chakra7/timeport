# Agent Guide: TimePort Codebase

This document provides instructions and standards for AI agents operating within the TimePort repository.

## 1. Project Overview
TimePort is a full-stack "Time Travel" web application.
- **Framework**: Next.js 14 with App Router
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **AI**: Integration with Groq (Llama 3.3 70B) via Vercel AI SDK
- **Root Directory**: Contains all application source code (flattened structure)

## 2. Critical Commands
All commands should be run from the root directory.

### Build and Development
- **Install**: `npm install`
- **Development**: `npm run dev` (Port 3000 - unified frontend + API)
- **Production Build**: `npm run build`
- **Start Production**: `npm run start`
- **Linting**: `npm run lint`

### Testing & Verification
*Note: No test framework is currently configured in package.json. If adding tests, prefer Vitest for frontend.*
- **Run Type Check**: `npx tsc --noEmit`
- **Run Single Test (Future)**: `npx vitest run path/to/file.test.ts` (Standard pattern for Next.js projects).

## 3. Code Style & Conventions

### TypeScript & Typing
- **Strict Mode**: `strict: true` is enabled in `tsconfig.json`. Do not use `any`.
- **Centralized Types**: All shared interfaces and types MUST be defined in `types/index.ts`.
- **Component Props**: Define props using interfaces (e.g., `interface MyComponentProps`).
- **Return Types**: Always specify function return types, including React components (`ReactElement`).
- **Example**:
  ```typescript
  export function MyComponent({ prop1 }: MyComponentProps): ReactElement {
    return <div>{prop1}</div>;
  }
  ```

### Imports
- **Aliases**: Use the `@/` alias for imports within the `src` directory (e.g., `import { JourneyData } from '@/types'`).
- **Organization**:
    1. React and standard library imports.
    2. Third-party library imports.
    3. Internal components.
    4. Utils and types.
    5. Styles/CSS.

### Component Structure
- Use Functional Components with `export function ComponentName(...)`.
- Use `'use client'` directive for client-side components (components with useState, useEffect, event handlers).
- Server Components (default in Next.js App Router) should not have `'use client'`.
- Prefer PascalCase for component filenames and function names.
- Style components using a `styles` object (inline styles) to support dynamic era theming, unless a global utility is better suited.
- **Dynamic Theming**: Use `lib/themes.ts` to fetch theme constants based on the current `era`.
- **Styling**: Use inline styles for dynamic theming, Tailwind for static styling.

### Naming Conventions
- **Variables/Functions**: camelCase.
- **Components**: PascalCase.
- **Files**: PascalCase for components (`EraDisplay.tsx`), camelCase for utils (`parseTime.ts`).
- **Constants**: UPPER_SNAKE_CASE for global constants or configuration objects.

### Error Handling
- Use `try...catch` blocks for all API calls and async operations.
- **Fail Gracefully**: Provide fallback values or "local generation" defaults (see `TimeMachine.tsx` fallback logic).
- Log errors clearly to the console for debugging.

## 4. Backend (API Routes)
- The backend uses Next.js API Routes located at `app/api/predict/route.ts`.
- It uses Next.js built-in environment variable support (no dotenv needed in API routes).
- It proxies requests to AI providers (Groq) to protect API keys.
- **API Response**: Ensure AI responses are cleaned and parsed as valid JSON before sending to the client.

## 5. Directory Structure
```text
timeport/
├── app/
│   ├── api/predict/   # API route for AI predictions (route.ts)
│   ├── page.tsx       # Main page (Home component)
│   ├── layout.tsx     # Root layout
│   └── globals.css    # Global styles
├── components/        # UI Components (TimeMachine, EraDisplay)
├── lib/              # Utilities (parseTime, parsePlace, dataGenerator, themes)
├── services/         # API clients (api.ts)
├── types/            # Centralized TS types (index.ts)
├── .env              # API Keys (git-ignored)
└── next.config.js    # Next.js configuration
```

## 6. AI Guidelines
- When modifying AI prompts in `app/api/predict/route.ts`, ensure the response remains parsable JSON.
- Maintain the "Creative but grounded" tone for predictions.
- **Prompt Engineering**: Be specific about the JSON schema in the system prompt to ensure consistency.

## 7. Development Safety
- **Never** commit `.env` files. Ensure they are in `.gitignore`.
- **Never** expose raw API keys in the frontend code.
- Always run `npx tsc --noEmit` before considering a task complete to ensure type safety.

## 8. Agent Workflow Standards
1. **Explore**: Use `grep` or `glob` to find relevant files before editing.
2. **Plan**: Describe the intended changes briefly.
3. **Edit**: Apply surgical edits using `edit` or `write` (prefer `edit` for existing files).
4. **Verify**: Run `npm run build` and `npx tsc --noEmit` to check for regressions.
5. **Document**: If adding new features, update the `README.md` if necessary.

## 9. Formatting
- Use 2 spaces for indentation.
- Use single quotes for strings unless double quotes are required for JSON or nesting.
- Semicolons are required.

---
*This guide is maintained for automated agents. Please follow all instructions strictly.*
