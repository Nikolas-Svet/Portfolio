import {request} from "@/api/request.ts";

export const apiTeamOpponent = {
    async createOpponentTeam(name: string, color: string) {
        try {
            const response = await request.post("/api/opponent-teams/", {
                name,
                color,
            });

            return response.data; // Ожидаем ID созданной команды
        } catch (error: any) {
            // console.error("Ошибка создания команды:", error);

            if (error.response && error.response.status === 400) {
                console.warn("⚠️ Сервер вернул 400:", error.response.data);
                return { success: false, error: error.response.data.name }; // Возвращаем ошибки валидации
            }
            return { success: false, error };
        }
    },
    async getOpponentTeam(id: number) {
        try {
            const response = await request.get(`/api/opponent-teams/${id}/`);

            return response.data;
        } catch (error: any) {
            console.error("Ошибка получения команды соперника:", error);
            return { success: false, error };
        }
    },
}