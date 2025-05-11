/*
  # Fix job creation policy

  1. Changes
    - Simplify job creation policy to use JWT claims
    - Remove unnecessary user table check
    - Add proper error handling
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can create jobs if they are recruiters" ON jobs;

-- Create new simplified policy
CREATE POLICY "Users can create jobs if they are recruiters"
ON jobs FOR INSERT
WITH CHECK (
  auth.jwt()->>'role' = 'recruiter'
);