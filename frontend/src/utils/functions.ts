
import { mdiCheck, mdiAlert, mdiCancel } from '@mdi/js';

export function generateToast(status: string) {
    const timeout = Number(import.meta.env.VITE_TOAST_TIMEOUT);
    if (status == "success") {
        return {
            duration: timeout,
            cardProps: {
                color: 'success',
                class: 'toast',
            },
            prependIcon: mdiCheck
        }
    }
    else if (status == "warning") {
        return {
            duration: timeout,
            cardProps: {
                color: 'warning',
                class: 'toast',
            },
            prependIcon: mdiAlert
        }
    }
    else if (status == "error") {
        return {
            duration: timeout,
            cardProps: {
                color: 'success',
                class: 'toast',
            },
            prependIcon: mdiCancel
        }
    }
}