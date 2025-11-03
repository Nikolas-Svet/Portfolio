<script lang="ts" setup>
definePageMeta({
  layout: 'layout-default',
  // title: 'Imprint'
})

useHead({
  title: 'Imprint'
})
</script>

<template>
  <h2 class="document__title">
    Impressum
  </h2>
  <section class="document">
    <div class="document__content">
      <div class="document__block">
        <h3>Website</h3>
        <p>Dieses Impressum gilt für alle Angebote unter der Domain www.digicore.biz inklusive aller
          Subdomains (Unterseiten).</p>
      </div>
      <div class="document__block">
        <h3>Soziale Medien</h3>
        <p>Dieses Impressum gilt auch für unsere Auftritte in den folgenden sozialen Medien:</p>
        <ul>
          <li>Facebook: ____________</li>
          <li>Instagram: ____________</li>
          <li>TikTok: _______________</li>
          <li>YouTube: _____________</li>
        </ul>
      </div>
      <div class="document__block">
        <h3>Angaben gemäß § 5 DDG</h3>
        <ul>
          <li>JAL Consulting GmbH</li>
          <li>Heppstr. 4</li>
          <li>85057 Ingolstadt</li>
          <li>E-Mail: info@jalicon.de</li>
        </ul>
      </div>
      <hr>
      <div class="document__block">
        <h3>Eintragung</h3>
        <ul>
          <li>Register: Amtsgericht Ingolstadt</li>
          <li>Registernummer: HRB 9699</li>
        </ul>
      </div>
      <div class="document__block">
        <h3>Umsatzsteuer-Identifikationsnummer</h3>
        <ul>
          <li>DE334363786</li>
        </ul>
      </div>
      <div class="document__block">
        <h3>Vertretungsberechtigte Personen</h3>
        <ul>
          <li>Viktoriia Klymovych, Geschäftsführerin</li>
        </ul>
      </div>
      <div class="document__block">
        <h3>Zusätzliche Informationen</h3>
        <p>Unsere Beratung ist keine Rechts- oder Steuerberatung. Rechts- & Steuerberatung ist nur individuell
          mandatierten Mitgliedern der rechts- & steuerberatenden Berufe gestattet. Für die Umsetzung & individuelle
          Beratung ziehe bitte den Rechtsanwalt oder Steuerberater Deines Vertrauens hinzu. Diese Beratung ersetzt auf
          keinen
          Fall eine individuelle steuerliche & rechtliche Beratung.</p>
      </div>
      <div class="document__block">
        <h3>Audiovisuelle Mediendienste</h3>
        <ul>
          <li>Sitzland: Deutschland</li>
          <li>Zuständige Aufsichtsbehörde: Bayern</li>
        </ul>
      </div>
      <div class="document__block">
        <h3>Gültigkeit</h3>
        <p>Dieses Impressum gilt ab dem 23. Juni 2025.</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.document {
  width: 100%;
  border-radius: $primary-radius;
  padding: calc(0.25 * $primary-margin-sections);
  background-color: $primary-green;
  max-width: 1000px;
  margin-bottom: calc(0.5 * $primary-margin-sections);

  &:last-child {
    margin-bottom: 0;
  }

  h2 {
    text-align: center;
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: 24px;
    color: $default-black;
    margin-bottom: calc(0.5 * $primary-margin-sections);
  }

  &__block {
    margin-bottom: calc(0.5 * $primary-margin-sections);

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: 20px;
      color: $default-black;
      font-family: $Inter-Medium;
      font-weight: 500;
      margin-bottom: calc(0.25 * $primary-margin-sections);
    }

    h4 {
      font-size: 18px;
      color: $default-black;
      font-family: $Inter-Medium;
      font-weight: 500;
      margin-bottom: calc(0.25 * $primary-margin-sections);
    }

    p {
      font-size: 16px;
      color: $default-black;
      font-family: $Inter-Regular;
      font-weight: 400;
    }

    ul {
      margin-top: calc(0.25 * $primary-margin-sections);
      list-style-type: none;

      li {
        font-size: 16px;
        line-height: 1.6;
        color: $default-black;
        font-family: $Inter-Regular;
        font-weight: 400;

        span {
          font-size: 16px;
          color: $default-black;
          font-family: $Inter-Medium;
          font-weight: 500;
        }
      }
    }
  }

  hr {
    width: 100%;
    height: 1px;
    background-color: $default-black;
    margin-bottom: calc(0.5 * $primary-margin-sections);
  }

  &__title {
    text-align: center;
    font-family: $Manrope-Medium;
    font-weight: 500;
    font-size: clamp(24px, 4.5vw, 64px);
    color: $default-white;
    margin-top: calc(1.25 * $primary-margin-sections);
    margin-bottom: calc(0.75 * $primary-margin-sections);
  }

  &__content {
    width: 100%;
    border-radius: $primary-radius;
    padding: calc(0.5 * $primary-margin-sections) calc(0.35 * $primary-margin-sections);
    background-color: $default-white;
  }
}
</style>

<style lang="scss" scoped>
@media (width < 768px) {
  h3 {
    font-size: 18px !important;
  }
}
</style>
