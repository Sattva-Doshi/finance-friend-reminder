
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  setAuthError: (error: string | null) => void;
}

export function SignInForm({ setAuthError }: SignInFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSignIn = async (values: SignInFormValues) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      console.log('Signing in with:', values.email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }
      
      console.log('Sign in successful:', data);
      
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

  return (
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
  );
}
