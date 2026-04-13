import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        userId: null as number | null,
    }),
    actions: {
        setUserId(id: number) {
            console.log("SET")
            this.userId = id;
        },
        clearUser() {
            this.userId = null;
        },
    },
});
