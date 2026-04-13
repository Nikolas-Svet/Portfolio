import { nextTick } from 'vue'

const setScrollBehavior = (value: string): void => {
    if (typeof document === 'undefined') {
        return
    }

    document.documentElement.style.scrollBehavior = value
}

export const resetScrollBehavior = (duration = 1000): void => {
    if (typeof document === 'undefined') {
        return
    }

    setScrollBehavior('auto')

    window.setTimeout(() => {
        setScrollBehavior('')
    }, duration)
}

export const scrollToSectionFromHash = async (allowedRoutes: string[]): Promise<void> => {
    if (typeof window === 'undefined') {
        return
    }

    await new Promise((resolve) => window.setTimeout(resolve, 1))

    const hash = window.location.hash
    if (!hash || !allowedRoutes.includes(`/${hash}`)) {
        return
    }

    setScrollBehavior('auto')

    await nextTick()

    const target = document.querySelector(hash)
    if (target) {
        target.scrollIntoView({ behavior: 'auto', block: 'start' })
    }

    window.setTimeout(() => {
        setScrollBehavior('')
    }, 10)
}
