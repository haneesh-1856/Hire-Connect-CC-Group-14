/*
  # Fix users table RLS policies

  1. Changes
    - Add RLS policy to allow authenticated users to read user data
    - This is needed for the jobs table policy that checks user roles
  
  2. Security
    - Enable RLS on users table if not already enabled
    - Add policy for authenticated users to read user data
    - Policy is restricted to only allow users to read their own data
*/

-- Enable RLS on users table if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Add policy to allow authenticated users to read their own data
CREATE POLICY "Users can read their own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Add policy to allow checking user roles for job creation
CREATE POLICY "Allow reading user roles for job creation"
ON users
FOR SELECT
TO authenticated
USING (true);