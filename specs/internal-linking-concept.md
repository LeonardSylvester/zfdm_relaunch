# Internal Linking Strategie fuer SEO & Conversion

## Ziel

- Mehr Beratungen ueber /contact generieren
- SEO durch bessere interne Verlinkung staerken
- Homepage ist bereits gut verlinkt - Fokus auf Unterseiten

---

## 1. KRITISCH: URL-Inkonsistenz beheben - ERLEDIGT

**Problem:** Einige Links zeigen auf `/kontakt` statt `/contact` (404!)

| Datei                  | Zeile            | Aenderung                | Status   |
| ---------------------- | ---------------- | ------------------------ | -------- |
| `src/config/menu.json` | Footer Zeile 118 | `/kontakt` -> `/contact` | ERLEDIGT |

---

## 2. Branchen-Seiten: System-Empfehlungen hinzufuegen - AUSSTEHEND

**Ziel:** Jede Branchenseite empfiehlt passende Zeiterfassungssysteme

### Datei: `src/pages/branchen/[single].astro`

**Position:** Nach Content-Section (Zeile 126), vor Testimonial-Section (Zeile 128)

### Implementierung:

1. System-Mapping als Konstante im Frontmatter definieren
2. Neue Section mit Systemkarten einfuegen
3. CTA-Button zu /contact verlinken

### Code-Vorlage:

```astro
<!-- Recommended Systems Section -->
<section class="section pt-0">
  <div class="container">
    <div class="row">
      <div class="col-12 lg:col-10 mx-auto">
        <div
          class="bg-secondary/5 rounded-2xl p-8 lg:p-12"
          data-aos="fade-up-sm"
        >
          <h2 class="h3 mb-6 text-center">Empfohlene Systeme fuer {title}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* System Cards hier */}
          </div>
          <div class="text-center">
            <a href="/contact" class="btn btn-primary">
              Welches System passt zu Ihnen? Jetzt beraten lassen
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

### Empfehlungs-Mapping (als Konstante im Frontmatter):

```typescript
const SYSTEM_RECOMMENDATIONS: Record<
  string,
  Array<{ slug: string; name: string; benefit: string }>
> = {
  kleinbetriebe: [
    {
      slug: "chip",
      name: "Chip-Zeiterfassung",
      benefit: "Einfach und kostenguenstig",
    },
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Keine Karten noetig",
    },
  ],
  mittelstand: [
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Sicher und schnell",
    },
    {
      slug: "gesichtserkennung",
      name: "Gesichtserkennung",
      benefit: "Kontaktlos und modern",
    },
  ],
  arztpraxen: [
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Hygienisch mit Desinfektionshinweis",
    },
    {
      slug: "gesichtserkennung",
      name: "Gesichtserkennung",
      benefit: "Komplett kontaktlos",
    },
  ],
  handwerk: [
    { slug: "chip", name: "Chip-Zeiterfassung", benefit: "Robust und einfach" },
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Keine verlorenen Karten",
    },
  ],
  gastronomie: [
    {
      slug: "gesichtserkennung",
      name: "Gesichtserkennung",
      benefit: "Kontaktlos und schnell",
    },
    { slug: "chip", name: "Chip-Zeiterfassung", benefit: "Einfach fuer alle" },
  ],
  logistik: [
    { slug: "chip", name: "Chip-Zeiterfassung", benefit: "Schnelle Erfassung" },
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Keine Karten noetig",
    },
  ],
  agenturen: [
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Modern und schnell",
    },
    {
      slug: "gesichtserkennung",
      name: "Gesichtserkennung",
      benefit: "Kontaktlos",
    },
  ],
  schulen: [
    {
      slug: "gesichtserkennung",
      name: "Gesichtserkennung",
      benefit: "Kontaktlos und sicher",
    },
    { slug: "chip", name: "Chip-Zeiterfassung", benefit: "Einfach fuer alle" },
  ],
  kindergarten: [
    {
      slug: "chip",
      name: "Chip-Zeiterfassung",
      benefit: "Einfach zu bedienen",
    },
    {
      slug: "fingerabdruck",
      name: "Fingerabdruck",
      benefit: "Keine Karten noetig",
    },
  ],
};
```

---

## 3. System-Seiten: Branchen-Relevanz hinzufuegen - AUSSTEHEND

**Ziel:** Jede Systemseite zeigt passende Branchen

### Datei: `src/pages/zeiterfassungssysteme/[single].astro`

**Position:** Nach Features-Section, vor RelatedProducts

### Branchen-Mapping (invers zum System-Mapping):

```typescript
const BRANCHEN_FOR_SYSTEM: Record<
  string,
  Array<{ slug: string; name: string; benefit: string }>
> = {
  chip: [
    {
      slug: "kleinbetriebe",
      name: "Kleinbetriebe",
      benefit: "Einfach und kostenguenstig",
    },
    { slug: "handwerk", name: "Handwerk", benefit: "Robust und zuverlaessig" },
    { slug: "gastronomie", name: "Gastronomie", benefit: "Schnelle Erfassung" },
    { slug: "logistik", name: "Logistik", benefit: "Effiziente Zeiterfassung" },
    { slug: "schulen", name: "Schulen", benefit: "Einfach fuer alle" },
    {
      slug: "kindergarten",
      name: "Kindergarten",
      benefit: "Kinderleicht zu bedienen",
    },
  ],
  fingerabdruck: [
    {
      slug: "kleinbetriebe",
      name: "Kleinbetriebe",
      benefit: "Keine Karten noetig",
    },
    { slug: "mittelstand", name: "Mittelstand", benefit: "Sicher und schnell" },
    { slug: "arztpraxen", name: "Arztpraxen", benefit: "Hygienisch" },
    { slug: "handwerk", name: "Handwerk", benefit: "Keine verlorenen Karten" },
    { slug: "logistik", name: "Logistik", benefit: "Keine Karten noetig" },
    { slug: "agenturen", name: "Agenturen", benefit: "Modern und schnell" },
    {
      slug: "kindergarten",
      name: "Kindergarten",
      benefit: "Keine Karten noetig",
    },
  ],
  gesichtserkennung: [
    {
      slug: "mittelstand",
      name: "Mittelstand",
      benefit: "Kontaktlos und modern",
    },
    { slug: "arztpraxen", name: "Arztpraxen", benefit: "Komplett kontaktlos" },
    {
      slug: "gastronomie",
      name: "Gastronomie",
      benefit: "Kontaktlos und schnell",
    },
    { slug: "agenturen", name: "Agenturen", benefit: "Kontaktlos" },
    { slug: "schulen", name: "Schulen", benefit: "Kontaktlos und sicher" },
  ],
};
```

### Code-Vorlage:

```astro
<!-- Ideal Industries Section -->
<section class="section pt-0">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="bg-primary/5 rounded-2xl p-8 lg:p-12" data-aos="fade-up-sm">
          <h2 class="h3 mb-6 text-center">Ideal fuer diese Branchen</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {
              branchenForSystem.map((branche) => (
                <a
                  href={`/branchen/${branche.slug}`}
                  class="bg-white rounded-xl p-4 hover:shadow-lg transition-shadow text-center"
                >
                  <div class="font-semibold text-text-dark">{branche.name}</div>
                  <div class="text-sm text-text">{branche.benefit}</div>
                </a>
              ))
            }
          </div>
          <div class="text-center">
            <a href="/contact" class="btn btn-primary">
              Passt unser System zu Ihrer Branche? Kostenlose Beratung
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 4. Blog-Posts: Kontextuelle CTAs hinzufuegen - AUSSTEHEND

**Ziel:** Jeden Blogpost mit relevanten internen Links + Contact-CTA versehen

### Datei: `src/pages/ressourcen/blog/[single].astro`

**Position:** Nach dem Content, vor Related Posts

### Implementierung:

1. Statische Links zu den drei Hauptsystemen
2. Link zu Branchen-Uebersicht
3. CTA-Button zu /contact

### Code-Vorlage:

```astro
<!-- Contextual CTA Section -->
<section class="section pt-0">
  <div class="container">
    <div class="row justify-center">
      <div class="lg:col-8">
        <div
          class="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8"
          data-aos="fade-up-sm"
        >
          <h3 class="h4 mb-6">Das koennte Sie auch interessieren</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <a
              href="/zeiterfassungssysteme/chip"
              class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <IconMapper
                icon="chip"
                className="text-primary mr-3"
                size="1.5rem"
                ariaHidden={true}
              />
              <span>Chip-Zeiterfassung</span>
            </a>
            <a
              href="/zeiterfassungssysteme/fingerabdruck"
              class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <IconMapper
                icon="fingerprint"
                className="text-primary mr-3"
                size="1.5rem"
                ariaHidden={true}
              />
              <span>Fingerabdruck-System</span>
            </a>
            <a
              href="/zeiterfassungssysteme/gesichtserkennung"
              class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <IconMapper
                icon="face"
                className="text-primary mr-3"
                size="1.5rem"
                ariaHidden={true}
              />
              <span>Gesichtserkennung</span>
            </a>
            <a
              href="/branchen"
              class="flex items-center p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <IconMapper
                icon="building"
                className="text-primary mr-3"
                size="1.5rem"
                ariaHidden={true}
              />
              <span>Branchenloesungen</span>
            </a>
          </div>
          <div class="text-center">
            <a href="/contact" class="btn btn-primary">
              Fragen zur Zeiterfassung? Jetzt beraten lassen
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 5. Ressourcen-Seiten: Direkte Contact-Links - AUSSTEHEND

### 5.1 FAQs (`src/pages/ressourcen/faqs.astro`)

**Position:** Am Ende jeder FAQ-Kategorie

```astro
<div class="mt-8 p-6 bg-primary/5 rounded-xl text-center">
  <p class="mb-4">Noch Fragen? Wir helfen gerne!</p>
  <a href="/contact" class="btn btn-primary">
    Jetzt kostenlose Beratung buchen
  </a>
</div>
```

### 5.2 Kostenrechner (`src/pages/ressourcen/kostenrechner.astro`)

**Position:** Nach dem Berechnungsergebnis

```astro
<div class="mt-8 p-6 bg-secondary/5 rounded-xl text-center">
  <p class="mb-4 text-lg font-medium">
    Moechten Sie ein individuelles Angebot?
  </p>
  <a href="/contact" class="btn btn-primary"> Beratung anfragen </a>
</div>
```

### 5.3 Videoanleitungen (`src/pages/ressourcen/videoanleitungen.astro`)

**Position:** Unter jedem Video-Container

```astro
<div class="mt-4 text-center">
  <a
    href="/contact"
    class="text-primary hover:text-secondary transition-colors"
  >
    Fragen zur Einrichtung? Persoenliche Beratung buchen
    <IconMapper
      icon="arrow"
      className="ml-1 inline"
      size="1rem"
      ariaHidden={true}
    />
  </a>
</div>
```

---

## 6. Preise-Seite: Staerkerer CTA - AUSSTEHEND

### Datei: `src/pages/preise.astro` und `src/layouts/components/Pricing/`

### 6.1 Pricing Cards

**Aenderung:** Jeder Preis-Plan bekommt zusaetzlichen "Beratung anfragen" Link

```astro
<div class="mt-4 text-center">
  <a href="/contact" class="text-sm text-primary hover:text-secondary">
    Oder: Persoenliche Beratung anfragen
  </a>
</div>
```

### 6.2 Vergleichstabelle

**Position:** Nach der Vergleichstabelle

```astro
<div
  class="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl text-center"
>
  <p class="text-lg font-medium mb-4">
    Nicht sicher, welches Paket das richtige ist?
  </p>
  <a href="/contact" class="btn btn-primary"> Lassen Sie sich beraten </a>
</div>
```

---

## Betroffene Dateien

| Datei                                            | Aenderung                        | Status     |
| ------------------------------------------------ | -------------------------------- | ---------- |
| `src/config/menu.json`                           | URL-Fix `/kontakt` -> `/contact` | ERLEDIGT   |
| `src/pages/branchen/[single].astro`              | System-Empfehlungen Box          | AUSSTEHEND |
| `src/pages/zeiterfassungssysteme/[single].astro` | Branchen-Relevanz Box            | AUSSTEHEND |
| `src/pages/ressourcen/blog/[single].astro`       | Kontext-CTA Box                  | AUSSTEHEND |
| `src/pages/ressourcen/faqs.astro`                | Contact-Links                    | AUSSTEHEND |
| `src/pages/ressourcen/kostenrechner.astro`       | Contact-CTA                      | AUSSTEHEND |
| `src/pages/ressourcen/videoanleitungen.astro`    | Contact-Links                    | AUSSTEHEND |
| `src/pages/preise.astro`                         | Beratungs-CTAs                   | AUSSTEHEND |
| `src/layouts/components/Pricing/*.astro`         | Beratungs-Links in Cards         | AUSSTEHEND |

---

## Priorisierung

| Prioritaet | Aufgabe                                 | Status     |
| ---------- | --------------------------------------- | ---------- |
| 1. Hoch    | URL-Fix (`/kontakt` -> `/contact`)      | ERLEDIGT   |
| 2. Hoch    | System-Empfehlungen auf Branchen-Seiten | AUSSTEHEND |
| 3. Mittel  | Branchen-Relevanz auf System-Seiten     | AUSSTEHEND |
| 4. Mittel  | Blog-CTAs                               | AUSSTEHEND |
| 5. Niedrig | Ressourcen-Seiten CTAs                  | AUSSTEHEND |
| 6. Niedrig | Preise-Seite CTAs                       | AUSSTEHEND |

---

## Naechste Schritte

Um die Implementierung zu starten, fuehre folgende Befehle aus:

1. `yarn dev` - Entwicklungsserver starten
2. Aenderungen Schritt fuer Schritt implementieren (Prioritaet 2-6)
3. `yarn build` - Build testen
4. Aenderungen committen
