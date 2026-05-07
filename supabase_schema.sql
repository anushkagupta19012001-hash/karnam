-- Drop existing tables if they exist
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS experienced_professionals;
DROP TABLE IF EXISTS hiring_managers;

-- Create Experienced Professionals Table
CREATE TABLE experienced_professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase Auth
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  resume_url TEXT,
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Hiring Managers Table
CREATE TABLE hiring_managers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Links to Supabase Auth
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role_title TEXT NOT NULL,
  department TEXT,
  hiring_type TEXT,
  business_context TEXT,
  problem_to_solve TEXT,
  why_role_needed TEXT,
  key_responsibilities JSONB DEFAULT '[]',
  success_metrics TEXT,
  min_years_experience INTEGER,
  ideal_background TEXT,
  education_requirement TEXT,
  location TEXT,
  mandatory_skills TEXT,
  max_ctc INTEGER,
  notice_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Matches Table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email_hm TEXT NOT NULL, -- Email of the Hiring Manager
  email_ep TEXT NOT NULL, -- Email of the Experienced Professional
  
  -- Details shown to the Professional about the Job
  title TEXT NOT NULL, 
  problem_statement TEXT NOT NULL,
  
  -- Details shown to the Hiring Manager about the Professional
  professional_title TEXT NOT NULL,
  experience_summary TEXT NOT NULL,
  
  -- Status tracking
  hm_status TEXT DEFAULT 'pending' CHECK (hm_status IN ('pending', 'accepted', 'rejected')),
  ep_status TEXT DEFAULT 'pending' CHECK (ep_status IN ('pending', 'accepted', 'rejected')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: RLS (Row Level Security) is disabled for rapid prototyping.
-- In production, you would enable it and add policies.
