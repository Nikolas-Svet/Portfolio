<script lang="ts" setup>
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ArrowIcon from "@/assets/images/arrow.svg";
import type ITitle from "@/types/UiTitle";
import {useMessagesStore} from "@/stores/messages";

interface IPurpose {
  name: string;
  description: string;
  count_rectangle: number;
}

const props = defineProps({
  purpose: {
    type: Array as PropType<IPurpose[]>,
    required: true
  },
  title_data: {
    type: Object as PropType<ITitle>,
    required: true
  }
})

const messagesStore = useMessagesStore()

const openDialog = () => {
  messagesStore.setIsOpenDialog(true)
}
</script>

<template>
  <section class="purpose">
    <component-ui-title
        :description-p1_1="props.title_data?.description_p1_1"
        :description-p1_2="props.title_data?.description_p1_2"
        :description-p2="props.title_data?.description_p2"
        :description-span1="props.title_data?.description_span1"
        :title="props.title_data?.title"/>
    <div class="purpose__content">
      <div class="purpose-blocks">
        <div v-for="(pur, index) in purpose" :key="index"
             class="purpose-blocks__block">
          <div :class="`purpose-blocks__rectangle-${pur.count_rectangle}`" class="purpose-blocks__rectangle">
            <span v-for="n in pur.count_rectangle" :key="n"></span>
          </div>
          <p class="purpose-blocks__name">{{ pur.name }}</p>
          <span class="purpose-blocks__description">{{ pur.description }}</span>
        </div>
      </div>
      <button @click="openDialog" class="baseButton__primaryGreen baseButton__w270 purpose__action">
        Kostenloses Erstgespräch vereinbaren
        <ArrowIcon/>
      </button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.purpose {
  margin-top: calc($primary-margin-sections * 1.25);
  margin-bottom: $primary-margin-sections;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    bottom: calc(-1 * $primary-margin-sections);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $primary-light-gray;
    opacity: 0.1;
  }

  &__content {
    width: $width-default-block;
  }

  &__action {
    margin-top: calc(0.5 * $primary-margin-sections);
    max-width: none !important;

    svg {
      margin-left: 12px;
    }
  }
}

.purpose-blocks {
  margin-top: calc($primary-margin-sections * 0.5);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 60px 8px;


  &__block {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(50% - 4px);
  }

  &__name {
    font-weight: 500;
    font-family: $Manrope-Medium;
    line-height: 1;
    font-size: clamp(21px, 2vw, 28px);
    text-transform: uppercase;
    color: $default-white;
    margin-bottom: 20px;
  }

  &__rectangle {
    height: 44px;
    width: 44px;
    position: relative;
    margin-bottom: 12px;

    span {
      position: absolute;
      width: calc(50% - 2px);
      height: calc(50% - 2px);
      background-color: $primary-green;
      border-radius: calc($primary-radius * 0.5);
    }

    &-1 {
      span {
        &:first-child {
          left: 0;
          bottom: 0;
        }
      }
    }

    &-2 {
      span {
        &:first-child {
          left: 0;
          bottom: 0;
        }

        &:last-child {
          right: 0;
          bottom: 0;
        }
      }
    }

    &-3 {
      span {
        &:first-child {
          left: 0;
          top: 0;
        }

        &:nth-child(2) {
          right: 0;
          top: 0;
        }

        &:last-child {
          left: 0;
          bottom: 0;
        }
      }
    }

    &-4 {
      span {
        &:first-child {
          left: 0;
          top: 0;
        }

        &:nth-child(2) {
          right: 0;
          top: 0;
        }

        &:nth-child(3) {
          left: 0;
          bottom: 0;
        }

        &:last-child {
          right: 0;
          bottom: 0;
        }
      }
    }
  }

  &__description {
    align-content: flex-end;
    flex: 1;
    color: $default-white;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
  }
}

@media (width < 650px) {
  .purpose-blocks {
    margin-bottom: 40px;
    gap: 60px 12px;

    &__block {
      width: calc(50% - 6px);
    }
  }
}

@media (width < 510px) {
  .purpose-blocks {
    gap: 30px 12px;

    &__block {
      width: 100%;
    }
  }
}
</style>