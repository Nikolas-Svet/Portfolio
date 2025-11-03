<script setup lang="ts">
import ComponentConsultingMain from "@/components/consulting/componentConsultingMain.vue";
import ComponentUiTitle from "@/components/ui/componentUiTitle.vue";
import ComponentProjectsBlocks from "@/components/projects/componentProjectsBlocks.vue";
import ComponentConsultingProcedure from "@/components/consulting/componentConsultingProcedure.vue";
import type {IProjectsBlocks} from "@/types/ProjectsBlocks";
import BlockIcon1_1 from "@/assets/images/projects/blocks/crm-system/icon1_1.svg";
import BlockIcon1_2 from "@/assets/images/projects/blocks/crm-system/icon1_2.svg";
import BlockIcon2_1 from "@/assets/images/projects/blocks/crm-system/icon2_1.svg";
import BlockIcon2_2 from "@/assets/images/projects/blocks/crm-system/icon2_2.svg";
import BlockIcon3_1 from "@/assets/images/projects/blocks/crm-system/icon3_1.svg";
import BlockIcon3_2 from "@/assets/images/projects/blocks/crm-system/icon3_2.svg";
import BlockIcon4_1 from "@/assets/images/projects/blocks/crm-system/icon4_1.svg";
import BlockIcon4_2 from "@/assets/images/projects/blocks/crm-system/icon4_2.svg";
import BlockIcon5_1 from "@/assets/images/projects/blocks/crm-system/icon5_1.svg";
import BlockIcon5_2 from "@/assets/images/projects/blocks/crm-system/icon5_2.svg";
import BlockIcon6_1 from "@/assets/images/projects/blocks/crm-system/icon6_1.svg";
import BlockIcon6_2 from "@/assets/images/projects/blocks/crm-system/icon6_2.svg";
import BlockIcon7_1 from "@/assets/images/projects/blocks/crm-system/icon7_1.svg";
import BlockIcon7_2 from "@/assets/images/projects/blocks/crm-system/icon7_2.svg";
import type ITitle from "@/types/UiTitle";
import type {IBlocks} from "@/types/ComponentWithRectangle";
import {Consts} from "@/consts";

useHead({
  title: 'Projects — CRM System',
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
    title: "Datenverwaltung",
    left_block: {
      title: 'Vorher',
      subtitle: 'Excel & E-Mail',
      description: 'Verteilte Daten, hoher Aufwand',
      iconSvg: BlockIcon1_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'ZENTRALES CRM-SYSTEM',
      description: 'Alle Informationen an einem Ort, automatisiert',
      iconSvg: BlockIcon1_2
    }
  },
  {
    title: "Aufgabensteuerung",
    left_block: {
      title: 'Vorher',
      subtitle: 'MANUELLE AUFGABENVERTEILUNG',
      description: 'Keine Übersicht, hoher Koordinationsaufwand',
      iconSvg: BlockIcon2_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'AUFGABENMANAGEMENT IM CRM',
      description: 'Struktur & Fortschrittskontrolle im System',
      iconSvg: BlockIcon2_2
    }
  },
  {
    title: "Vertragsmanagement",
    left_block: {
      title: 'Vorher',
      subtitle: 'MANUELLE FRISTENÜBERWACHUNG',
      description: 'Hohe Fehleranfälligkeit, Zeitverlust',
      iconSvg: BlockIcon3_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'AUTOMATISCHE ERINNERUNGEN',
      description: 'Status & Kündigung zentral verwaltet',
      iconSvg: BlockIcon3_2
    }
  },
  {
    title: "Kundenkommunikation",
    left_block: {
      title: 'Vorher',
      subtitle: 'UNSTRUKTURIERTE E-MAILS',
      description: 'Verzögerte Reaktionen, keine Dokumentation',
      iconSvg: BlockIcon4_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'CRM-KOMMUNIKATION',
      description: 'Schnell, nachvollziehbar und dokumentiert',
      iconSvg: BlockIcon4_2
    }
  },
  {
    title: "Teamstruktur",
    left_block: {
      title: 'Vorher',
      subtitle: 'KEIN WACHSTUM IM TEAM',
      description: '1 Inhaber + 1 Mitarbeiter',
      iconSvg: BlockIcon5_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: 'GLEICHE TEAMSTRUKTUR',
      description: 'Mehr Leistung ohne Personalaufbau',
      iconSvg: BlockIcon5_2
    }
  },
  {
    title: "Kundenbestand",
    left_block: {
      title: 'Vorher',
      subtitle: '732 VERTRÄGE',
      description: 'Wachstum = Mehraufwand',
      iconSvg: BlockIcon6_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: '+152 VERTRÄGE IN 3 MONATEN',
      description: 'Effizienzsteigerung ohne zusätzliches Personal',
      iconSvg: BlockIcon6_2
    }
  },
  {
    title: "Jahresumsatz",
    left_block: {
      title: 'Vorher',
      subtitle: '131.760 € UMSATZ',
      description: 'Limit durch manuelle Prozesse',
      iconSvg: BlockIcon7_1
    },
    right_block: {
      title: 'Nachher',
      subtitle: '159.120 € UMSATZ',
      description: '+20 % durch Digitalisierung',
      iconSvg: BlockIcon7_2
    }
  },
])

const title_data_procedure = ref<ITitle>({
  description_p1_1: '',
  description_p1_2: 'durch zentrale CRM-Lösung',
  description_p2: '',
  description_span1: 'Ergebnisse',
  title: 'Ergebnisse',
})

const procedures_blocks = ref<IBlocks[]>([
  {
    name: 'Automatisierung',
    description: 'Alle Informationen an einem Ort - Prozesse laufen automatisch.'
  },
  {
    name: 'Strukturierter Workflow',
    description: 'Aufgabenverteilung und Fortschritt sind klar nachvollziehbar.'
  },
  {
    name: 'Effiziente Kommunikation',
    description: 'Schnelle Bearbeitung direkt im CRM.'
  },
  {
    name: 'Wachstum ohne Mehraufwand',
    description: '+20 % mehr Verträge in 3 Monaten – ohne zusätzliches Personal.'
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
    name: 'Implementierung eines CRM-Systems für einen Energiebroker',
    path: Consts.Routes.projectsCrmSystem
  }
])
</script>

<template>
  <section class="crm-system">
    <component-consulting-main
        :path="path"
        name_button="Jetzt kostenloses Erstgespräch vereinbaren"
        sub_title="Wirtschaftliche Effizienz heißt: mehr erreichen mit gleichen Ressourcen. Dank CRM und smarter Digitalisierung konnte der Umsatz nachhaltig gesteigert werden – ohne höhere Kosten. Ein klares Beispiel für messbare Wirkung durch Prozessoptimierung."
        title_1_1="Effizienzsteigerung durch zentrale CRM-Lösung für"
        title_1_2="mit Vermittlern"
        title_span="Energie - und Gasverträge"
    />
    <div class="crm-system__titleBlock">
      <component-ui-title
          description-p1_1=""
          description-p1_2="effizient gewachsen"
          description-p2='Durch die Einführung eines CRM-Systems wurden alle Daten, Aufgaben und Kommunikationswege an einem Ort vereint. Verträge werden nun automatisiert verwaltet, das Team bleibt schlank – und der Umsatz wächst messbar.'
          description-span1="Zentral gesteuert,"
          title="Vorher vs. Nachher"/>
    </div>
    <component-projects-blocks :projects_blocks="projects_block"/>
    <component-consulting-procedure :blocks="procedures_blocks"
                                    :title_data="title_data_procedure" is_button="Kostenloses Erstgespräch vereinbaren"/>
    <div class="crm-system__titleBlockFull baseBorderBottom">
      <component-ui-title
          description-p1_1=""
          description-p2 = 'Mehr erreichen mit denselben Mitteln: Durch die Einführung eines intelligenten CRM-Systems konnte das Unternehmen den Umsatz nachhaltig steigern – bei gleichbleibender Kostenstruktur. Ein klassisches Beispiel dafür, wie Prozessoptimierung zu messbar besseren Ergebnissen führt.'
          description-p1_2="beginnt mit dem richtigen"
          description-span1="Wirtschaftlichkeit"
          description-span2="System."
          title="Resultate"/>
    </div>
  </section>
</template>

<style lang="scss">
.crm-system {
  .mainConsulting__title {
    max-width: none;

    &::first-line {
      word-spacing: 4px;
      letter-spacing: 2.5px;
    }
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
      font-size: 20px;
    }
    .section-header__description span {
      max-width: 700px;
    }
  }

  .mainConsulting__wrap {
    background-image: url("assets/images/projects/background.webp");
    background-size: 120%;
    background-position: 0% center;
  }

  .blocks__item {
    padding-right: calc(var(--primary-margin-sections) * 1);
  }
  .procedure {
    .section-header__description span {
      max-width: 600px;
    }
  }
}
</style>