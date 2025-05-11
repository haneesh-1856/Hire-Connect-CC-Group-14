/*
  # Fix auth policies for job creation

  1. Changes
    - Update job creation policy to use user metadata role
    - Remove references to users table since it's managed by auth schema
    - Ensure proper role checking for recruiters
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can create jobs if they are recruiters" ON jobs;

-- Create new policy using user metadata
CREATE POLICY "Users can create jobs if they are recruiters"
ON jobs FOR INSERT
WITH CHECK (
  (auth.jwt()->>'role')::text = 'recruiter'
);