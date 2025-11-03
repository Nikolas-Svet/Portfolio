<script lang="ts" setup>
import LogoIcon from '@/assets/images/logo.svg';
import ArrowIcon from "@/assets/images/arrowPath.svg";
import ComponentBotDialog from "@/components/bot/componentBotDialog.vue";
import {useMessagesStore} from "@/stores/messages";
import Message from "@/composition/message";
import {Consts} from "@/consts";

const props = defineProps({
  isOpenDialog: {
    type: Boolean,
    required: true,
  }
})

const messagesStore = useMessagesStore()

const messages = computed(() => messagesStore.messages)

const closeDialog = () => {
  messagesStore.setIsOpenDialog(false)
}

watch(() => props.isOpenDialog, async (newVal) => {
  if (newVal) {

    messagesStore.setMessages([])

    const email = localStorage.getItem("email")
    const currentTemplate = Number(localStorage.getItem("currentTemplate"))
    const sessionId = localStorage.getItem("sessionId")

    if (currentTemplate === Consts.Template.first || !email) {
      messagesStore.addMessage({
        id: 0,
        slug: "0",
        text: "Hallo, ich bin Sara ihre digitale Assistentin. Nutzen Sie Ihre Chance auf staatliche Unterstützung! Beantworten Sie kurz die folgenden Fragen – unser System prüft sofort, ob Sie förderfähig sind.",
        required: false,
        answer_type: "0",
        is_user: false,
      })
      messagesStore.addMessage({
        id: -1,
        slug: "0",
        text: "Um Sie immer so präzise wie möglich beraten zu können brauchen wir Ihre E-Mail Adresse, bitte geben Sie die ein",
        required: false,
        answer_type: "0",
        template: 1,
        is_user: false,
      })
    }

    if (email && sessionId) {
      console.log("[Log] выполняем загрузку сообщений, email и sessionId в локальном хранилище есть")


      if (currentTemplate == Consts.Template.first) {
        const mes = {
          id: 0,
          slug: "0",
          value: localStorage.getItem("email"),
          required: false,
          answer_type: "0",
          template: 1,
          is_user: true,
          file_name: null,
          file_size: null,
        }
        messagesStore.addMessage(mes)
      }

      const message = new Message(null)

      await message.loadMessages()
      await message.addMessage()
    }
  }
});

</script>

<template>
  <div :class="{'bot__content--open': props.isOpenDialog}" class="bot__content">
    <div class="bot__title">
      <div class="bot__title--left">
        <div class="bot__logo">
          <LogoIcon class="content__logo"/>
          Jal
          <div>
            Ai
          </div>
        </div>
      </div>
      <div class="bot__title--right" @click="closeDialog">
        <ArrowIcon/>
      </div>
    </div>
    <component-bot-dialog :messages="messages"/>
  </div>
</template>

<style lang="scss" scoped>
.bot {
  &__content {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    position: fixed;
    z-index: 3;
    border-radius: 12px;
    left: min(100dvw - 435px, (100dvw - 1440px) / 2 + 984px);
    bottom: 32px;
    max-width: 400px;
    width: 100%;
    aspect-ratio: 400/534;
    min-height: 400px;
    clip-path: inset(100% 0 0 100%);
    background-color: $primary-background-color-bot;
    transition: clip-path 0.3s ease;

    &--open {
      clip-path: inset(0 0 0 0) !important;
    }
  }

  &__title {
    width: 100%;
    padding: 24px 16px;
    display: flex;
    align-items: center;

    &--left {
      flex: 1
    }

    &--right {
      border-radius: calc($primary-radius / 2);
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 40px;
      aspect-ratio: 1/1;
      background-color: $primary-green;
      cursor: pointer;

      svg {
        transform: rotate(90deg) scale(1.5);
      }
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 100px;

    svg {
      height: 30px;
      width: 30px;
    }

    font-size: 20px;
    font-family: $Inter-Regular;
    font-weight: 400;
    margin-right: 8px;
    color: $default-white;
    line-height: 1;
    text-transform: uppercase;

    div {
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px 4px 4px 0;
      background-color: $default-white;

      font-size: 14px;
      font-family: $Inter-Medium;
      font-weight: 500;
      color: $primary-green;
      line-height: 1;
    }
  }

  &__subtitle {
    margin-top: 4px;
    font-size: 16px;
    font-family: $Inter-Regular;
    font-weight: 400;
    opacity: 0.8;
    color: $default-white;
    line-height: 1;
  }
}

@media (width < 768px) {
  .bot {
    &__content {
      bottom: 20px;
      right: 20px;
      left: auto;
    }
  }
}

@media (width < 440px) {
  .bot {
    &__content {
      max-width: 440px;
      aspect-ratio: 400/564;
      bottom: 20px;
      right: 0;
      left: auto;
    }
  }
}
</style>