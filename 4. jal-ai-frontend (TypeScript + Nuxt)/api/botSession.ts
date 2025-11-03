import {request} from './request'
import type {responseApi, responseSession} from "@/types/api";

export const botSessionApi = {
    async createSession(): Promise<responseApi> {
        try {
            const response = await request.post(`/questionnaire/requests/`, {template: 4}, {withCredentials: true})

            if (response.status === 201) {
                return {success: true, data: response.data as responseSession}
            } else {
                return {success: false, data: response.data}
            }
        } catch (error: any) {
            console.error('Не удалось создать сессию:', error)
            return {success: false, data: error.data}
        }
    },
    async sendEmail(email: string): Promise<responseApi> {
        try {
            const response = await request.post(`/questionnaire/login/`, {email: email}, {withCredentials: true})

            if (response.status === 201 || response.status === 200) {
                localStorage.setItem("email", email);
                return {success: true, data: response.data as responseSession}
            } else {
                return {success: false, data: response.data}
            }
        } catch (error: any) {
            console.error('Не удалось создать сессию:', error)
            return {success: false, data: error.data}
        }
    }
}