<script setup lang="ts">
import {useMessagesStore} from "@/stores/messages";
import Message, {type IMessagePayload} from "@/composition/message";
import type {IMessage} from "@/types/api";

const props = defineProps({
  choices: Array<string>,
  isAnswered: {
    type: Boolean,
    required: false
  }
})

const messagesStore = useMessagesStore()

const sendMessage = async (textData: string) => {
  const data: IMessagePayload = {
    sessionId: Number(localStorage.getItem('sessionId')),
    messageId: messagesStore.currentMessageId,
    text: textData,
    file: null
  }
  const message = new Message(data)
  const response = await message.sendMessage()
  if (response) {
    messagesStore.value = ''
    messagesStore.choices = []
    setTimeout(() => {
      messagesStore.currentMessageIdEdit = 0
    }, 300)
    return
  }
}
</script>

<template>
<div class="choices-user__content">
  <button @click="sendMessage(choice)" class="choices-user__content__block baseButton__primaryWhite" v-for="(choice, index) in props.choices" :key="index">
    {{ choice }}
  </button>
</div>
</template>

<style scoped lang="scss">
.choices-user__content {
  justify-content: flex-end;
  padding: 0 20px;
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  &__block {
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