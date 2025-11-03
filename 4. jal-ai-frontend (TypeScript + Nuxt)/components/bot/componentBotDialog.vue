<script lang="ts" setup>
import AddIcon from "@/assets/images/addBot.svg";
import VoiceIcon from "@/assets/images/botVoice.svg";
import ArrowIcon from '@/assets/images/arrow.svg';
import type {IMessage} from "@/types/api";
import ComponentMessageBot from "@/components/ui/componentMessageBot.vue";
import ComponentMessageUser from "@/components/ui/componentMessageUser.vue";
import {useMessagesStore} from "@/stores/messages";
import TestVoice from "@/components/testVoice.vue";
import ComponentChoisesUser from "@/components/ui/componentChoisesUser.vue";
import LogoIcon from "@/assets/images/logo.svg";
import Validation from "@/composition/validation";
import {botSessionApi} from "@/api/botSession";
import Message, {type IMessagePayload} from "@/composition/message";

const isStartRecording = ref<boolean>(false);

const messagesStore = useMessagesStore()

const errorValidate = ref<boolean>(false);

const textData = ref<string>('');

const messages = computed(() => messagesStore.messages)

const progress = computed(() => messagesStore.progress)
const count_messages = computed(() => messagesStore.count_messages)

const sendMessage = async () => {
  if (textData.value === '') {
    return
  }

  const data: IMessagePayload = {
    sessionId: Number(localStorage.getItem('sessionId')),
    messageId: messagesStore.currentMessageId,
    text: textData.value,
    file: file.value
  }

  if (currentMessageIdEdit.value > 0) {
    data.messageId = currentMessageIdEdit.value
  }

  const message = new Message(data)

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
  file.value = (e.target as HTMLInputElement).files?.[0] as any;
  if (file.value) {
    console.log('Selected file:', file.value);
  }
}


const isLastMessage = computed(() => messagesStore.isLastMessage)

const currentMessageIdEdit = computed(() => messagesStore.currentMessageIdEdit)

const postcodeError = ref<boolean>(false);

const value_edit = computed(() => messagesStore.value)

const choices = computed(() => messagesStore.choices)

const cancel_edit = () => {
  messagesStore.value = ''
  messagesStore.choices = []
  textData.value = ''
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
  console.log('postcodeError', newValue);
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
    <div class="bot__dialog--content">
      <template v-for="(message, index) in messages">
        <component-message-bot v-if="!message.is_user" :key="index" :date="message.date ? message.date : null"
                               :text="message.text"/>
        <component-message-user v-else
                                :key="-index"
                                :date="message.date ? message.date : null"
                                :file="message.file ? message.file : null"
                                :file_name="message.file_name ? message.file_name : null"
                                :file_size="message.file_size ? message.file_size : null"
                                :message="message" :text="message.value"/>
        <component-choises-user v-if="message?.choices && index === (messages.length - 1)"
                                :choices="message?.choices ? message?.choices : []"/>
      </template>
      <div v-if="progress !== 0" class="bot__progress--block">
        <div
            style="width: 100%; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-start; max-width: 230px">
          <div class="bot__progress">
          </div>
          <div :style="{width: String((progress / count_messages) * 100) + '%' }" class="bot__percent">
          </div>
          <p>{{ progress }}/{{ count_messages }}</p>
        </div>
        <div
            :style="{clipPath: value_edit ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)', marginBottom: value_edit ? '0' : '-35px', display: currentMessageIdEdit! > 0 ? 'flex' : 'none'}"
            class="bot__edit">
          <div v-if="choices.length" class="bot__edit--choices">
            <component-choises-user
                :choices="choices"/>
          </div>
          <div class="bot__edit--info">
            Bearbeiten: <span>{{ value_edit }}</span>
            <div class="bot__close" @click="cancel_edit"></div>
          </div>
        </div>
      </div>
      <div :style="{opacity: postcodeError ? '1' : '0'}" class="bot__error">
        Falsche Postleitzahl
      </div>
    </div>
    <div
        :class="{'bot__dialog--error': errorValidate}"
        :style="{height: file ? '112px' : '50px',
        pointerEvents: isLastMessage || messages[messages.length - 1]?.choices || choices.length ? 'none' : 'auto', opacity: isLastMessage || messages[messages.length - 1]?.choices ? '0.5' : '1'}"
        class="bot__dialog--actions">
      <input v-model="textData" placeholder="Nachricht schreiben..." type="text"
             @input="errorValidate ? errorValidate = false : null" @keyup.enter="sendMessage">
      <div v-if="file" class="icon-container">
        <div class="icon-container__icon">
          <AddIcon/>
        </div>
        <div class="icon-container__text">
          <div class="icon-container__nameFile">
            {{ file.name }}
          </div>
          <div class="icon-container__size">
            {{ (file.size / 1000).toFixed(0) }} kb
          </div>
        </div>
      </div>
      <label class="bot__dialog--icon bot__dialog--file">
        <AddIcon/>
        <input
            ref="fileInput"
            type="file"
            @change="onFileSelected"/>
      </label>
      <label class="bot__dialog--icon" @click="isStartRecording = true">
        <VoiceIcon/>
      </label>
      <button :class="{'bot__dialog--active': textData !== ''}" @click="sendMessage()">
        <ArrowIcon/>
      </button>

      <test-voice :is-start-recording="isStartRecording" @stop-recording="isStartRecording = false"/>
    </div>
    <div class="bot__politic">
      <LogoIcon/>
      <RouterLink to="/data-protection/">Datenschutzrichtlinie</RouterLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.icon-container {
  margin-left: 16px;
  display: flex;
  width: 50%;
  height: 50px;
  border-radius: $primary-radius;
  background-color: #F4F3F3;
  padding: 8px;
  gap: 6px;

  &__icon {
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

  &__text {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }

  &__nameFile {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $default-black;
    text-wrap: nowrap;
  }

  &__size {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $primary-gray-number;
    opacity: 0.6;
  }
}

.bot {
  &__politic {
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

    &--choices {
      flex: 1;
      overflow: auto;
      margin-bottom: 8px;
    }

    &--info {
      position: sticky;
      bottom: 0;
    }

    .choices-user__content {
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

    &--block {
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

    &--content {
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

    &--file {
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

    &--icon {
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

    &--error {
      border: 1px solid red !important;
    }

    &--actions {
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

    &--active {
      opacity: 1 !important;
      z-index: 1 !important;
      bottom: 24px !important;
      right: 16px !important;
      transform: translateY(50%) !important;
    }


  }
}
</style>