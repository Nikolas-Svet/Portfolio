import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useScreenStore = defineStore('screen', () => {
    const screen = ref(true); // ✅ Теперь реактивное значение

    function setScreen(value: boolean) {
        console.log("setScreen вызван:", value);
        screen.value = value; // ✅ Теперь Vue будет отслеживать изменения
    }

    return { screen, setScreen };
});
