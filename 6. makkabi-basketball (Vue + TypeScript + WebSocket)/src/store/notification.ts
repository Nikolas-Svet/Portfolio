import { defineStore } from "pinia";
import { reactive } from "vue";
import type {INotification} from "@/types/notification.ts";
import {timer_notification} from "@/services/consts.ts";

export const useNotificationStore = defineStore("notification", () => {
    const notification = reactive<INotification>({
        message: null,
        timer: timer_notification,
        close: false
    });
    return { notification };
});
