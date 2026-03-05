import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBasket, Loader2, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulated login for UI demonstration
        setTimeout(() => {
            toast({
                title: 'Success!',
                description: 'You have successfully logged in (Demo Mode).',
            });
            setLoading(false);
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl max-h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <Card className="w-full max-w-md shadow-2xl border-zinc-200 dark:border-zinc-800 relative z-10 backdrop-blur-xl bg-white/80 dark:bg-zinc-900/80">
                <CardHeader className="space-y-3 pb-6 text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                        <ShoppingBasket className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
                        Kirana Admin
                    </CardTitle>
                    <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@kirana.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="h-12 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-300">Password</Label>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                    className="h-12 bg-white dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 transition-all focus:ring-2 focus:ring-primary/20 pr-10"
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
                        <Button
                            type="submit"
                            className="w-full h-12 text-md font-semibold mt-2 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800 pt-6 pb-6">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center px-6">
                        Secure login for Kirana Admin. Only registered administrators can access this system.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
