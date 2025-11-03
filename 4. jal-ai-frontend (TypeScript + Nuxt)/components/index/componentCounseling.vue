<script setup lang="ts">

import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentCounselingBlocks from "@/components/index/componentCounselingBlocks.vue";
</script>

<template>
<section id="counseling" class="counseling">
  <component-ui-title
      title="Beratungsrichtungen"
      description-p2="Sie wählen eine, zwei oder alle drei Richtungen. Gemeinsam entwickeln wir Lösungen, die echte wirtschaftliche Ergebnisse bringen."
      description-span1="Beratungsrichtungen"
      description-p1_2="– wir beginnen dort, wo der größte Handlungsbedarf besteht."
      description-p1_1="Drei"/>
  <component-counseling-blocks/>
</section>
</template>

<style scoped lang="scss">
.counseling {
  padding-top: $primary-margin-sections;
  padding-bottom: $primary-margin-sections;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: $primary-light-gray;
    opacity: 0.1;
  }
}
</style>