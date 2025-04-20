
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialAuth } from './SocialAuth';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

export function AuthForm() {
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="space-y-4">
          <SignInForm setAuthError={setAuthError} />
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4">
          <SignUpForm setAuthError={setAuthError} setActiveTab={setActiveTab} />
        </TabsContent>
      </Tabs>

      <SocialAuth />
    </>
  );
}
