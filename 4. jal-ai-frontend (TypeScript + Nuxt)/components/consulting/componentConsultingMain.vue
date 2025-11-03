<script lang="ts" setup>
import ComponentPath from "@/components/ui/componentPath.vue";
const props = defineProps({
  title_1_1: String,
  title_1_2: String,
  title_span: String,
  name_button: String,
  sub_title: String,
  path: {
    type: Array as PropType<any[]>,
    required: true
  }
})
</script>

<template>
  <div class="mainConsulting__wrap"></div>
  <section class="mainConsulting">
    <component-path :path="props.path"/>
    <h2 class="mainConsulting__title">
      {{ props.title_1_1 ? props.title_1_1 : '' }}
      <span v-if="props.title_span !== ''">{{ props.title_span }}</span>
      {{ props.title_1_2 ? props.title_1_2 : '' }}
    </h2>
    <h3 class="mainConsulting__subtitle">
      {{ props.sub_title }}
    </h3>
    <button
        class="mainConsulting__action baseButton__w240 baseButton__primaryWhite">{{ props.name_button}}
    </button>
  </section>
</template>

<style lang="scss" scoped>

$size-title: clamp(28px, 4.5vw, 67px);

.mainConsulting {
  min-height: clamp(388px, 43.5vw, 520px);
  position: relative;
  display: flex;
  flex-direction: column;
  padding: calc(0.5 * $primary-margin-sections) 0;

  &__wrap {
    position: absolute;
    top: 0;
    left: 0;
    height: clamp(460px, 50vw, 592px);
    width: 100dvw;
    background-image: url("assets/images/consulting/background.webp");
    background-size: cover !important;
    background-repeat: no-repeat;
    z-index: -1;
    //background-position-y: 15%;

    &:after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 0;
    }
  }

  &__title {
    font-size: $size-title;
    font-family: $Manrope-Regular;
    color: $default-white;
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 8px;
    max-width: 760px;
    flex: 1;

    span {
      display: contents;
      font-size: $size-title;
      font-family: $Manrope-Regular;
      color: $primary-green;
      font-weight: 400;
    }
  }

  &__subtitle {
    position: absolute;
    right: 100px;
    bottom: 40px;
    max-width: 340px;
    font-family: $Inter-Regular;
    font-weight: 400;
    font-size: 16px;
    color: $primary-light-gray;
  }

  &__action {
    max-width: none !important;
    width: fit-content !important;
  }
}

@media (width < 900px) {
  .mainConsulting {
    &__title {
      flex: none;
    }
    &__subtitle {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex: 1;
      position: relative;
      bottom: 0;
      right: 0;
      margin-bottom: 40px;
    }

    &__wrap {
      background-position-x: 50% !important;
    }
  }
}

@media (width < 600px) {
  .mainConsulting {
    &__action {
      max-width: none !important;
      width: 100% !important;
    }
  }
}
</style>