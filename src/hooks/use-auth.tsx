
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch current session
  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
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
    } catch (error: any) {
      console.error('Error fetching session:', error);
      setAuthError(error.message);
      
      if (requireAuth) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue",
          variant: "destructive",
        });
        navigate('/auth');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, requireAuth, toast]);

  // Sign out handler
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear local state
      setUser(null);
      setSession(null);
      
      // Notify user
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      // Redirect to auth page
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthError(error.message);
      
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred while signing out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [navigate, toast]);

  // Check auth status on component mount and set up listeners
  useEffect(() => {
    // Set up auth state change listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        console.log('Auth state changed:', _event);
        
        // Update local state
        setSession(newSession);
        setUser(newSession?.user || null);
        
        // Handle auth state changes for protected routes
        if (requireAuth && !newSession) {
          navigate('/auth');
        }
        
        setIsLoading(false);
      }
    );

    // Then fetch the current session
    fetchSession();

    // Clean up subscription on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, requireAuth, fetchSession]);

  // Return the enhanced hook data
  return { 
    user, 
    session, 
    isLoading, 
    signOut,
    authError,
    isAuthenticated: !!session,
    refetchSession: fetchSession
  };
}
