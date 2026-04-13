import { request } from './request';

export const authApi = {
    async SignUp(username: string, password: string, email: string, role: string) {
        try {
            const response = await request.post('/api/auth/register/', {
                username,
                email,
                password,
                role
            });

            if (response.status === 201) {
                console.log("Registration successful", response.data);
                return { success: true };
            }

            return { success: false, error: response.data };
        } catch (error: any) {
            if (error.response && error.response.data) {
                return { success: false, error: error.response.data };
            }
            return { success: false, error: "Не удалось зарегистрироваться" };
        }
    },

    async SignIn(username: string, password: string) {
        try {
            const response = await request.post('/api/auth/login/', { username, password });

            const { access, refresh } = response.data;

            if (access && refresh) {
                localStorage.setItem('access_token', access);
                localStorage.setItem('refresh_token', refresh);
                return { success: true };
            }

            return { success: false, error: "Invalid response from server" };
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.detail) {
                return { success: false, error: error.response.data.detail };
            }
            return { success: false, error: "Login failed. Please check your credentials." };
        }
    }
};
