<script lang="ts" setup>
import ComponentConsultingMain from "@/components/consulting/componentConsultingMain.vue";
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentProjectsBlocks from "@/components/projects/componentProjectsBlocks.vue";
import type {IProjectsBlocks} from "@/types/ProjectsBlocks";
import BlockIcon1_1 from '@/assets/images/projects/blocks/pizzeria/icon1_1.svg';
import BlockIcon1_2 from '@/assets/images/projects/blocks/pizzeria/icon1_2.svg';
import BlockIcon2_1 from '@/assets/images/projects/blocks/pizzeria/icon2_1.svg';
import BlockIcon2_2 from '@/assets/images/projects/blocks/pizzeria/icon2_2.svg';
import BlockIcon3_1 from '@/assets/images/projects/blocks/pizzeria/icon3_1.svg';
import BlockIcon3_2 from '@/assets/images/projects/blocks/pizzeria/icon3_2.svg';
import BlockIcon4_1 from '@/assets/images/projects/blocks/pizzeria/icon4_1.svg';
import BlockIcon4_2 from '@/assets/images/projects/blocks/pizzeria/icon4_2.svg';
import BlockIcon5_1 from '@/assets/images/projects/blocks/pizzeria/icon5_1.svg';
import BlockIcon5_2 from '@/assets/images/projects/blocks/pizzeria/icon5_2.svg';
import BlockIcon6_1 from '@/assets/images/projects/blocks/pizzeria/icon6_1.svg';
import BlockIcon6_2 from '@/assets/images/projects/blocks/pizzeria/icon6_2.svg';
import BlockIcon7_1 from '@/assets/images/projects/blocks/pizzeria/icon7_1.svg';
import BlockIcon7_2 from '@/assets/images/projects/blocks/pizzeria/icon7_2.svg';
import ComponentConsultingProcedure from "@/components/consulting/componentConsultingProcedure.vue";
import type ITitle from "@/types/UiTitle";
import type {IBlocks} from "@/types/ComponentWithRectangle";
import {Consts} from "@/consts";

useHead({
  title: 'Projects — Pizzeria',
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
    title: "Bestell- und Reservierungssystem",
    left_block: {
      title: 'Vorher',
      subtitle: 'Telefonisch & Papierkalender',
      description: 'Bestellungen und Reservierungen ausschließlich telefonisch, Planung auf Papier',
      iconSvg: BlockIcon1_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Online-System über Webseite',
      description: 'Digitale Reservierung und Bestellung direkt über die moderne Website',
      iconSvg: BlockIcon1_2
    }
  },
  {
    title: "Webauftritt",
    left_block: {
      title: 'Vorher',
      subtitle: 'Keine Online-Präsenz',
      description: 'Kein Webauftritt, keine Aktivitäten in sozialen Netzwerken',
      iconSvg: BlockIcon2_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Digitale Präsenz mit Gamification',
      description: 'Moderne One-Page-Seite mit digitaler Speisekarte & Interaktionsmöglichkeiten',
      iconSvg: BlockIcon2_2
    }
  },
  {
    title: "Bestellaufnahme durch Mitarbeiter",
    left_block: {
      title: 'Vorher',
      subtitle: 'Hoher Aufwand',
      description: 'Viel Zeitbedarf für Telefonate, manuelle Eingab',
      iconSvg: BlockIcon3_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Selbstbestellung per QR-Code',
      description: 'Kunden bestellen selbstständig per QR – entlastet das Personal',
      iconSvg: BlockIcon3_2
    }
  },
  {
    title: "Täglicher Pizzaverkauf",
    left_block: {
      title: 'Vorher',
      subtitle: '130 Pizzen pro Tag',
      description: 'Durchschnittlicher Tagesabsatz vor der Optimierung',
      iconSvg: BlockIcon4_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: '180 Pizzen pro Tag',
      description: 'Absatzsteigerung durch Effizienz und Sichtbarkeit',
      iconSvg: BlockIcon4_2
    }
  },
  {
    title: "Tagesumsatz & Umsatzwachstum",
    left_block: {
      title: 'Vorher',
      subtitle: '2.210 € Umsatz',
      description: 'Typischer Tagesumsatz vor der Digitalisierung',
      iconSvg: BlockIcon5_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: '3.060 € Umsatz, +38 % Wachstum',
      description: 'Erhöhter Tagesumsatz durch Digitalisierung und Prozessoptimierung',
      iconSvg: BlockIcon5_2
    }
  },
  {
    title: "Kundenerlebnis",
    left_block: {
      title: 'Vorher',
      subtitle: 'Langsame Prozesse',
      description: 'Lange Wartezeiten bei Telefonbestellung',
      iconSvg: BlockIcon6_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Bestellung per Smartphone',
      description: 'Schnell, bequem, digital',
      iconSvg: BlockIcon6_2
    }
  },
  {
    title: "Mitarbeiterbelastung",
    left_block: {
      title: 'Vorher',
      subtitle: 'Hohe Belastung',
      description: 'Telefonstress, kaum Fokus auf Küche & Service',
      iconSvg: BlockIcon7_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'Entlastetes Team',
      description: 'Fokus auf Produktion und Gastfreundschaft',
      iconSvg: BlockIcon7_2
    }
  },
])

const title_data_procedure = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'durch kleine digitale Schritte',
  description_p2: '',
  description_span1: 'Messbare effekte',
  title: 'messbare effekte',
})

const procedures_blocks = ref<IBlocks[]>([
  {
    name: 'Reduzierung',
    description: 'Weniger Belastung bei Bestellannahme und Reservierungen – das Team wird entlastet und kann sich besser auf Service und Küche konzentrieren.'
  },
  {
    name: 'Erhöhung',
    description: 'Höhere Mitarbeiterzufriedenheit – klare Prozesse und weniger Stress schaffen ein besseres Arbeitsumfeld.'
  },
  {
    name: 'Steigerung',
    description: 'Größere Markenbekanntheit durch Social-Media-Aktivitäten – mehr Sichtbarkeit für die Pizzeria und direkter Kundenkontakt.'
  }
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
    name: 'Optimierung einer Pizzeria',
    path: Consts.Routes.projectsPizzeria
  }
])
</script>

<template>
  <section class="pizzeria">
    <component-consulting-main
        :path="path"
        name_button="Jetzt kostenloses Erstgespräch vereinbaren"
        sub_title="Viele Unternehmen verlieren Effizienz durch veraltete Prozesse und ungenutzte IT-Lösungen. Unser Corporate Consulting hilft, Strukturen zu optimieren, Kosten zu senken und den Fokus auf das Wesentliche zu richten"
        title_1_1="Beispiel für Effizienzsteigerung:"
        title_1_2=""
        title_span="Erfolgsgeschichte einer Pizzeria"
    />
    <div class="pizzeria__titleBlock">
      <component-ui-title
          description-p1_1="Digitale Schritte für echte Ergebnisse"
          description-p1_2="smarter gemacht."
          description-p2='Eine Pizzeria mit engagiertem Team, aber ohne digitale Prozesse. Alles wurde telefonisch und auf Papier abgewickelt – kein Webauftritt, keine Automatisierung. Das tägliche Geschäft war aufwendig und ineffizient.'
          description-span1="Eine einfache Pizzeria,"
          title="Vorher vs. Nachher"/>
    </div>
    <component-projects-blocks :projects_blocks="projects_block"/>
    <component-consulting-procedure :blocks="procedures_blocks"
                                    :title_data="title_data_procedure" is_button="Kostenloses Erstgespräch vereinbaren"/>
    <div class="pizzeria__titleBlockFull baseBorderBottom">
      <component-ui-title
          description-p1_1=""
          description-p2 = 'Mehr erreichen, ohne mehr zu verbrauchen: Mit kleinen, gezielten Digitalmaßnahmen haben wir bestehende Ressourcen neu genutzt – und große Wirkung erzielt. Mehr Verkäufe, reibungslosere Abläufe, zufriedene Kunden und ein motiviertes Team – ganz ohne zusätzliches Personal oder Überstunden.'
          description-p1_2="ist kein Zufall – sie ist eine"
          description-span1="Effizienz"
          description-span2="Entscheidung."
          title="Resultate"/>
    </div>
  </section>
</template>

<style lang="scss">
.pizzeria {
  .mainConsulting__title {
    max-width: 1060px;
  }

  &__titleBlock {
    margin-top: calc(1.25 * $primary-margin-sections);
    padding-bottom: calc(0.5 * $primary-margin-sections);
  }

  &__titleBlockFull {
    padding-top: $primary-margin-sections;
    .section-header__description p {
      max-width: 94% !important;
      font-size: 20px;
    }
  }

  .mainConsulting__wrap {
    background-image: url("assets/images/projects/background.webp");
    background-size: 120%;
    background-position: 0% center;
  }

  .blocks__item {
    &:nth-child(even) {
      .blocks__description {
        width: 81%;
      }
    }
  }

  .procedure {
    .section-header__description span {
      max-width: 700px;
    }
  }
}
</style>