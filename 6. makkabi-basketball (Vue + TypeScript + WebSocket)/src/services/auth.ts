import { parseJwt, isTokenExpired } from './jwt';
import { useUserStore } from '@/store/user';

// Получает токены из localStorage
export function getTokens() {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    return { accessToken, refreshToken };
}

// Проверяет и логирует данные Access Token
export function checkAccessToken() {
    const { accessToken } = getTokens();

    if (accessToken) {
        const payload = parseJwt(accessToken);

        if (payload) {
            console.log('Данные Access Token:', payload);
            console.log('ID пользователя:', payload.user_id || 'Не найдено');
            console.log('Роль пользователя:', payload.role || 'Не указано');
            console.log('Дата выпуска токена:', new Date(payload.iat * 1000));
            console.log('Дата истечения токена:', new Date(payload.exp * 1000));
        }

        if (isTokenExpired(accessToken)) {
            console.warn('⚠️ Access Token истёк. Удаляем токены.');
            removeTokens();
        }
    }
}

// Проверяет и логирует данные Refresh Token
export function checkRefreshToken() {
    const { refreshToken } = getTokens();
    const userStore = useUserStore();

    if (refreshToken) {
        const refreshPayload = parseJwt(refreshToken);

        if (refreshPayload) {
            console.log('Данные Refresh Token:', refreshPayload);
            console.log('ID пользователя:', refreshPayload.user_id || 'Не найдено');
            console.log('Уникальный идентификатор токена (jti):', refreshPayload.jti);
            console.log('Дата выпуска токена:', new Date(refreshPayload.iat * 1000));
            console.log('Дата истечения токена:', new Date(refreshPayload.exp * 1000));
        }

        if (refreshPayload.user_id) {
            userStore.setUserId(refreshPayload.user_id);
        }

        if (isTokenExpired(refreshToken)) {
            console.warn('⚠️ Refresh Token истёк. Удаляем токены.');
            removeTokens();
        }
    }
}

// Удаляет токены из localStorage
export function removeTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}
