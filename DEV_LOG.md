2026-01-26 [SETUP] Initialized Vite + React + Tailwind. Created folder structure and basic Router.
2026-01-26 [FRONTEND] Created public frontend components: Navbar (Mobile First), Hero (Static), About, Contact, Footer. Assembled Home page.
2026-01-26 [BACKEND] Aligned DB schema in `db/init.sql` with Strict User Requirements (Users, Services, Projects only).
2026-01-26 [BACKEND] Initialized Node/Express server in `server/` with `pg` for PostgreSQL connection. Endpoints: /api/services, /api/projects.
2026-01-26 [DEPLOY] Configured `Dockerfile` for multi-stage build (Vite Frontend + Express Backend) and updated `server/index.js` to serve static files. Set DB connection in `server/.env`.
2026-01-26 [BACKEND] Implemented JWT Auth + Protected Routes in Node server.
2026-01-26 [CMS] Created Admin Panel: Login Page and Dashboard for Project management (Create/Delete) with Image Preview.
2026-01-26 [FIX] Removed unused `React` imports from all components to satisfy linting rules for production build.
2026-01-26 [FIX] Downgraded Tailwind CSS to v3.4 to resolve configuration mismatch with PostCSS, ensuring successful production build.
2026-01-26 [ASSETS] Integrated local assets: Replaced Hero background with `hero.mp4`, updated Navbar with `logo.png`, and set `favicon.png`.
2026-01-26 [CONTENT] Updated Hero slogan to "An OCEAN of ideas for your home!" and Browser Tab title. Created `db/create_admin.sql`.
2026-01-26 [CONTENT] Updated Hero slogan to "An OCEAN of ideas for your home!" and Browser Tab title. Created `db/create_admin.sql`.
2026-01-26 [PULISH] Enhanced UI: Applied `framer-motion` animations (Titles, Reveals), updated Footer (Logo + Map), and Navbar (Larger Logo + Sign In Icon).
2026-01-26 [POLISH] Replaced Framer Motion with GSAP for Hero Title animation. Implemented transparent-to-white Navbar scroll effect. Lightened Hero video overlay. Added infinite floating animation to Hero title.
2026-01-26 [POLISH] Replaced Framer Motion with GSAP for Hero Title animation. Implemented transparent-to-white Navbar scroll effect. Lightened Hero video overlay. Added infinite floating animation to Hero title.
2026-01-26 [PULISH] Redesigned Services Section: Converted to static, high-performance GSAP animated layout. Added "Process Flow" and "Parallax Service Grid" with glassmorphism effects, matching original design intent but modernized.
2026-01-26 [FIX] Resolved Services Grid visibility issue by enforcing `gsap.fromTo` animation state (ensuring opacity: 1) and adding a dark background fallback if the image loads slowly.
2026-01-26 [PULISH] Removed filters from Navbar Logo to fix "white box" issue. Transformed "About Us" images into an interactive "Stacked Polaroid Video" gallery using `hero.mp4` placeholders.
2026-01-26 [BUILD] Production build successful. Ready for deployment.
