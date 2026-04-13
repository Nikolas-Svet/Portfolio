# Clinic Electron

Desktop app scaffold with Electron + Vue 3 + Vite + TypeScript + Express + SQLite.

## Structure
- `electron/` main process + embedded backend + db layer
- `src/` Vue renderer
- `dist/` Vite build output
- `dist-electron/` compiled Electron/Express code

## Dev
- `npm install`
- `npm run dev`

Expected:
- Vite on http://localhost:5173
- Express on http://127.0.0.1:3000
- Electron loads Vite in dev

## Build
- `npm run build`
- `npm run start`

## Notes
- SQLite file lives in Electron userData path as `clinic.sqlite`
- API base path is `/api`
