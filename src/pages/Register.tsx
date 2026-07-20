import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { DISTRICT_KEYS } from '@/config/districts'
import { getMandalsForDistrict } from '@/config/mandals'
import { Mail, Lock, User, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { LogoMark } from '@/components/common/LogoMark'
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

export function RegisterPage() {
    const { t } = useTranslation()
    const { signUp, signInWithGoogle } = useAuth()
    const { currentLanguage } = useLanguage()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [district, setDistrict] = useState('')
    const [mandal, setMandal] = useState('')
    const [loading, setLoading] = useState(false)

    const districtOptions = useMemo(
        () =>
            DISTRICT_KEYS.map((d) => ({
                value: d,
                label: t(`districts.${d}`),
            })),
        [t],
    )

    const mandalOptions = useMemo(
        () =>
            getMandalsForDistrict(district).map((m) => ({
                value: m.key,
                label: currentLanguage === 'te' ? m.te : m.en,
            })),
        [district, currentLanguage],
    )

    const handleDistrictChange = (value: string) => {
        setDistrict(value)
        setMandal('')
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!district) {
            toast.error(t('settings.selectDistrict'))
            return
        }
        setLoading(true)
        try {
            await signUp(email, password, name, district, mandal)
            navigate('/')
        } catch (err: unknown) {
            toast.error(
                err instanceof Error ? err.message : t('errors.generic'),
            )
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignUp = async () => {
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
                            {t('auth.registerTitle')}
                        </CardTitle>
                        <CardDescription>
                            {t('home.heroSubtitle')}
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        {t('auth.name')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <User />
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            placeholder={t('auth.name')}
                                            required
                                        />
                                    </InputGroup>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">
                                        {t('auth.email')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
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
                                        {t('auth.password')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
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

                                <Field>
                                    <FieldLabel htmlFor="register-district">
                                        <MapPin className="size-4" />
                                        {t('settings.district')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <CustomDropdown
                                        options={districtOptions}
                                        value={district}
                                        onChange={handleDistrictChange}
                                        placeholder={t('settings.selectDistrict')}
                                        ariaLabel={t('settings.district')}
                                        variant="form"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="register-mandal">
                                        <MapPin className="size-4" />
                                        {t('settings.mandal')}{' '}
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    </FieldLabel>
                                    <CustomDropdown
                                        options={mandalOptions}
                                        value={mandal}
                                        onChange={setMandal}
                                        placeholder={
                                            district
                                                ? t('settings.selectMandal')
                                                : t(
                                                      'settings.selectDistrictFirst',
                                                  )
                                        }
                                        ariaLabel={t('settings.mandal')}
                                        variant="form"
                                    />
                                </Field>

                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={
                                        loading ||
                                        !name.trim() ||
                                        !email.trim() ||
                                        !password ||
                                        !district ||
                                        !mandal
                                    }
                                    className="w-full"
                                >
                                    {loading
                                        ? t('common.loading')
                                        : t('auth.registerTitle')}
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
                                    onClick={handleGoogleSignUp}
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
                            {t('auth.hasAccount')}{' '}
                            <Link
                                to="/login"
                                className="text-tertiary-link hover:underline font-medium"
                            >
                                {t('auth.loginTitle')}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
