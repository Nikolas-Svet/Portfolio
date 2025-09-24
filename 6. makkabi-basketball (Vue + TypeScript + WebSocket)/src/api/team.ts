import { request } from './request';

export const apiTeam = {
    async createTeam(name: string, color: string, coachId: number) {
        try {
            const response = await request.post("/api/teams/", {
                name,
                color,
                coach_id: coachId,
            });

            return response.data; // Ожидаем ID созданной команды
        } catch (error: any) {
            console.error("Ошибка создания команды:", error);
            return { success: false, error };
        }
    },

    async getTeam(id: number) {
        try {
            const response = await request.get(`/api/teams/${id}/`)

            return response.data;
        } catch (error: any) {
            console.error("Ошибка создания команды:", error);
            return { success: false, error };
        }
    },
}