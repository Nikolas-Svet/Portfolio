// Декодирует JWT-токен (без валидации подписи)
export function parseJwt(token: string | null) {
    if (!token) return null;

    try {
        return JSON.parse(atob(token.split('.')[1])); // Декодируем payload
    } catch (error) {
        console.error('Ошибка при разборе JWT:', error);
        return null;
    }
}

// Проверяет, истёк ли токен
export function isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
}
