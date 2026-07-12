import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { Mail, Lock, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'

export function LoginPage() {
    const { t } = useTranslation()
    const { signIn, signInWithGoogle } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await signIn(email, password)
            navigate('/')
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : t('errors.generic'),
            )
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : t('errors.generic'),
            )
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 mb-3">
                        <LogIn className="size-6 text-primary" />
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
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="email">
                                        {t('auth.email')}
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Mail />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </InputGroup>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">
                                        {t('auth.password')}
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Lock />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                        />
                                    </InputGroup>
                                </Field>

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading
                                        ? t('common.loading')
                                        : t('auth.loginTitle')}
                                </Button>

                                <div className="relative py-2">
                                    <Separator />
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                                        {t('auth.orContinueWith')}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleLogin}
                                    className="w-full"
                                >
                                    <GoogleIcon />
                                    Google
                                </Button>
                            </FieldGroup>
                        </form>

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
