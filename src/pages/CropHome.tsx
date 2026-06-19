import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useCrops } from '@/hooks/useCrops'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { getCropImage, HERO_IMAGE } from '@/utils/cropImages'
import { localize } from '@/types/i18n'
import type { LanguageCode } from '@/types/i18n'
import { Button } from '@/components/ui/button'

export function CropHomePage() {
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()
    const { user } = useAuth()
    usePageTitle('Crops — Browse 30+ Telangana Crops')
    const lang = i18n.language as LanguageCode
    const { data: crops = [], isLoading, isError } = useCrops()

    const handleCropSelect = (cropId: string) => {
        navigate(`/crops/${cropId}`)
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col">
            {/* Hero Banner */}
            <div className="relative overflow-hidden">
                <img
                    src={HERO_IMAGE}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/60 to-black/80" />
                <div className="relative px-4 pt-14 pb-16 sm:pt-18 sm:pb-20 text-center">
                    <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                        {user
                            ? t('cropHome.greetingUser')
                            : t('cropHome.greeting')}{' '}
                        👋
                    </h1>
                    <p className="text-white/70 mt-3 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
                        {t('cropHome.subtitle')}
                    </p>
                </div>
            </div>

            {/* Crop Grid */}
            <div className="px-3 sm:px-4 -mt-6 relative z-10 flex-1">
                {isLoading ? (
                    <LoadingSpinner />
                ) : isError || crops.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 shadow-sm">
                            <span className="text-3xl">🌱</span>
                        </div>
                        <p className="text-lg font-semibold text-foreground mb-1">
                            {t('cropHome.cropsUnavailable')}
                        </p>
                        <p className="text-sm text-muted-foreground mb-5">
                            {t('cropHome.cropsUnavailableHint')}
                        </p>
                        <Button onClick={() => navigate('/diseases')}>
                            🔍 {t('cropHome.allDiseases')}
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                        {crops.map((crop) => {
                            const cropName = localize(crop.name, lang)
                            const imgSrc = getCropImage(crop.imageUrl)

                            return (
                                <button
                                    key={crop.id}
                                    onClick={() => handleCropSelect(crop.id)}
                                    className="group relative aspect-square rounded-2xl overflow-hidden active:scale-[0.97] transition-all duration-200 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <img
                                        src={imgSrc}
                                        alt={cropName}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-3 pt-6 text-center">
                                        <span className="text-white text-[13px] sm:text-sm font-semibold leading-tight">
                                            {cropName}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
