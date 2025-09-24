import { ref, onMounted, onBeforeUnmount } from "vue";

const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);

const updateOrientation = () => {
    isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
    console.log("useScreen.ts → Ориентация изменилась:", isPortrait.value);
};

export function useScreen() {
    onMounted(() => {
        updateOrientation();
        window.addEventListener("resize", updateOrientation);
        window.addEventListener("orientationchange", updateOrientation);
    });

    onBeforeUnmount(() => {
        window.removeEventListener("resize", updateOrientation);
        window.removeEventListener("orientationchange", updateOrientation);
    });

    return { isPortrait };
}
