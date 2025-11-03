<script setup lang="ts">
import LogoBotIcon from '@/assets/images/logoBot.svg';
import ComponentBotContent from "@/components/bot/componentBotContent.vue";
import {useMessagesStore} from "@/stores/messages";

const messagesStore = useMessagesStore()

const isOpenDialog = computed(() => messagesStore.isOpenDialog);

const openBot = async () => {
  // if (!localStorage.getItem("sessionId")) {
  //   const response = await botSessionApi.createSession();
  //   if (response.success) {
  //     localStorage.setItem("sessionId", JSON.stringify(response.data.id));
  //   }
  // }
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
  <div @click="openBot" class="bot__icon">
    <LogoBotIcon/>
  </div>
  <component-bot-content :is-open-dialog="isOpenDialog" @close-dialog="isOpenDialog = false"/>
</template>

<style scoped lang="scss">

@keyframes glow {
  0% {
    box-shadow:
        0 8px 16px 0 #8BE8DE33;
  }
  50% {
    box-shadow:
        0 10px 16px 0 #75DCD166,
        0 -10px 16px 0 #75DCD166;
  }
  100% {
    box-shadow:
        0 8px 16px 0 #8BE8DE33;
  }
}
.bot {
  position: sticky;
  bottom: 32px;
  left: min(calc(100dvw - 106px), calc(((100dvw - 1440px) / 2) + 1348px));

  &__icon {
    z-index: 3;
    position: fixed;
    box-shadow: 0 8px 16px 0 #8BE8DE33;
    left: min(calc(100dvw - 106px), calc(((100dvw - 1440px) / 2) + 1314px));
    bottom: 32px;
    height: 72px;
    width: 72px;
    border-radius: 50%;
    background: linear-gradient(180deg, #12BBA9 -27.03%, #0D796D 104.05%);
    transition: transform 0.3s ease;

    animation: glow 2s ease-in-out infinite;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      box-shadow: 0 8.43px 16.86px 0 #75DCD166, 0 -8.43px 16.86px 0 #75DCD166;
      transform: scale(1.07);
    }

    svg {
      width: 65px;
      filter:
          drop-shadow(0 4px 12px rgba(8, 75, 68, 0.55))
          drop-shadow(0 -2px 12px rgba(8, 75, 68, 0.12));
    }
  }
}

@media (width < 768px) {
  .bot {
    &__icon {
      left: auto;
      right: 20px;
      bottom: 20px;
    }
  }
}
</style>