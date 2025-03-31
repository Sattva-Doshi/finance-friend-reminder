
import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import PageTransition from '@/components/layout/PageTransition';
import { FacebookIcon, InfoIcon, GithubIcon, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Form validation schema
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading, refetchSession } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize react-hook-form
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

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

  const handleSignIn = async (values: AuthFormValues) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      console.log('Signing in with:', values.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      await refetchSession();
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Sign in error details:', error);
      setAuthError(error.message || "Invalid login credentials. Please check your email and password.");
      
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid login credentials. Please check your email and password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (values: AuthFormValues) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      console.log('Signing up with:', values.email);
      
      // Sign up without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // Skip email confirmation by setting data.email_confirmed
          data: {
            email_confirmed: true
          }
        }
      });
      
      console.log('Sign up response:', data);
      
      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }
      
      // After successful signup, try to sign in automatically
      if (data && data.user) {
        console.log('Auto sign-in after registration');
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        
        if (signInError) {
          console.error('Auto sign-in error:', signInError);
          toast({
            title: "Account created",
            description: "Account created successfully. Please sign in.",
          });
          
          // Reset form and switch to sign in tab (fixing the TypeScript error)
          form.reset();
          const signinTab = document.querySelector('[data-value="signin"]') as HTMLElement;
          if (signinTab) signinTab.click();
        } else {
          await refetchSession();
          toast({
            title: "Account created",
            description: "You have been automatically signed in.",
          });
          navigate('/');
          return;
        }
      }
      
      toast({
        title: "Account created",
        description: "You can now sign in with your new account",
      });
      
      // Reset form and switch to sign in tab
      form.reset();
      const signinTab = document.querySelector('[data-value="signin"]') as HTMLElement;
      if (signinTab) signinTab.click();
      
    } catch (error: any) {
      console.error('Sign up error details:', error);
      
      // Handle specific error cases
      if (error.message.includes('User already registered')) {
        setAuthError('This email is already registered. Please try signing in instead.');
        toast({
          title: "Sign up failed",
          description: "This email is already registered. Please try signing in instead.",
          variant: "destructive",
        });
      } else {
        setAuthError(error.message || "An error occurred during sign up");
        toast({
          title: "Sign up failed",
          description: error.message || "An error occurred during sign up",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {authError && (
                <Alert variant="destructive" className="mb-4">
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••••" 
                                type="password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="your.email@example.com" 
                                type="email"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="••••••••" 
                                type="password"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
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
            </CardContent>

            <CardFooter className="justify-center">
              <p className="text-xs text-center text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
