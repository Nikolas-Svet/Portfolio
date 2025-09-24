import { defineStore } from 'pinia';

export const useTeamStore = defineStore('team', {
    state: () => ({
        teamId: null as number | null,
        nameTeam: null as string | null,
        color: null as string | null,
        coachId: null as number | null,
    }),
    actions: {
        setTeam(teamId: number, nameTeam: string, color: string, coachId: number) {
            console.log("SET TEAM")
            this.teamId = teamId;
            this.nameTeam = nameTeam;
            this.coachId = coachId;
            this.color = color;
        },
        clearTeam() {
            this.teamId = null;
            this.nameTeam = null;
            this.coachId = null;
            this.color = null;
        },
    },
});
