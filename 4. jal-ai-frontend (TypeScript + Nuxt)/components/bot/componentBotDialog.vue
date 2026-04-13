<script lang="ts" setup>
import AddIcon from "@/assets/images/addBot.svg";
import VoiceIcon from "@/assets/images/botVoice.svg";
import ArrowIcon from '@/assets/images/arrow.svg';
import ComponentMessageBot from "@/components/ui/componentMessageBot.vue";
import ComponentMessageUser from "@/components/ui/componentMessageUser.vue";
import {useMessagesStore} from "@/stores/messages";
import TestVoice from "@/components/testVoice.vue";
import ComponentChoisesUser from "@/components/ui/componentChoisesUser.vue";
import LogoIcon from "@/assets/images/logo.svg";
import BotConversationService, {type BotMessagePayload} from "@/services/bot-conversation.service";
import type {BotConversationMessage, IMessage} from "@/types/api";
import {Consts} from "@/consts";

const isStartRecording = ref<boolean>(false);

const messagesStore = useMessagesStore()

const errorValidate = ref<boolean>(false);

const textData = ref<string>('');

const props = defineProps<{
  messages: BotConversationMessage[]
}>()

const messages = computed(() => props.messages)

const progress = computed(() => messagesStore.progress)
const count_messages = computed(() => messagesStore.count_messages)
const currentMessageIdEdit = computed(() => messagesStore.currentMessageIdEdit)
const valueEdit = computed(() => messagesStore.value)
const choices = computed(() => messagesStore.choices)
const isLastMessage = computed(() => messagesStore.isLastMessage)
const hasActiveChoices = computed(() => Boolean(messages.value[messages.value.length - 1]?.choices?.length) || choices.value.length > 0)
const isActionDisabled = computed(() => isLastMessage.value || hasActiveChoices.value)
const isUserMessage = (message: BotConversationMessage): message is IMessage => 'question_choices' in message

const sendMessage = async () => {
  if (textData.value.trim() === '') {
    return
  }

  const data: BotMessagePayload = {
    sessionId: Number(localStorage.getItem('sessionId')),
    messageId: messagesStore.currentMessageId,
    text: textData.value,
    file: file.value
  }

  const message = new BotConversationService(data)
  const response = await message.sendMessage()
  if (response) {
    textData.value = ''
    file.value = null
  } else {
    errorValidate.value = true
  }
}

const file = ref<File | null>(null)

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement | null
  file.value = target?.files?.[0] ?? null
}


const postcodeError = ref<boolean>(false);

const cancel_edit = () => {
  messagesStore.clearDraftContent()
  textData.value = ''
  errorValidate.value = false
  setTimeout(() => {
    messagesStore.currentMessageIdEdit = 0
  }, 300)
}

watch(() => messagesStore.value, (newValue) => {
  if (newValue !== '') {
    textData.value = newValue;
  } else {
    textData.value = '';
  }
})

watch(() => messagesStore.postcode, async (newValue) => {
  if (newValue) {
    postcodeError.value = true
    setTimeout(() => {
      postcodeError.value = false
      messagesStore.postcode = false
    }, 5000)
  }
})

</script>

<template>
  <div class="bot__dialog">
    <div class="bot__dialog-content">
      <template v-for="(message, index) in messages" :key="index">
        <component-message-bot
            v-if="!message.is_user"
            :date="'date' in message ? message.date ?? null : null"
            :text="'text' in message ? message.text ?? null : null"
        />
        <component-message-user
            v-else
            :date="'date' in message ? message.date ?? null : null"
            :file="isUserMessage(message) ? message.file : null"
            :file_name="isUserMessage(message) ? message.file_name ?? null : null"
            :file_size="isUserMessage(message) ? message.file_size ?? null : null"
            :message="isUserMessage(message) ? message : undefined"
            :text="isUserMessage(message) ? message.value : ''"
        />
        <component-choises-user
            v-if="'choices' in message && message.choices?.length && index === (messages.length - 1)"
            :choices="message.choices ?? []"
        />
      </template>
      <div v-if="progress !== 0" class="bot__progress-block">
        <div
            style="width: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; max-width: 230px">
          <div class="bot__progress">
          </div>
          <div :style="{width: String((progress / count_messages) * 100) + '%' }" class="bot__percent">
          </div>
          <p>{{ progress }}/{{ count_messages }}</p>
        </div>
      <div
            :style="{clipPath: valueEdit ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', marginBottom: valueEdit ? '0' : '-35px', display: currentMessageIdEdit > 0 ? 'flex' : 'none'}"
            class="bot__edit">
          <div v-if="choices.length" class="bot__edit-choices">
            <component-choises-user
                :choices="choices"/>
          </div>
          <div class="bot__edit-info">
            Bearbeiten: <span>{{ valueEdit }}</span>
            <div class="bot__close" @click="cancel_edit"></div>
          </div>
        </div>
      </div>
      <div :style="{opacity: postcodeError ? '1' : '0'}" class="bot__error">
        Falsche Postleitzahl
      </div>
    </div>
    <div
        :class="{'bot__dialog-error': errorValidate}"
        :style="{height: file ? '112px' : '50px',
        pointerEvents: isActionDisabled ? 'none' : 'auto', opacity: isActionDisabled ? '0.5' : '1'}"
        class="bot__dialog-actions">
      <input v-model="textData" placeholder="Nachricht schreiben..." type="text"
             @input="errorValidate ? errorValidate = false : null" @keyup.enter="sendMessage">
      <div v-if="file" class="bot__dialog-attachment">
        <div class="bot__dialog-attachment-icon">
          <AddIcon/>
        </div>
        <div class="bot__dialog-attachment-text">
          <div class="bot__dialog-attachment-name">
            {{ file.name }}
          </div>
          <div class="bot__dialog-attachment-size">
            {{ (file.size / 1000).toFixed(0) }} kb
          </div>
        </div>
      </div>
      <label class="bot__dialog-icon bot__dialog-file">
        <AddIcon/>
        <input
            type="file"
            @change="onFileSelected"/>
      </label>
      <label class="bot__dialog-icon" @click="isStartRecording = true">
        <VoiceIcon/>
      </label>
      <button :class="{'bot__dialog-active': textData !== ''}" type="button" @click="sendMessage()">
        <ArrowIcon/>
      </button>

      <test-voice :is-start-recording="isStartRecording" @stop-recording="isStartRecording = false"/>
    </div>
    <div class="bot__footer">
      <LogoIcon/>
      <RouterLink :to="Consts.Routes.dataProtection">Datenschutzrichtlinie</RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.bot__dialog-attachment {
  margin-left: 16px;
  display: flex;
  width: 50%;
  height: 50px;
  border-radius: $primary-radius;
  background-color: #F4F3F3;
  padding: 8px;
  gap: 6px;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 32px;
    height: 32px;
    background-color: $primary-green;
    border-radius: 50%;

    * {
      stroke: $default-white;
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  &-name {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $default-black;
    text-wrap: nowrap;
  }

  &-size {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $primary-gray-number;
    opacity: 0.6;
  }
}

.bot {
  &__footer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;

    svg {
      height: 10px;
      width: 10px;
      margin-right: 8px;
    }

    a {
      color: #969696;
      font-family: $Inter-Regular;
      font-weight: 400;
      font-size: 10px;
    }
  }

  &__error {
    max-width: 230px;
    transition: all 0.3s ease;
    background-color: rgba(255, 0, 0, 0.3);
    border: 1px solid red;
    padding: 8px 16px;
    text-align: center;
    width: 100%;
    border-radius: 4px;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $default-black;
    position: sticky;
    left: 85px;
    bottom: 88%;
    backdrop-filter: blur(4px);
  }

  &__close {
    width: 15px;
    height: 15px;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:after, &:before {
      height: 1.5px;
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      background-color: $default-black;
      content: '';
    }

    &:after {
      transform: translate(-50%, -50%) rotate(45deg);
    }

    &:before {
      transform: translate(-50%, -50%) rotate(-45deg);
    }
  }

  &__edit {
    max-height: 200px;
    transition: margin-bottom 0.3s ease, clip-path 0.1s ease;
    position: relative;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    width: calc(100% - 40px);
    padding: 12px;
    border-radius: $primary-radius;
    background-color: #F1F1F1;
    display: flex;
    flex-direction: column;

    &-choices {
      flex: 1;
      overflow: auto;
      margin-bottom: 8px;
    }

    &-info {
      position: sticky;
      bottom: 0;
    }

    .message-choices {
      padding: 0 !important;
      margin-bottom: 8px;
      justify-content: flex-start !important;
    }

    color: $default-black;

    span {
      margin-left: 4px;
      color: $primary-green;
    }
  }

  &__progress {
    margin-bottom: -5px;
    width: 100%;
    max-width: 230px;
    min-height: 5px;
    background-color: $primary-green;
    border-radius: 4px;
    opacity: 0.2;

      &-block {
      transform: translateY(-8px);
      width: 100%;
      //min-height: 15px;
      margin-bottom: -38px;
      position: sticky;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;

      p {
        width: 100%;
        margin-top: 4px;
        text-align: center;
        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 14px;
        color: $default-black;
      }
    }
  }

  &__percent {
    width: 100%;
    min-height: 5px;
    background-color: $primary-green;
    border-radius: 4px;
  }

  &__dialog {
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: $default-white;
    border-radius: 12px;
    flex: 1;
    overflow: hidden;

    &-content {
      padding: 20px 0 0 0;
      position: relative;
      overflow-x: hidden;
      scroll-behavior: smooth;
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: auto;
    }

    &-file {
      cursor: pointer !important;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      right: 56px !important;

      input {
        cursor: pointer !important;
        opacity: 0;
        position: absolute;
        inset: 0;
        z-index: -1;
      }
    }

    &-icon {
      height: 32px;
      width: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 24px;
      transform: translateY(50%);
      right: 16px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #EEEEEE;
      }
    }

    &-error {
      border: 1px solid red !important;
    }

    &-actions {
      margin: 0 0 12px 0;
      border: 1px solid $primary-color-bot;
      height: 50px;
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      border-radius: 25px;
      width: calc(100% - 40px);
      position: relative;
      transition: all 0.3s ease;

      input[type=text] {
        height: 50px;
        padding: 0 96px 0 16px;
        display: flex;
        width: 100%;
        background-color: transparent;
        border: none;
        outline: none;

        font-family: $Inter-Regular;
        font-weight: 400;
        font-size: 16px;
        color: $primary-gray-block;

        &::placeholder {
          font-family: $Inter-Regular;
          font-weight: 400;
          font-size: 16px;
          color: $primary-gray-number;
          opacity: 0.6;
        }
      }

      button {
        height: 32px;
        width: 32px;
        background-color: $primary-green;
        border-radius: 50%;
        border: none;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 24px;
        transform: translateY(50%) scale(0.8);
        right: 16px;
        z-index: -1;
        opacity: 0;
        transition: all 0.3s ease;

        svg {
          transform: rotate(-90deg) !important;
        }
      }
    }

    &-active {
      opacity: 1 !important;
      z-index: 1 !important;
      bottom: 24px !important;
      right: 16px !important;
      transform: translateY(50%) !important;
    }


  }
}
</style>
