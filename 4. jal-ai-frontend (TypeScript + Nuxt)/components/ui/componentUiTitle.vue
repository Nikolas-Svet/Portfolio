<script setup lang="ts">
import type { IUiTitleProps } from '@/types/UiTitle'

const props = withDefaults(defineProps<IUiTitleProps>(), {
  title: '',
  descriptionP1_1: '',
  descriptionP1_2: '',
  descriptionSpan0: '',
  descriptionSpan1: '',
  descriptionSpan2: '',
  descriptionP2: '',
  descriptionP2_2: '',
})

const sectionHeader = ref<HTMLElement | null>(null)
const description = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const updateHeaderHeight = () => {
  if (sectionHeader.value && description.value) {
    const h = description.value.offsetHeight
    sectionHeader.value.style.height = `${h}px`
  }
}

onMounted(async () => {
  await nextTick()
  updateHeaderHeight()

  if (typeof ResizeObserver !== 'undefined' && description.value) {
    resizeObserver = new ResizeObserver(updateHeaderHeight)
    resizeObserver.observe(description.value)
    return
  }

  window.addEventListener('resize', updateHeaderHeight)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', updateHeaderHeight)
})
</script>

<template>
  <section ref="sectionHeader" class="section-header">
    <h2 v-if="props.title" class="section-header__title">
      {{ props.title }}
    </h2>
    <div :class="{ 'section-header__description--full': !props.title }" ref="description" class="section-header__description">
      <span>
        <p v-if="props.descriptionSpan0">{{ props.descriptionSpan0 }}</p>
        <template v-if="props.descriptionP1_1">{{ props.descriptionP1_1 }}</template>
        <br v-if="props.title === 'Nur 3 Schritte'">
        <p v-if="props.descriptionSpan1">{{ props.descriptionSpan1 }}</p> {{ props.descriptionP1_2 }}
        <p v-if="props.descriptionSpan2">{{ props.descriptionSpan2 }}</p>
        <p v-if="props.title === 'Bewertungen'">gezielter Umsetzung</p>
      </span>
      <p v-if="props.descriptionP2 !== ''">{{ props.descriptionP2 }}</p>
      <p v-if="props.descriptionP2_2 !== ''">{{ props.descriptionP2_2 }}</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.section-header {
  width: 100%;
  display: flex;
  align-items: flex-start;
  position: relative;
  transition: all 0.2s ease;

  h2 {
    font-family: $Inter-Regular;
    font-size: 14px;
    font-weight: 400;
    color: $primary-light-gray;
    text-transform: uppercase;
  }

  $font-size-title: clamp(23px, 3vw, 43px);

  &__description--full {
    width: 100% !important;
  }

  &__description {
    position: absolute;
    //max-width: 910px;
    width: 73.5%;
    top: 0;
    right: 0;
    span {
      max-width: 910px;
      display: flex;
      font-size: $font-size-title;
      line-height: 1;
      font-family: $Manrope-Regular;
      font-weight: 400;
      color: $default-white;

      p {
        font-size: $font-size-title !important;
        line-height: 1;
        font-family: $Manrope-Regular;
        font-weight: 400;
        display: contents;
        color: $primary-green;
      }
    }

    p {
      margin-top: 20px;
      max-width: 288px;
      font-family: $Inter-Regular;
      font-size: 16px;
      color: $primary-light-gray;
      font-weight: 400;
    }
  }
}

@media (width < 768px) {
  .section-header {
    flex-direction: column;
    height: auto !important;
    gap: 24px;

    &__description {
      width: 100%;
      position: relative;

      span {
        font-size: 28px;

        p {
          font-size: 28px !important;
        }
      }

      p {
        max-width: 100%;
      }
    }
  }
}

@media (width < 440px) {
  .section-header {
    &__description {
      span {
        font-size: 24px;

        p {
          font-size: 24px !important;
        }
      }
    }
  }
}
</style>
