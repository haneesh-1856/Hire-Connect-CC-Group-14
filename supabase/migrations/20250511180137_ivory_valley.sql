/*
  # Initial schema setup for job portal

  1. New Tables
    - users (handled by Supabase Auth)
    - jobs
      - id (uuid, primary key)
      - title (text)
      - company (text)
      - location (text)
      - type (text)
      - description (text)
      - requirements (text[])
      - benefits (text[])
      - salary_min (numeric)
      - salary_max (numeric)
      - experience (text)
      - is_referral (boolean)
      - created_by (uuid, references auth.users)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - applications
      - id (uuid, primary key)
      - job_id (uuid, references jobs)
      - user_id (uuid, references auth.users)
      - status (text)
      - message (text)
      - resume_url (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Set up access policies for jobs and applications
*/

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company text NOT NULL,
  company_logo text,
  location text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  requirements text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  salary_min numeric,
  salary_max numeric,
  experience text,
  is_referral boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'interviewing', 'accepted', 'rejected')),
  message text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone" 
  ON jobs FOR SELECT 
  USING (true);

CREATE POLICY "Users can create jobs if they are recruiters" 
  ON jobs FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'recruiter'
    )
  );

CREATE POLICY "Users can update their own jobs" 
  ON jobs FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own jobs" 
  ON jobs FOR DELETE 
  USING (created_by = auth.uid());

-- Applications policies
CREATE POLICY "Users can view their own applications" 
  ON applications FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create applications" 
  ON applications FOR INSERT 
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.raw_user_meta_data->>'role' = 'job_seeker'
    )
  );

CREATE POLICY "Users can update their own applications" 
  ON applications FOR UPDATE 
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = applications.job_id 
      AND jobs.created_by = auth.uid()
    )
  );

-- Create function to handle job updates
CREATE OR REPLACE FUNCTION handle_job_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to handle application updates
CREATE OR REPLACE FUNCTION handle_application_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER job_updated
  BEFORE UPDATE ON jobs
  FOR EACH ROW
  EXECUTE FUNCTION handle_job_updated();

CREATE TRIGGER application_updated
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION handle_application_updated();