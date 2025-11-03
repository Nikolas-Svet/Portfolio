<script lang="ts" setup>
import FileIcon from "@/assets/images/file.svg";
import EditIcon from "@/assets/images/edit.svg";
import type {IMessage} from "@/types/api";
import {useMessagesStore} from "@/stores/messages";

const props = defineProps({
  text: String,
  message: {
    type: Object as PropType<IMessage>,
    required: false
  },
  date: {
    type: String,
    required: false,
  },
  file: {
    type: String || null,
    required: false,
  },
  file_name: {
    type: String || null,
    required: false,
  },
  file_size: {
    type: Number || null,
    required: false,
  }
})

const messagesStore = useMessagesStore()

const edit = async () => {
  console.log(props.message)
  messagesStore.currentMessageIdEdit = props.message!.question
  messagesStore.choices = props.message!.question_choices
  setTimeout(() => {
    messagesStore.value = props.message!.value
  }, 1)
}
</script>

<template>
  <div class="messageUser__container">
    <div class="messageUser__time">
      {{ props.date ? props.date : null }}
    </div>
    <div v-if="!props.file_name && !props.file" class="messageUser__content">
      {{ props.text }}
      <EditIcon v-if="props.message.question > 0" @click="edit"/>
    </div>
    <playback-only v-if="props.file_name?.split('.webm').length > 1 || props.file_name?.split('.mp4').length > 1"
                   :audio-src="'https' + props.file?.split('http')[1]"/>
    <div v-if="props.file_name?.split('.webm').length < 2 && props.file_name?.split('.mp4').length < 2" class="messageUser__file">
      <span v-if="props.text && props.text !== ''">{{ props.text }} <EditIcon v-if="props.message.question > 0" @click="edit"/></span>
      <div style="display: flex; gap: 10px">
        <FileIcon/>
        <div class="icon-container__text">
          <div class="icon-container__file_name">
            {{ props.file_name ? props.file_name : "file" }}
          </div>
          <div v-if="props.file_size" class="icon-container__size">
            {{ (props.file_size / 1000).toFixed(0) }} kb
          </div>
        </div>
      </div>
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
  padding: 8px;
  gap: 6px;

  &__text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__file_name {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-white;
  }

  &__size {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-white;
  }
}

.messageUser {
  &__container {
    padding: 0 20px;
    width: 100%;
    display: flex;
    //flex-direction: column;
    align-items: flex-end;
    justify-content: flex-end;
    margin-bottom: 16px;

    svg {
      margin-left: 10px;
      min-width: 20px;
      transition: all 0.3s ease;
      cursor: pointer;
      * {
        stroke: $default-white;
      }
      &:hover {
        opacity: 0.8;
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__content {
    max-width: 275px;
    width: max-content;
    display: flex;
    align-items: flex-start;
    background-color: $primary-background-color-bot;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-white;
  }

  &__file {
    max-width: 300px;
    white-space: break-spaces;
    width: max-content;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
    background-color: $primary-background-color-bot;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-white;

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }

  &__time {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $primary-gray-number;
    opacity: 0.6;
  }
}
</style>