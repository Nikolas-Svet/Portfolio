import { request } from "@/api/request.ts";
import type {IPlayer, Player} from "@/types/player";

export interface PlayerInGame {
    game: number;
    player_in: number;
    player_out: number;
    quarter: number;
    game_time: string;
}

export const apiPlayers = {
    async getPlayers(): Promise<IPlayer[] | []> {
        try {
            const response = await request.get("/api/players/");
            return response.data;
        } catch (error: any) {
            console.error("Ошибка загрузки игроков:", error);
            return [];
        }
    },

    // **Обновление полного объекта игрока через `PUT`**
    async updatePlayer(playerId: number, updatedData: Player) {
        try {
            const response = await request.put(`/api/players/${playerId}/`, updatedData);
            return response.data;
        } catch (error: any) {
            console.error(`Ошибка обновления игрока с ID ${playerId}:`, error);
            return { success: false, error };
        }
    },

    async updatePlayerInGame(updatedData: PlayerInGame) {
        try {
            const response = await request.post(`/api/game-stats/substitution/`, updatedData);
            return response.data;
        } catch (error: any) {
            console.error(`Ошибка обновления игрока`, error);
            return { success: false, error };
        }
    },
};
