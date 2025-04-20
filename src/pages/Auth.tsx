
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import PageTransition from '@/components/layout/PageTransition';
import { AuthForm } from '@/components/auth/AuthForm';
import { usePwaInstall } from '@/hooks/use-pwa-install';
import { Download } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { deferredPrompt, handleInstall } = usePwaInstall();

  useEffect(() => {
    if (user && !isLoading) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (user && !isLoading) {
    return <Navigate to="/" />;
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-screen px-4 py-12 relative">
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
              <AuthForm />
            </CardContent>

            <CardFooter className="justify-center">
              <p className="text-xs text-center text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
        
        {deferredPrompt && (
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 right-4 p-2 rounded-full shadow-lg"
            onClick={handleInstall}
          >
            <Download className="h-6 w-6" />
          </Button>
        )}
      </div>
    </PageTransition>
  );
}
