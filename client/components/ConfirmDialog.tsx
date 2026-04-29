import { AlertModal } from '@/components/ui/Modal'
import { useUIStore } from '@/store/uiStore'

export function ConfirmDialog() {
    const { confirmDialog, closeConfirm } = useUIStore()

    const handleConfirm = () => {
        confirmDialog.onConfirm?.()
        closeConfirm()
    }

    return (
        <AlertModal
            open={confirmDialog.open}
            title={confirmDialog.title}
            message={confirmDialog.message}
            onClose={closeConfirm}
            onConfirm={handleConfirm}
            confirmLabel="Confirm"
            danger
        />
    )
}
