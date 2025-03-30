
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import PageTransition from '@/components/layout/PageTransition';
import { FacebookIcon, GithubIcon } from 'lucide-react';

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // If we're already authenticated, redirect to home
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  // If we're already authenticated, don't render the auth page
  if (user && !isLoading) {
    return <Navigate to="/" />;
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during Google login",
        variant: "destructive",
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Facebook login error:', error);
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during Facebook login",
        variant: "destructive",
      });
    }
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full max-w-md"
        >
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Login to continue to your dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                onClick={handleGoogleLogin}
                className="w-full py-6 space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-google"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path><path d="m15.5 8.5-3.5 3.5-2-2L7.5 12.5"></path></svg>
                <span>Sign in with Google</span>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleFacebookLogin}
                className="w-full py-6 space-x-2"
              >
                <FacebookIcon className="h-4 w-4" />
                <span>Sign in with Facebook</span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
