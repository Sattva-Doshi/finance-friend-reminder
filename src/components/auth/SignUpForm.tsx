
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

const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  setAuthError: (error: string | null) => void;
  setActiveTab: (tab: "signin" | "signup") => void;
}

export function SignUpForm({ setAuthError, setActiveTab }: SignUpFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSignUp = async (values: SignUpFormValues) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      console.log('Signing up with:', values.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            email_confirmed: true
          }
        }
      });
      
      console.log('Sign up response:', data);
      
      if (error) {
        throw error;
      }
      
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
          
          form.reset();
          setActiveTab("signin");
        } else {
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
      
      form.reset();
      setActiveTab("signin");
      
    } catch (error: any) {
      console.error('Sign up error details:', error);
      
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

  return (
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

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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
  );
}
