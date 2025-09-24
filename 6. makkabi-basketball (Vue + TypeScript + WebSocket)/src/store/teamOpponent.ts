import {defineStore} from 'pinia';
import type {IteamOpponent} from "@/types/teamOpponent"

export const useTeamOpponentStore = defineStore('teamOpponent', {
    state: () => ({
        opponentTeams: [] as IteamOpponent[],
    }),

    actions: {
        setTeamOpponent(opponentTeams: IteamOpponent[]) {
            console.log("✅ Добавление команды:", opponentTeams);

            this.opponentTeams = opponentTeams;
        },

        removeTeamOpponent(teamId: number) {
            console.log("🗑 Удаление команды с ID:", teamId);
            this.opponentTeams = this.opponentTeams.filter(team => team.id !== teamId);
        },

        clearAllTeams() {
            console.log("🚨 Очистка всех команд");
            this.opponentTeams = [];
        }
    },
});
