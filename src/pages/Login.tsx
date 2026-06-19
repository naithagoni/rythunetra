import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { Mail, Lock, LogIn } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

export function LoginPage() {
    const { t } = useTranslation()
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('errors.generic'))
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t('errors.generic'))
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                        <LogIn className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {t('auth.loginTitle')}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('home.heroSubtitle')}
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6 sm:p-8">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">
                                    {t('auth.email')}
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="pl-10"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password">
                                    {t('auth.password')}
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="pl-10"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full"
                            >
                                {loading
                                    ? t('common.loading')
                                    : t('auth.loginTitle')}
                            </Button>
                        </form>

                        <div className="relative my-6">
                            <Separator />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                                {t('auth.orContinueWith')}
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            className="w-full gap-2"
                        >
                            <GoogleIcon />
                            Google
                        </Button>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            {t('auth.noAccount')}{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                {t('auth.registerTitle')}
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
