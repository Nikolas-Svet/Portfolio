import {request} from "@/api/request.ts";

export const statisticsApi = {
    async getStatistic(id: number) {
        try {
            const response = await request.get(`/api/games/${id}/statistics/`);

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка получении статистики:", error);
            return { success: false, error };
        }
    },
}