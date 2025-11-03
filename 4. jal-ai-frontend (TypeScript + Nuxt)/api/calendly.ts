import {request} from './request'
import type {responseApi} from "@/types/api";

export const calendlyApi = {
    async getCalendly(): Promise<responseApi> {
        try {
            const response = await request.get(`/questionnaire/zoho/bookings/link/`)
            if (response.status === 200) {
                return { success: true, data: response.data as { booking_url: string } }
            } else {
                return { success: false, data: response.data }
            }
        } catch (error: any) {
            console.error('Не удалось создать сессию:', error)
            return { success: false, data: error.data }
        }
    }
}