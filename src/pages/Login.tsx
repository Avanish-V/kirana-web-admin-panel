import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBasket, Loader2, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulated delay for premium feel
    setTimeout(() => {
      if (login(username, password)) {
        toast({
          title: 'Success!',
          description: 'You have successfully logged in.',
        });
        navigate('/', { replace: true });
      } else {
        setError("Invalid username or password");
        toast({
          variant: "destructive",
          title: 'Login Failed',
          description: 'Please check your credentials and try again.',
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-zinc-200 dark:border-zinc-800 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80 overflow-hidden">
          <CardHeader className="space-y-3 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-[hsl(240,85%,50%)] rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20">
              <ShoppingBasket className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
              Kirana Admin
            </CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
              Sign in to access your administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-700 dark:text-zinc-300">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 pl-10 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive font-medium animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-md font-semibold mt-2 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <p className="text-xs text-center text-zinc-400 mt-4">
                Default: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">admin</code> / <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">admin123</code>
              </p>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-6 pb-6 bg-zinc-50/50 dark:bg-zinc-800/20">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center px-6">
              Secure access for Kirana Store administrators.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
