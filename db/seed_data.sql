-- First, clear existing profiles (optional)
-- DELETE FROM public.profiles WHERE role = 'member';

-- Insert 10 dummy members
-- Note: In Supabase, profiles are linked to auth.users. 
-- However, for dummy data to show up in your dropdowns, we can insert them directly into public.profiles with dummy UUIDs.

-- TEMPORARILY DISABLE FOREIGN KEY TO INSERT DUMMY DATA WITHOUT AUTH USERS
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

INSERT INTO public.profiles (id, email, full_name, role)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'alex.smith@example.com', 'Alex Smith', 'member'),
  ('00000000-0000-0000-0000-000000000002', 'sarah.jones@example.com', 'Sarah Jones', 'member'),
  ('00000000-0000-0000-0000-000000000003', 'michael.brown@example.com', 'Michael Brown', 'member'),
  ('00000000-0000-0000-0000-000000000004', 'emily.davis@example.com', 'Emily Davis', 'member'),
  ('00000000-0000-0000-0000-000000000005', 'david.wilson@example.com', 'David Wilson', 'member'),
  ('00000000-0000-0000-0000-000000000006', 'jessica.taylor@example.com', 'Jessica Taylor', 'member'),
  ('00000000-0000-0000-0000-000000000007', 'christopher.lee@Example.com', 'Christopher Lee', 'member'),
  ('00000000-0000-0000-0000-000000000008', 'amanda.white@example.com', 'Amanda White', 'member'),
  ('00000000-0000-0000-0000-000000000009', 'matthew.hall@example.com', 'Matthew Hall', 'member'),
  ('00000000-0000-0000-0000-000000000010', 'rachel.adams@example.com', 'Rachel Adams', 'member')
ON CONFLICT (id) DO NOTHING;

-- RE-ENABLE THE CONSTRAINT (This will allow future real users to link correctly)
-- Note: Real users will still work fine as they have valid IDs in auth.users
ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;

-- Insert some dummy tasks for these members
INSERT INTO public.tasks (title, description, assigned_to, status, due_date)
VALUES 
  ('Design Login Mockup', 'Create a premium dark mode UI for login', '00000000-0000-0000-0000-000000000001', 'todo', CURRENT_DATE),
  ('API Integration', 'Connect the dashboard to Supabase hooks', '00000000-0000-0000-0000-000000000002', 'todo', CURRENT_DATE + interval '1 day'),
  ('Database Refactoring', 'Optimize the RLS policies', '00000000-0000-0000-0000-000000000003', 'completed', CURRENT_DATE - interval '2 days');
