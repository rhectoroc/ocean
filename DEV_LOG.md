2026-01-26 [SETUP] Initialized Vite + React + Tailwind. Created folder structure and basic Router.
2026-01-26 [FRONTEND] Created public frontend components: Navbar (Mobile First), Hero (Static), About, Contact, Footer. Assembled Home page.
2026-01-26 [BACKEND] Aligned DB schema in `db/init.sql` with Strict User Requirements (Users, Services, Projects only).
2026-01-26 [BACKEND] Initialized Node/Express server in `server/` with `pg` for PostgreSQL connection. Endpoints: /api/services, /api/projects.
2026-01-26 [DEPLOY] Configured `Dockerfile` for multi-stage build (Vite Frontend + Express Backend) and updated `server/index.js` to serve static files. Set DB connection in `server/.env`.
2026-01-26 [BACKEND] Implemented JWT Auth + Protected Routes in Node server.
2026-01-26 [CMS] Created Admin Panel: Login Page and Dashboard for Project management (Create/Delete) with Image Preview.
2026-01-26 [FIX] Removed unused `React` imports from all components to satisfy linting rules for production build.
2026-01-26 [FIX] Downgraded Tailwind CSS to v3.4 to resolve configuration mismatch with PostCSS, ensuring successful production build.
