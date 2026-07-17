import { useTranslation } from 'react-i18next'
import { Camera } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { ScanFlow } from './ScanFlow'

interface ScanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

/**
 * Disease-scan flow presented as an overlay Dialog (Vercel pattern for a
 * self-contained flow). Wraps the shared <ScanFlow> body. Used by DiseaseList.
 */
export function ScanDialog({ open, onOpenChange }: ScanDialogProps) {
    const { t } = useTranslation()
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Camera className="size-4 text-muted-foreground" />
                        {t('scanner.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('scanner.subtitle')}
                    </DialogDescription>
                </DialogHeader>
                <ScanFlow />
            </DialogContent>
        </Dialog>
    )
}
