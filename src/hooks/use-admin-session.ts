import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SESSION_STORAGE_KEY = 'admin_session_token';

export function useAdminSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const generateSessionToken = () => {
    // Use cryptographically secure random token generation
    return crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  };

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Check if session exists and is valid
      const { data, error } = await supabase
        .from('admin_sessions')
        .select('*')
        .eq('session_token', token)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        localStorage.removeItem(SESSION_STORAGE_KEY);
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error checking session:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string) => {
    try {
// Verify password using secure function
const { data, error } = await supabase
  .rpc('verify_admin_password', { 
    input_password: password 
  });

if (error) throw error;

if (!data) {
  throw new Error('Contraseña incorrecta');
}

      // Create session
      const sessionToken = generateSessionToken();
      
      // Clean up old sessions first
      await supabase
        .from('admin_sessions')
        .update({ is_active: false })
        .eq('is_active', true);

      // Create new session
      const { error: sessionError } = await supabase
        .from('admin_sessions')
        .insert([{
          session_token: sessionToken,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        }]);

      if (sessionError) throw sessionError;

      localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (token) {
        // Deactivate session in database
        await supabase
          .from('admin_sessions')
          .update({ is_active: false })
          .eq('session_token', token);
      }

      localStorage.removeItem(SESSION_STORAGE_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check session on mount and when page becomes visible
  useEffect(() => {
    checkSession();

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkSession
  };
}