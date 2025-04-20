
import { Button } from "@/components/ui/button";
import { FacebookIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function SocialAuth() {
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Google login error:', error);
      setAuthError(
        error.message === 'Unsupported provider: provider is not enabled'
          ? 'Google login is not enabled. Please configure Google provider in Supabase.'
          : error.message || 'An error occurred during Google login'
      );
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during Google login",
        variant: "destructive",
      });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Facebook login error:', error);
      setAuthError(
        error.message === 'Unsupported provider: provider is not enabled'
          ? 'Facebook login is not enabled. Please configure Facebook provider in Supabase.'
          : error.message || 'An error occurred during Facebook login'
      );
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during Facebook login",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

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
    </div>
  );
}
