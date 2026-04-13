<script lang="ts" setup>
import FileIcon from "@/assets/images/file.svg";
import EditIcon from "@/assets/images/edit.svg";
import {useMessagesStore} from "@/stores/messages";
import type {IMessage} from "@/types/api";

const props = withDefaults(defineProps<{
  text?: string
  message?: IMessage
  date?: string | null
  file?: string | null
  file_name?: string | null
  file_size?: number | null
}>(), {
  text: '',
  date: null,
  file: null,
  file_name: null,
  file_size: null,
  message: undefined,
})

const messagesStore = useMessagesStore()

const edit = () => {
  if (!props.message) {
    return
  }

  messagesStore.startEditMessage(props.message)
}
</script>

<template>
  <div class="message-user__container">
    <div class="message-user__time">
      {{ props.date }}
    </div>
    <div v-if="!props.file_name && !props.file" class="message-user__bubble">
      {{ props.text }}
      <EditIcon v-if="props.message && props.message.question > 0" class="message-user__edit" @click="edit"/>
    </div>
    <playback-only
        v-if="props.file_name?.includes('.webm') || props.file_name?.includes('.mp4')"
        :audio-src="props.file ? props.file.replace('http://', 'https://') : ''"
    />
    <div v-if="!(props.file_name?.includes('.webm') || props.file_name?.includes('.mp4'))" class="message-user__file">
      <span v-if="props.text">{{ props.text }} <EditIcon v-if="props.message && props.message.question > 0" class="message-user__edit" @click="edit"/></span>
      <div class="message-user__file-meta">
        <FileIcon/>
        <div class="message-user__file-text">
          <div class="message-user__file-name">
            {{ props.file_name ? props.file_name : 'file' }}
          </div>
          <div v-if="props.file_size" class="message-user__file-size">
            {{ (props.file_size / 1000).toFixed(0) }} kb
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.message-user {
  &__container {
    padding: 0 20px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__bubble {
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

  &__file-meta {
    display: flex;
    gap: 10px;
  }

  &__file-text {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  &__file-name,
  &__file-size {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-white;
  }

  &__time {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $primary-gray-number;
    opacity: 0.6;
  }

  &__edit {
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
}
</style>
