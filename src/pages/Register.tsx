import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/hooks/useLanguage'
import { GoogleIcon } from '@/components/common/GoogleIcon'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { DISTRICT_KEYS } from '@/config/districts'
import { getMandalsForDistrict } from '@/config/mandals'
import { Mail, Lock, User, UserPlus, MapPin } from 'lucide-react'
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
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 mb-3">
                        <UserPlus className="size-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {t('auth.registerTitle')}
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

                                <div className="relative py-2">
                                    <Separator />
                                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                                        {t('auth.orContinueWith')}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleSignUp}
                                    className="w-full"
                                >
                                    <GoogleIcon />
                                    Google
                                </Button>
                            </FieldGroup>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            {t('auth.hasAccount')}{' '}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                {t('auth.loginTitle')}
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
