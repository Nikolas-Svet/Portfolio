import { request } from "@/api/request.ts";

export const apiGames = {
    async getGames() {
        try {
            const response = await request.get("/api/games/");
            return response.data;
        } catch (error: any) {
            console.error("Ошибка загрузки игр:", error);
            return { success: false, error };
        }
    },

    async getGame(id: number) {
        try {
            const response = await request.get(`/api/games/${id}/`);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка загрузки игр:", error);
            return { success: false, error };
        }
    },

    async createGame(opponentId: number, is_home_game: boolean) {
        try {
            const response = await request.post("/api/games/", {
                team: 1,
                opponent: opponentId,
                date: new Date().toISOString(),
                status: "upcoming",
                is_home_game: is_home_game
            });

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка создания игры:", error);
            return { success: false, error };
        }
    },
    async cancelEvent(id: number) {
        try {
            const response = await request.delete(`/api/game-stats/last/?game_id=${id}`);

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка удалении события:", error);
            return { success: false, error };
        }
    },

    async deleteGame(id: number) {
        try {
            const response = await request.delete(`/api/games/${id}/`);
            console.log("Ответ сервера:", response.data);
            if (response.status === 204) {
                return true
            } else {
                return false;
            }
        } catch (error: any) {
            console.error("Ошибка создания игры:", error);
            return { success: false, error };
        }
    },

    async updateGame(opponentId: number, status: string, id: number, date: string) {
        try {
            const response = await request.put(`/api/games/${id}/`, {
                date: date,
                team: 1,
                opponent: opponentId,
                status: status,
            });

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка создания игры:", error);
            return { success: false, error };
        }
    },

    async startGame(status: string, id: number) {
        try {
            const response = await request.patch(`/api/games/${id}/`, {
                status: status,
            });

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка создания игры:", error);
            return { success: false, error };
        }
    },

    async getStatistic(id: number) {
        try {
            const response = await request.get(`/api/games/${id}/statistics/`);

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка создания игры:", error);
            return { success: false, error };
        }
    },

    async setStatsGame(statistic: any) {
        try {
            const response = await request.post(`/api/game-stats/`, {
                game: statistic.game,
                player: statistic.player,
                action: statistic.action,
                assistant: statistic.assistant,
                is_successful: statistic.is_successful,
                quarter: statistic.quarter,
                game_time: statistic.game_time
            });

            console.log("Ответ сервера:", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Ошибка создания игры:", error);
            return { success: false, error };
        }
    }
};
