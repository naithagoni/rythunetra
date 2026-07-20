import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { LogoMark } from '@/components/common/LogoMark'
import { Mail, Lock } from 'lucide-react'
import { toast } from 'sonner'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
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
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-6">
                    <LogoMark size="lg" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-display-sm">
                            {t('auth.loginTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('home.heroSubtitle')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
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
                                    size="lg"
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading
                                        ? t('common.loading')
                                        : t('auth.loginTitle')}
                                </Button>

                                <div className="relative py-1">
                                    <Separator />
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground uppercase tracking-wide font-mono">
                                        {t('auth.orContinueWith')}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="lg"
                                    onClick={handleGoogleLogin}
                                    className="w-full"
                                >
                                    <GoogleIcon />
                                    Google
                                </Button>
                            </FieldGroup>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-muted-foreground">
                            {t('auth.noAccount')}{' '}
                            <Link
                                to="/register"
                                className="text-tertiary-link hover:underline font-medium"
                            >
                                {t('auth.registerTitle')}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
