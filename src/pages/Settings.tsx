import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { useLanguage } from '@/hooks/useLanguage'
import { usePageTitle } from '@/hooks/usePageTitle'
import { updateUserProfile } from '@/services/authService'
import { LanguageToggle } from '@/components/common/LanguageToggle'
import { CustomDropdown } from '@/components/common/CustomDropdown'
import { DISTRICT_KEYS } from '@/config/districts'
import { getMandalsForDistrict } from '@/config/mandals'
import {
    Shield,
    LogOut,
    FlaskConical,
    ChevronRight,
    MapPin,
} from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Section } from '@/components/common/Section'
import { PageHeader } from '@/components/common/PageHeader'
import { PageContainer } from '@/components/common/PageContainer'

export function SettingsPage() {
    const { t } = useTranslation()
    const { user, signOut } = useAuth()
    const { isAdmin } = useAdmin()
    const { currentLanguage } = useLanguage()
    usePageTitle('Settings')
    const navigate = useNavigate()
    const [name, setName] = useState(user?.name || '')
    const [district, setDistrict] = useState(user?.district || '')
    const [mandal, setMandal] = useState(user?.mandal || '')
    const [saving, setSaving] = useState(false)

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

    const handleUpdateProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            await updateUserProfile(
                user!.id,
                { name, district, mandal },
                currentLanguage,
            )
            toast.success(t('settings.saved'))
        } catch {
            toast.error(t('errors.generic'))
        } finally {
            setSaving(false)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <PageContainer size="sm">
            <PageHeader title={t('settings.title')} />

            <div className="flex flex-col gap-6">
                {/* Quick Links — hairline rows */}
                <Section title={t('settings.title')} flush>
                    <div className="divide-y divide-border">
                        <Link
                            to="/my-preparations"
                            className="flex items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <FlaskConical className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {t('common.myPreparations')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t('settings.myPrepsDesc')}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="flex items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <Shield className="size-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {t('common.admin')}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t('settings.adminDesc')}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="size-4 text-muted-foreground" />
                            </Link>
                        )}
                    </div>
                </Section>

                {/* Profile — settings card with footer save bar */}
                <form onSubmit={handleUpdateProfile}>
                    <Section
                        title={t('settings.profile')}
                        description={t('settings.districtDesc')}
                        footerHint={t('settings.district')}
                        footerAction={
                            <Button
                                type="submit"
                                disabled={saving || !district || !mandal}
                            >
                                {saving
                                    ? t('common.loading')
                                    : t('common.save')}
                            </Button>
                        }
                    >
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="settings-name">
                                    {t('auth.name')}
                                </FieldLabel>
                                <Input
                                    id="settings-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="settings-email">
                                    {t('auth.email')}
                                </FieldLabel>
                                <Input
                                    id="settings-email"
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                />
                            </Field>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="settings-district">
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
                                        placeholder={t(
                                            'settings.selectDistrict',
                                        )}
                                        ariaLabel={t('settings.district')}
                                        variant="form"
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="settings-mandal">
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
                            </div>
                        </FieldGroup>
                    </Section>
                </form>

                {/* Language */}
                <Section
                    title={t('settings.language')}
                    description={t('settings.languageDesc')}
                    headerAction={<LanguageToggle />}
                >
                    <p className="text-sm text-muted-foreground">
                        {t('settings.languageDesc')}
                    </p>
                </Section>

                {/* Account */}
                <Section
                    title={t('settings.account')}
                    footerHint={user?.email}
                    footerAction={
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                        >
                            <LogOut data-icon="inline-start" />
                            {t('auth.signOut')}
                        </Button>
                    }
                >
                    <p className="text-sm text-muted-foreground">
                        {t('settings.account')}
                    </p>
                </Section>
            </div>
        </PageContainer>
    )
}
