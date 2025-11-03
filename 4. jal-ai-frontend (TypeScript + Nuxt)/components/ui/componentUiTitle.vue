<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  descriptionP1_1: {
    type: String,
    required: true,
  },
  descriptionP1_2: {
    type: String,
    required: true,
  },
  descriptionSpan1: {
    type: String,
    required: true,
  },
  descriptionSpan2: {
    type: String,
    required: false,
  },
  descriptionSpan0: {
    type: String,
    required: false,
  },
  descriptionP2: {
    type: String,
    required: true,
  },
  descriptionP2_2: {
    type: String,
    required: false,
  }

})
const sectionHeader = ref<HTMLElement | null>(null)
const description = ref<HTMLElement | null>(null)

const updateHeaderHeight = () => {
  if (sectionHeader.value && description.value) {
    const h = description.value.offsetHeight
    sectionHeader.value.style.height = `${h}px`
  }
}

onMounted(() => {
  nextTick(updateHeaderHeight)
  setTimeout(() => {
    updateHeaderHeight()
  }, 1)
  window.addEventListener('resize', updateHeaderHeight)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateHeaderHeight)
})
</script>

<template>
  <section ref="sectionHeader" class="section-header">
    <h2 v-if="title !== ''" class="section-header__title">
      {{ title }}
    </h2>
    <div :class="{'section-header__full': title === ''}" ref="description" class="section-header__description">
      <span>
        <p v-if="descriptionSpan0 || descriptionSpan0 !== ''">{{ descriptionSpan0 }}</p>
        {{ descriptionP1_1 !== '' ? descriptionP1_1 : null }} <br v-if="title === 'Nur 3 Schritte'">
        <p v-if="descriptionSpan1 !== ''">{{ descriptionSpan1 }}</p> {{ descriptionP1_2 }}
        <p v-if="descriptionSpan2 || descriptionSpan2 !== ''">{{ descriptionSpan2 }}</p>
        <p v-if="title === 'Bewertungen'">gezielter Umsetzung</p>
      </span>
      <p v-if="descriptionP2 !== ''">{{ descriptionP2 }}</p>
      <p v-if="descriptionP2_2 !== ''">{{ descriptionP2_2 }}</p>
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

  &__full {
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