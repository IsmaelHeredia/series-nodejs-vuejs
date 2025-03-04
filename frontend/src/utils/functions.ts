export function generateToast(status: string) {
    const timeout = Number(import.meta.env.VITE_TOAST_TIMEOUT);
    return {
        duration: timeout,
        cardProps: {
            color: status,
            class: 'toast text-h2',
        },
    };
}