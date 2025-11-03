<script lang="ts" setup>
import LogoBotIcon from '@/assets/images/logoBot.svg';
import {useMessagesStore} from "@/stores/messages";

const props = defineProps({
  text: String,
  date: {
    type: String,
    required: false,
  }
})

const messagesStore = useMessagesStore()
const isLastMessage = computed(() => messagesStore.isLastMessage)

</script>

<template>
  <div class="messageBot__container">
    <div class="messageBot__logo">
      <LogoBotIcon/>
    </div>
    <div v-if="!props.text?.includes('https://') || (props.text?.includes('https://') && !isLastMessage)" class="messageBot__content">
      {{ props.text }}
    </div>
    <div v-if="props.text?.includes('https://') && isLastMessage" class="messageBot__content">
      {{ props.text.split('https://')[0] }}
      <a :href="'https://' + props.text.split('https://')[1].split('Sie')[0]">{{ 'https://' + props.text.split('https://')[1].split('Sie')[0] }}</a>
      {{ 'Sie werden' + props.text.split('Sie werden')[1] }}
    </div>
    <div class="messageBot__time">
      {{ props.date ? props.date : null }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.messageBot {
  &__container {
    padding: 0 20px;
    width: 100%;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__content {
    max-width: 300px;
    white-space: break-spaces;
    width: max-content;
    background-color: #C8C8C840;
    border-radius: 12px;
    padding: 12px 16px;
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 16px;
    color: $default-black;

    a {
      color: $primary-green;
      display: contents;
      text-decoration: underline !important;
      overflow-wrap: anywhere;
      word-break: break-all;
    }
  }

  &__time {
    font-weight: 400;
    font-family: $Inter-Regular;
    font-size: 14px;
    color: $primary-gray-number;
    opacity: 0.6;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    background: linear-gradient(180deg, #12BBA9 -27.03%, #0D796D 104.05%);
    border-radius: 50%;
    box-shadow: 0 4.32px 8.65px 0 #8BE8DE33;

    svg {
      height: 40px;
      width: 40px;
      filter: drop-shadow(0 4px 12px rgba(8, 75, 68, 0.55)) drop-shadow(0 -2px 12px rgba(8, 75, 68, 0.12));
    }
  }

}
</style>