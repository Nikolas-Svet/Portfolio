<script setup lang="ts">
import ComponentConsultingMain from "@/components/consulting/componentConsultingMain.vue";
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentProjectsBlocks from "@/components/projects/componentProjectsBlocks.vue";
import type {IProjectsBlocks} from "@/types/ProjectsBlocks";
import BlockIcon1_1 from "@/assets/images/projects/blocks/online-shops/icon1_1.svg";
import BlockIcon1_2 from "@/assets/images/projects/blocks/online-shops/icon1_2.svg";
import BlockIcon2_1 from "@/assets/images/projects/blocks/online-shops/icon2_1.svg";
import BlockIcon2_2 from "@/assets/images/projects/blocks/online-shops/icon2_2.svg";
import BlockIcon3_1 from "@/assets/images/projects/blocks/online-shops/icon3_1.svg";
import BlockIcon3_2 from "@/assets/images/projects/blocks/online-shops/icon3_2.svg";
import BlockIcon4_1 from "@/assets/images/projects/blocks/online-shops/icon4_1.svg";
import BlockIcon4_2 from "@/assets/images/projects/blocks/online-shops/icon4_2.svg";
import BlockIcon5_1 from "@/assets/images/projects/blocks/online-shops/icon5_1.svg";
import BlockIcon5_2 from "@/assets/images/projects/blocks/online-shops/icon5_2.svg";
import BlockIcon6_1 from "@/assets/images/projects/blocks/online-shops/icon6_1.svg";
import BlockIcon6_2 from "@/assets/images/projects/blocks/online-shops/icon6_2.svg";
import {Consts} from "@/consts";

useHead({
  title: 'Projects — Online Shops',
})

definePageMeta({
  layout: 'layout-default'
})

onMounted(() => {
  document.documentElement.style.scrollBehavior = 'auto'

  setTimeout(() => {
    document.documentElement.style.scrollBehavior = ''
  }, 1000)
})

const projects_block = ref<IProjectsBlocks[]>([
  {
    title: "Produktportfolio",
    left_block: {
      title: 'Vorher',
      subtitle: 'Breites Sortiment ohne Fokus',
      description: '1.300 Produkte auf bekannten Plattformen, geringe Sichtbarkeit profitabler Artikel',
      iconSvg: BlockIcon1_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Gezielter Produkt-Listing',
      description: 'Ausgewählte Produkte gezielt auf neuer Plattform platziert – besser sichtbar, besser verkauft',
      iconSvg: BlockIcon1_2
    }
  },
  {
    title: "Umsatzentwicklung",
    left_block: {
      title: 'Vorher',
      subtitle: 'Geringe Verkaufszahlen',
      description: 'Ca. 8.000 € Jahresumsatz trotz großem Portfolio',
      iconSvg: BlockIcon2_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Umsatz verdreifacht',
      description: '25.000 € in 5 Monaten – +212,5 % durch smarte Platzierung',
      iconSvg: BlockIcon2_2
    }
  },
  {
    title: "Vertriebskanäle",
    left_block: {
      title: 'Vorher',
      subtitle: 'Nur bekannte Plattformen',
      description: 'Vertrieb ausschließlich über Amazon, eBay, eigene Seite',
      iconSvg: BlockIcon3_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Neue Plattform erschlossen',
      description: 'Ergänzung um Nischenplattform brachte zusätzliche Sichtbarkeit',
      iconSvg: BlockIcon3_2
    }
  },
  {
    title: "Lagerbestand",
    left_block: {
      title: 'Vorher',
      subtitle: 'Überfülltes Lager',
      description: 'Über 40 nicht rentable Produkte blockierten Fläche und Kapital',
      iconSvg: BlockIcon4_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Bereinigtes Sortiment',
      description: 'Unwirtschaftliche Artikel entfernt – Lagerplatz effizient genutzt',
      iconSvg: BlockIcon4_2
    }
  },
  {
    title: "Kapitalbindung",
    left_block: {
      title: 'Vorher',
      subtitle: 'Hohes gebundenes Kapital',
      description: 'Lagerhaltung band unnötig Kapital in langsamen Produkten',
      iconSvg: BlockIcon5_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Weniger gebundenes Kapital',
      description: 'Optimierter Bestand reduziert Kapitalbindung deutlich',
      iconSvg: BlockIcon5_2
    }
  },
  {
    title: "Ressourceneinsatz",
    left_block: {
      title: 'Vorher',
      subtitle: 'Ineffizienter Aufwand',
      description: 'Zeit- und kostenintensive Pflege des Sortiments',
      iconSvg: BlockIcon6_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Fokus auf rentable Artikel',
      description: 'Ressourcen gezielt auf umsatzstarke Produkte gelenkt',
      iconSvg: BlockIcon6_2
    }
  },
])

const path = ref<any[]>([
  {
    name: 'Startseite',
    path: Consts.Routes.home
  },
  {
    name: 'Projekte',
    path: Consts.Routes.homeProjects
  },
  {
    name: 'Optimierung eines Online-Shops',
    path: Consts.Routes.projectsOnlineShop
  }
])
</script>

<template>
  <section class="online-shop">
    <component-consulting-main
        :path="path"
        name_button="Jetzt kostenloses Erstgespräch vereinbaren"
        sub_title="Wirtschaftliche Effizienz durch smarte Sortimentserweiterung und gezielte Optimierung. Durch neue Verkaufskanäle und das Entfernen unrentabler Produkte konnte der Umsatz deutlich gesteigert und die Rentabilität nachhaltig verbessert werden."
        title_1_1=""
        title_1_2="durch gezielte Sortimentserweiterung und -optimierung im Online-Shops"
        title_span="Effizienzsteigerung"
    />
    <div class="online-shop__titleBlock">
      <component-ui-title
          description-p1_1="Gezielte"
          description-p1_2="messbar mehr Ertrag"
          description-p2='Durchdachte Platzierung, gezielte Reduktion – das Sortiment wurde smarter, der Umsatz stieg deutlich, die Lagerkosten sanken. Der Fokus auf rentable Artikel und optimierte Plattformwahl führten zu nachhaltigem Wachstum ohne Zusatzaufwand.'
          description-span1="Sortimentspflege,"
          title="Vorher vs. Nachher"/>
    </div>
    <component-projects-blocks :projects_blocks="projects_block"/>
    <div class="online-shop__titleBlockFull baseBorderBottom">
      <component-ui-title
          description-p1_1="durch gezielte"
          description-p2 = 'Wirtschaftlicher Erfolg wurde durch die Erschließung neuer Vertriebskanäle und das Auslisten unrentabler Produkte erreicht. So konnte der Online-Retailer seinen Umsatz deutlich steigern – bei minimalen Kosten und nachhaltig verbesserter Rentabilität.'
          description-p1_2="und smartes"
          description-span1="Optimierung"
          description-span2="Wachstum"
          description-span0="Rentabilität"
          title="Resultate"/>
    </div>
  </section>
</template>

<style lang="scss">
.online-shop {
  .mainConsulting__title {
    max-width: none;
  }
  .mainConsulting__wrap {
    background-image: url("assets/images/projects/background.webp");
    background-size: 120%;
    background-position: 0% center;
  }
  &__titleBlock {
    margin-top: calc(1.25 * $primary-margin-sections);
    padding-bottom: calc(0.5 * $primary-margin-sections);
  }

  &__titleBlockFull {
    padding-top: $primary-margin-sections;
    .section-header__description p {
      max-width: 94% !important;
      font-size: 20px !important;
    }
    .section-header__description span {
      max-width: 790px;
    }
  }
}
</style>