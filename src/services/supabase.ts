import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kuvalqtsdhyvqrbztxea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dmFscXRzZGh5dnFyYnp0eGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODcxMjQsImV4cCI6MjA2MjU2MzEyNH0.86NJxrKYgkdcK35DX5s7caK3X7gyUSIeJ9yOz2Dxs40';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUp = async (email: string, password: string, userData: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });

  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};