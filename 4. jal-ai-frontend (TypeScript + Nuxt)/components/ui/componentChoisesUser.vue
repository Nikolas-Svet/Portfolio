<script setup lang="ts">
import {useMessagesStore} from "@/stores/messages";
import BotConversationService, {type BotMessagePayload} from "@/services/bot-conversation.service";

const props = withDefaults(defineProps<{
  choices: string[]
}>(), {
  choices: () => [],
})

const messagesStore = useMessagesStore()

const sendMessage = async (textData: string) => {
  const data: BotMessagePayload = {
    sessionId: Number(localStorage.getItem('sessionId')),
    messageId: messagesStore.currentMessageId,
    text: textData,
    file: null
  }
  const message = new BotConversationService(data)
  const response = await message.sendMessage()
  if (response) {
    messagesStore.resetDraft()
  }
}
</script>

<template>
  <div class="message-choices__content">
    <button
        v-for="(choice, index) in props.choices"
        :key="index"
        class="message-choices__button baseButton__primaryWhite"
        type="button"
        @click="sendMessage(choice)"
    >
      {{ choice }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.message-choices {
  &__content {
    justify-content: flex-end;
    padding: 0 20px;
    width: 100%;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  &__button {
    border-radius: 12px !important;
    height: 43px !important;
    width: max-content !important;
    text-transform: none !important;
    padding: 0 16px;
    border: 1px solid $primary-green;
    background-color: transparent;
    font-family: $Inter-Regular;
    font-weight: 400;
    color: $primary-green;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(239, 255, 253, 0.3);
    }
  }
}
</style>
