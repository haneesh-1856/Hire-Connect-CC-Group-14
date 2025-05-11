import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AuthContextType } from '../types/user';
import { supabase } from '../services/supabase';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => Promise.resolve({ success: false }),
  register: () => Promise.resolve({ success: false }),
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser({
          _id: session.user.id,
          name: session.user.user_metadata.name,
          email: session.user.email!,
          role: session.user.user_metadata.role,
          createdAt: session.user.created_at,
          updatedAt: session.user.last_sign_in_at || session.user.created_at
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { 
          success: false, 
          message: error.message
        };
      }

      if (data.user.user_metadata.role === 'job_seeker') {
        navigate('/seeker-dashboard');
      } else {
        navigate('/recruiter-dashboard');
      }
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Login failed. Please try again.'
      };
    }
  };

  const register = async (userData: { name: string, email: string, password: string, role: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (error) {
        return { 
          success: false, 
          message: error.message 
        };
      }

      // Auto sign in after registration
      if (data.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: userData.password
        });

        if (signInError) {
          return {
            success: false,
            message: 'Registration successful but login failed. Please try logging in.'
          };
        }

        if (userData.role === 'job_seeker') {
          navigate('/seeker-dashboard');
        } else {
          navigate('/recruiter-dashboard');
        }
        
        return { success: true };
      }

      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Registration failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        register, 
        logout, 
        isAuthenticated: !!user 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};