-- Insert Admin User
-- Email: rhectoroc@gmail.com
-- Password: FvBBy2W$2476
INSERT INTO users (email, password_hash)
VALUES (
    'rhectoroc@gmail.com',
    '$2b$10$zzep6IHcev/TIt27gfIcEetsJBl44JURIuZylIzby.j1qulmVvDga'
) ON CONFLICT (email) DO NOTHING;
