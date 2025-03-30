
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user || null);
        
        // If auth is required and user is not logged in, redirect to auth page
        if (requireAuth && !data.session) {
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        if (requireAuth) {
          navigate('/auth');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log('Auth state changed:', _event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Handle auth state changes for protected routes
        if (requireAuth && !newSession) {
          navigate('/auth');
        }
        setIsLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, requireAuth]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return { user, session, isLoading, signOut };
}
