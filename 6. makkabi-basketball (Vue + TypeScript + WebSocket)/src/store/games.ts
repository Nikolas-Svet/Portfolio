import {defineStore} from 'pinia';
import type {IGame} from "@/types/games"

export const useGamesStore = defineStore('games', {
    state: () => ({
        games: [] as IGame[],
    }),

    actions: {
        setGames(games: IGame[]) {
            console.log("✅ Добавление игр:", games);

            this.games = games;
        },

        removeGames(gameId: number) {
            console.log("🗑 Удаление команды с ID:", gameId);
            this.games = this.games.filter(game => game.id !== gameId);
        },

        clearAllGames() {
            console.log("🚨 Очистка всех команд");
            this.games = [];
        }
    },
});
