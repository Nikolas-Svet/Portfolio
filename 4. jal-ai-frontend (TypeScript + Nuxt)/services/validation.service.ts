export default class ValidationService {
    public isEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(email)
    }

    public formatPostalCodeValue(answer: string | number | null | undefined): string | null {
        if (answer === null || answer === undefined) {
            return null
        }

        if (typeof answer === 'number') {
            return null
        }

        const normalized = answer.trim()
        if (!normalized || !Number.isNaN(Number(normalized))) {
            return null
        }

        try {
            const parsed = JSON.parse(normalized) as {
                postal_code?: string
                city?: string
                state?: string
            }

            if (!parsed.postal_code || !parsed.city || !parsed.state) {
                return null
            }

            return `${parsed.postal_code}, ${parsed.city}, ${parsed.state}`
        } catch {
            return null
        }
    }
}
