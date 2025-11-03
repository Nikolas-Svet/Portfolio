<script lang="ts" setup>

import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentUsBlocks from "@/components/index/componentUsBlocks.vue";
</script>

<template>
  <section id="us" class="us">
    <component-ui-title
        description-p1_1=""
        description-p1_2="wir?"
        description-p2="Erfahrung, die wirkt.
                        Über sieben Jahre, in denen wir Systeme, Netzwerke und Praxiswissen vereint haben – für messbare Erfolge."
        description-span1="Warum"
        title="Wir"/>
    <component-us-blocks/>
  </section>
</template>

<style lang="scss" scoped>
.us {
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

  &:after {
    content: "";
    position: absolute;
    inset: 0;
    background-repeat: no-repeat;
    background-image: url("/assets/images/index/us/background.webp");
    background-size: 107%;
    background-position-y: 37%;
    background-position-x: 37%;
    filter: brightness(70%);
    opacity: 0.6;
    z-index: -1;
  }
}

@media (width < 1024px) {
  .us {
    &:after {
      background-position-y: 77%;
    }
  }
}
@media (width < 700px) {
  .us {
    &:after {
      display: none;
    }
  }
}
</style>
<style lang="scss">
@media (width < 700px) {
  .us {
    .section-header__description {
      p {
        display: none;
      }
    }
  }
}
</style>