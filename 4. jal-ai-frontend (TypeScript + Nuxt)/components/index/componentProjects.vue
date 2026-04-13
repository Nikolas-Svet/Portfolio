<script setup lang="ts">
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentProjectsBlocks from "@/components/index/componentProjectsBlocks.vue";
</script>

<template>
<section id="projects" class="projects">
  <component-ui-title
      title="Projekte"
      description-p2="So sieht digitale Wirkung aus.
Von der Prozessoptimierung bis zur steuerlichen Neuausrichtung: Unsere Kundenprojekte zeigen, wie fundierte Beratung zu messbaren Ergebnissen führt."
      description-span1="Projekte"
      description-p1_2=""
      description-p1_1="Beispiele für"/>
  <component-projects-blocks/>
</section>
</template>

<style scoped lang="scss">
.projects {
  width: 100%;
  padding-top: $primary-margin-sections;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;

  margin-bottom: $primary-margin-sections;

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
<style lang="scss">
@media (width < 700px) {
  .projects {
    .section-header__description {
      p {
        display: none;
      }
    }
  }
}
</style>