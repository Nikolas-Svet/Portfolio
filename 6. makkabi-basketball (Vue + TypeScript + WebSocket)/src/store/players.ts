import {defineStore} from 'pinia';
import type {IPlayer} from "@/types/player"

export const usePlayersStore = defineStore('players', {
    state: () => ({
        players: [] as IPlayer[],
    }),

    actions: {
        setPlayers(players: IPlayer[]) {
            console.log("[Pinia/players] Добавление игроков:", players);

            this.players = players;
        },

        removePlayers(playerId: number) {
            console.log("[Pinia/players] Удаление игрока с ID:", playerId);
            this.players = this.players.filter(player => player.id !== playerId);
        },

        clearAllPlayers() {
            console.log("[Pinia/players] Очистка всех игроков");
            this.players = [];
        }
    },
});
