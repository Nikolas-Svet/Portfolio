<script setup lang="ts">
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentStepsBlocks from "@/components/index/componentStepsBlocks.vue";

</script>

<template>
<section class="steps">
  <component-ui-title
      title="Nur 3 Schritte"
      description-p2=""
      description-span1="3 Schritte"
      description-p1_2="– und Sie erhalten Unterstützung, Analyse und persönliche Beratung."
      description-p1_1="Wir schätzen Ihre Zeit. Deshalb haben wir es einfach gemacht:"/>
  <component-steps-blocks/>
</section>
</template>

<style scoped lang="scss">
.steps {
  margin-top: $primary-margin-sections;
  margin-bottom: $primary-margin-sections;
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
}
</style>