# SPEC: WordPress Home.md → Astro New-Home Migration

**Projekt:** ZfdM Zeiterfassung
**Datum:** 2024-12-29
**Version:** 1.0
**Ziel:** WordPress Homepage-Content in das neue Astro-Design übertragen

---

## Übersicht

Dieser Spec beschreibt die vollständige Migration der WordPress-Homepage (`home.md`) in das neue Astro-Projekt unter `/new-home`, wobei **ausschließlich bestehende Komponenten** aus `/src/layouts/components/home/` wiederverwendet werden und das SyncMaster Design-System eingehalten wird.

---

## ⚠️ KRITISCHE ANFORDERUNGEN

### 1. 100% Content-Vollständigkeit

**Regel:** KEIN Text aus `wordpress-export/pages/home.md` darf verloren gehen!

**Validierungs-Checkliste:**
- [ ] Alle Überschriften (H1-H6) aus WP sind in Astro vorhanden
- [ ] Alle Text-Absätze sind übernommen
- [ ] Alle Bullet-Points/Listen sind vollständig
- [ ] Alle CTAs (Buttons/Links) sind integriert
- [ ] Alle Testimonial-Texte sind komplett
- [ ] Alle FAQ-Fragen UND -Antworten sind übernommen
- [ ] Video-Links sind funktional
- [ ] Externe Links (Wikipedia, Apps, etc.) sind erhalten

### 2. Bilder-Migration

**Quell-Pfad:**
```
/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/wordpress-export/pages/images/
```

**Ziel-Struktur:**
```
/public/images/logos/      # Kunden-Logos
/public/images/home/       # Homepage-Bilder
/public/images/testimonials/ # Google Icon etc.
```

---

## Content-Analyse: WordPress home.md

### Struktur (315 Zeilen)

**Haupt-Sektionen:**

1. **Hero-Sektion** (Zeilen 6-13)
   - Haupttitel: "Digitale Mitarbeiter Zeiterfassung"
   - Untertitel: "kinderleicht für jedes Unternehmen..."
   - 2 CTAs: Video-Anleitung + 14 Tage testen
   - Video: Roy-KI-Assistent MP4

2. **Trust/Social Proof** (Zeilen 15-21)
   - "Mehr als 2000 Unternehmen nutzen..."
   - 8 Kunden-Logos

3. **USP-Icons/Features** (Zeilen 23-48)
   - 7 Key-Features als Liste:
     - Hergestellt in Deutschland
     - Kostenloser Support
     - Lokale Datenspeicherung
     - Home Office-fähig
     - Einmalige Kosten
     - Netzwerk-/WLAN-fähig
     - Ratenzahlung

4. **Warum-Sektion** (Zeilen 50-80)
   - 5 Text-Blöcke mit Argumenten
   - 2 CTAs: Video-Anleitung + Referenzen

5. **Testimonials** (Zeilen 82-157)
   - Video-Testimonial: Johannes Bopp
   - 6 Google Reviews mit 5 Sternen

6. **Fragebogen-CTA** (Zeilen 159-163)
   - YouTube Embed
   - CTA: Fragebogen ausfüllen

7. **Vorteile-Liste** (Zeilen 165-206)
   - 9 Hauptvorteile mit detaillierten Beschreibungen

8. **Zeiterfassungssysteme-Produkte** (Zeilen 208-232)
   - Integration mehrerer Terminals
   - Chip-System (mit Bild)
   - Fingerabdruck-System (mit Bild)

9. **Gesetzeskonform-Sektion** (Zeilen 234-244)
   - Bundesarbeitsgericht-Info
   - Bild: Gesetzesänderungen

10. **FAQ-Sektion** (Zeilen 246-308)
    - 12+ häufige Fragen mit Antworten
    - ⚠️ Duplikate in Zeilen 279-306 entfernen

11. **Über Uns / Company** (Zeilen 310-314)
    - "WIR SIND ZWAR KLEIN..."
    - Team-Bild

---

## Komponenten-Mapping

### Verfügbare Astro-Komponenten

```
/src/layouts/components/home/
├── Hero.astro
├── Features.astro
├── Offering.astro
├── Benefits.astro
└── Plans.astro (nicht verwendet)
```

### Mapping: WordPress → Astro

| WP-Sektion | Astro-Komponente | Anpassung |
|------------|------------------|-----------|
| Hero + Social Proof | `Hero.astro` | Title, Content, Buttons, 8 Logos |
| USP-Icons (7 Features) | **NEUE** `UspFeatures.astro` | Emoji + Grid |
| Warum-Argumente | `Offering.astro` | 5 → 3 Blöcke à 2 Points |
| Vorteile | `Benefits.astro` | 9 Benefits mit Bildern |
| Produkte | `Features.astro` | 3 Produkte (Chip/Finger/Multi) |
| Testimonials | Aus `sections/` Collection | Import bestehend |
| FAQ | `<Accordion>` Shortcode | MDX |
| Gesetzeskonform | **NEUE** Text+Bild Section | Grid |
| Über Uns | **NEUE** Text+Bild Section | Grid |

---

## Detaillierte Content-Struktur

### 1. Hero-Sektion → `Hero.astro`

**YAML für `src/content/homepage/new-home.md`:**

```yaml
hero:
  title: "Digitale Mitarbeiter Zeiterfassung - <br> Zeiterfassungsysteme günstig und webbasiert"
  content: "Digitale Zeiterfassung kinderleicht für jedes Unternehmen: ohne Schnickschnack Zeit sparen und Stress reduzieren. Keine monatlichen Kosten und ohne jährliche Service-Gebühren."
  image: "/videos/Roy-KI-Assistent-ZFDM-mit-Untertiteln.mp4"
  button:
    - enable: true
      label: "Video-Anleitung anschauen"
      link: "/videos-zeiterfassung-fur-kleine-unternehmen/"
    - enable: true
      label: "14 Tage kostenlos testen"
      link: "/contact/"
  customer:
    image:
      - "/images/logos/coffee-fellows.png"
      - "/images/logos/graeff.png"
      - "/images/logos/johannes-bopp.png"
      - "/images/logos/rss-bochum.png"
      - "/images/logos/hirshline.png"
      - "/images/logos/hald.png"
      - "/images/logos/le-postillion.png"
      - "/images/logos/hausarztpraxis.png"
    note: "Mehr als 2000 Unternehmen nutzen unsere digitalen Mitarbeiter Zeiterfassungssysteme"
```

**Bilder zu migrieren:**
- Coffee-Fellows-Logo-3-r5d43b1ubbft24ygxxu15gl980nzleguc2l48is64g.png → coffee-fellows.png
- logo-graeff-2-r5d0qu2idqit1by6ev5ekv0gc6gf1y7brsirxtenls.png → graeff.png
- Johannes-Bopp-Gmbh-Logo_09-21-schwarz-150x150.png → johannes-bopp.png
- logo_rss-bochum-r5d0qt4o6whippzjkcqs0d8zqsl1u93lfnvagjg1s0.png → rss-bochum.png
- hirshline-1-r5d49kn3vk0mgjuscnchrvnvshs2wrcf735nexhon4.png → hirshline.png
- hald-r5d0qr8zt8ey2i29vbxivdq2k0ubeuw4rekbhziu4g.png → hald.png
- Le-Postillion-Logo-r5d3ddo3sty2tcm9c8dhvi4jcegi9yjdrqryor83r4.png → le-postillion.png
- Hausarztpraxis-Logo-Gehlmann-Menke-r5d2007at4cuyqc4ne1zegnw0rteybiynd4s6ifklc.png → hausarztpraxis.png

---

### 2. USP-Features → **NEUE Komponente**

**Neue Datei:** `src/layouts/components/home/UspFeatures.astro`

```astro
---
const { usps } = Astro.props;
---

<section class="section">
  <div class="container">
    <div class="row gy-4">
      {usps.map((usp) => (
        <div class="md:col-6 lg:col-3">
          <div class="text-center">
            <span class="text-5xl mb-4 block">{usp.icon}</span>
            <h3 class="h5">{usp.title}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**YAML:**

```yaml
usps:
  - icon: "🇩🇪"
    title: "Hergestellt in Deutschland"
  - icon: "💬"
    title: "Kostenloser Support"
  - icon: "🔒"
    title: "Lokale Datenspeicherung"
  - icon: "🏠"
    title: "Home Office-fähig"
  - icon: "💳"
    title: "Einmalige Kosten"
  - icon: "📡"
    title: "Netzwerk-/WLAN-fähig"
  - icon: "💰"
    title: "Ratenzahlung"
```

---

### 3. Benefits-Sektion → `Benefits.astro`

```yaml
benefits:
  title: "Ihre Vorteile unserer digitalen Mitarbeiter Zeiterfassungssysteme"
  subtitle: "Maximale Datensicherheit und Unabhängigkeit"
  points:
    - title: "Höchste Datensicherheit"
      content: "Mit unserer digitalen Zeiterfassung behalten Sie die volle Kontrolle über Ihre Daten. Ihre Informationen werden nicht in der Cloud gespeichert, sondern sicher in Ihren Händen verwaltet."
      image: "/images/placeholder.jpg"

    - title: "Anschaffung ohne Risiko"
      content: "Testen Sie unsere digitale Zeiterfassungssysteme für Mitarbeiter 14 Tage lang kostenlos und unverbindlich. Somit können Sie festzustellen, ob es Ihren Anforderungen gerecht wird."
      image: "/images/placeholder.jpg"

    - title: "Kostenloser Support"
      content: "Wir begleiten Sie mit einem Jahr kostenfreiem Support, um eine reibungslose Implementierung unserer Zeiterfassungssysteme und hohe funktionale Zuverlässigkeit sicherzustellen."
      image: "/images/placeholder.jpg"

    - title: "Extrem schnelle Amortisation"
      content: "Geringe Anschaffungskosten ohne laufende Abonnementgebühren – damit amortisiert sich unsere Zeiterfassungssysteme durch Zeitersparnisse in der Personalverwaltung bereits nach nur 4 Monaten!"
      image: "/images/placeholder.jpg"

    - title: "Einfache Integration"
      content: "Sie haben die Möglichkeit, unsere digitalen Mitarbeiter Zeiterfassungssysteme nahtlos in bestehende Geschäftsprozesse und -software zu integrieren. Die Hardware ist kompakt und leicht zu montieren."
      image: "/images/placeholder.jpg"

    - title: "Mobile Zeiterfassung"
      content: "Egal ob auf der Baustelle, auf dem Weg zu einem Kunden oder im Home Office: unser Zeiterfassungssystem kann unkompliziert über all und jederzeit mobil eingesetzt werden."
      image: "/images/placeholder.jpg"

    - title: "Skalierbare Zeiterfassung"
      content: "Unser digitales Arbeitszeiterfassungssystem für Mitarbeiter kann unbegrenzt erweitert werden, ohne dabei neue Implementierungen oder Datentransfers zu benötigen."
      image: "/images/placeholder.jpg"

    - title: "Gesteigerte Mitarbeiterzufriedenheit"
      content: "Unser transparentes Zeiterfassungssystem bietet Ihnen und Ihren Mitarbeitern ein faires System, welches die Eigenverantwortung der Mitarbeiter fördert und ihre Motivation steigert."
      image: "/images/placeholder.jpg"

    - title: "Kompatibel mit Lohnbuchsoftware"
      content: "Alle Daten der Arbeitszeiterfassung lassen sich problemlos in andere Software für Lohnbuchhaltung und Steuern wie z.B. Datev exportieren."
      image: "/images/placeholder.jpg"
```

---

### 4. Features-Sektion → `Features.astro`

```yaml
feature:
  title: "Digitale Zeiterfassungssysteme für Ihren Bedarf"
  subtitle: "Wählen Sie die passende Technologie"
  features:
    - title: "Zeiterfassung mit Chip"
      badge: "Flexibel"
      content: "Schnelle und unkomplizierte Datenerfassung durch einfaches Scannen"
      description: "Unser Zeiterfassungssystem mit Chip Technologie ermöglicht eine schnelle und unkomplizierte Datenerfassung durch einfaches Scannen. Unsere Geräte samt Chips sind äußerst flexibel und können in unterschiedlichen Arbeitsumgebungen eingesetzt werden. Durch die unkomplizierte Integration und Skalierbarkeit sind unsere Systeme besonders anpassungsfähig."
      image: "/images/home/chip-system.png"
      button:
        enable: true
        label: "Mehr erfahren"
        link: "/zeiterfassungssystem-mit-chip/"

    - title: "Zeiterfassung mit Fingerabdruck"
      badge: "Sicher"
      content: "Biometrische Identifikation ohne physische Chips"
      description: "Unser Zeiterfassungssystem mit Fingerabdruck bietet Ihnen Sicherheit und Zuverlässigkeit durch eine biometrische Identifikation. Sie eliminiert den Bedarf nach physischen Chips, welche verloren gehen können. Gleichzeitig gewährleistet die Zeiterfassung anhand des Fingerabdrucks zusätzliche Sicherheit durch die Registrierung von zwei Fingerabdrücken."
      image: "/images/home/fingerprint-system.png"
      button:
        enable: true
        label: "Mehr erfahren"
        link: "/zeiterfassungssystem-mit-fingerabdruck/"

    - title: "Integration mehrerer Terminals"
      badge: "Skalierbar"
      content: "Zentrale Datenerfassung von mehreren Terminals"
      description: "Für Unternehmen mit mehreren Standorten oder Gebäuden sind möglicherweise mehrere Zeiterfassungsterminals erforderlich. Unser digitales Zeiterfassungssystem ermöglicht eine zentrale Datenerfassung von mehreren Terminals ohne zusätzlichen Aufwand. Gleichzeitig bietet es die Flexibilität, auch eine individuelle Datenerfassung pro Terminal durchzuführen. Zusätzlich verfügt unser Zeiterfassungssystem über eine intelligente Erkennung von Standorten/Geräten, an denen sich Mitarbeiter an- oder abmelden."
      image: "/images/home/multi-terminal.png"
      button:
        enable: true
        label: "Mehr erfahren"
        link: "/systeme/"
```

**Bilder zu migrieren:**
- 2.geaendert-removebg-preview.png → chip-system.png
- 1.geaendert__1_-removebg-preview.png → fingerprint-system.png
- Zeiterfassungsgeraete-4-bundle.geaendert-removebg-preview.png → multi-terminal.png

---

### 5. Offering-Sektion → `Offering.astro`

```yaml
offering:
  - title: "Transparenz in allen Personalbelangen"
    subtitle: "Fehlerfreie Erfassung erbrachter Arbeitsleistungen"
    image: "/images/placeholder.jpg"
    image_1: "/images/placeholder.jpg"
    content: "Mitarbeiter Zeiterfassung sorgt für ein hohes Maß an Transparenz in allen wesentlichen Personalbelangen. Durch das fehlerfreie Erfassen erbrachter Arbeitsleistungen sorgt es für Klarheit in allen Arbeitszeit-Themen – sei es Entgelt, Urlaub, Überstunden, Fehlstunden, Krankheit, Weiterbildung u.ä. Und ganz nebenbei sorgt es so auch für eine vertrauensvollere Arbeitsatmosphäre."
    points:
      - "Fehlerfreie Erfassung von Arbeitszeiten"
      - "Transparenz bei Urlaub, Überstunden und Fehlzeiten"

  - title: "Zeit und Geld sparen"
    subtitle: "Effiziente Administration"
    image: "/images/placeholder.jpg"
    image_1: "/images/placeholder.jpg"
    content: "Eine digitale Zeiterfassung spart Zeit und damit Geld in der Administration der Arbeits- und Personalprozesse. Zudem bietet sie – da nicht zu manipulieren – ein hohes Maß an Sicherheit. Die umständliche und zeitaufwendige sowie leider oft fehleranfällige Erfassung per Hand bzw. Excel entfällt."
    points:
      - "Zeitersparnis in der Personaladministration"
      - "Keine fehleranfällige Excel-Erfassung mehr"

  - title: "Motivation und Eigenverantwortung"
    subtitle: "Fairere Bewertung der Produktiv-Zeiten"
    image: "/images/placeholder.jpg"
    image_1: "/images/placeholder.jpg"
    content: "Eine leistungsfähige Mitarbeiter Zeiterfassung bedeutet oft auch einen Motivationsschub in der Mitarbeiterschaft. Denn sie ermöglicht eine fairere Bewertung der Produktiv-Zeiten im Unternehmen – beispielsweise über die Erfassung von Raucherpausen. Ein digitales Zeiterfassungssystem stärkt darüber hinaus auch die Eigenverantwortung und damit das Maß an Effizienz in der Arbeit."
    points:
      - "Erhöhte Mitarbeitermotivation"
      - "Stärkung der Eigenverantwortung"
```

---

### 6. Testimonials → `sections/home-testimonials.md`

**Neue Datei:** `src/content/sections/home-testimonials.md`

```yaml
---
enable: true
title: "Das sagen Kunden über unsere digitale Mitarbeiter Zeiterfassung"
subtitle: ""
testimonials:
  - name: "M.G."
    designation: ""
    avatar: "/images/testimonials/google-icon.webp"
    content: "Die Installation ist einfach. Das Standalone Zeiterfassungsgerät mit Chips funktioniert problemlos und bei Fragen ist der Support hilfsbereit. Das Preis-Leistungsverhältnis ohne monatliches Abo ist absolut fair. Bin sehr zufrieden und kann es weiterempfehlen."

  - name: "Hannes Küspert"
    designation: ""
    avatar: "/images/testimonials/google-icon.webp"
    content: "Sehr gutes System für kleine und mittlere Unternehmen. Nicht zu viel und nicht zu wenig Funktionen, absolut unkompliziert, ohne laufende Kosten und Gebühren. Bei anfänglichen Problemen hilft der Telefonsupport."

  - name: "Jürgen Beinio"
    designation: ""
    avatar: "/images/testimonials/google-icon.webp"
    content: "Eine sehr einfache und effiziente Lösung. Die Personaldaten sind sofort erkennbar."

  - name: "Info Schmidt-Neustadt"
    designation: ""
    avatar: "/images/testimonials/google-icon.webp"
    content: "Das Zeiterfassungssystem ist absolut zu empfehlen. Einfache Handhabung, leichte Bedienung der Systemoberfläche. Sehr positiv zu erwähnen ist die tel. Unterstützung bei der Einrichtung und Fragen die sich bei der Inbetriebnahme ergeben. Keine ewigen Warteschleifen, sondern wenn es mal etwas länger dauert bekommt man einen Rückruf. Und das Beste ist, einmal gekauft und keine weiteren Abo Gebühren! Top!"

  - name: "Alex"
    designation: ""
    avatar: "/images/testimonials/google-icon.webp"
    content: "Wir nutzen das System schon seit vielen Jahren und sind super zufrieden damit. Der Service nach dem Kauf ist perfekt, es wird immer geholfen. Vielen Dank dafür und weiter so."

  - name: "A.M."
    designation: ""
    avatar: "/images/testimonials/google-icon.webp"
    content: "Nach langer Suche habe ich endlich ein System gefunden, welches meinen Ansprüchen in alle Belangen entspricht. Es ist einfach zu bedienen und zu administrieren. Ich setzte es in der Arztpraxis meiner Frau ein."
---
```

**Bild zu migrieren:**
- Google_Icons-09-512.webp → google-icon.webp

---

## Bilder-Migrations-Script

**Datei:** `scripts/migrate-wp-images.sh`

```bash
#!/bin/bash

SOURCE="/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/wordpress-export/pages/images"
DEST="/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/syncmaster-astro/themes/syncmaster-astro/public/images"

# Erstelle Ziel-Ordner
mkdir -p "$DEST/logos"
mkdir -p "$DEST/home"
mkdir -p "$DEST/testimonials"

echo "📦 Migriere WordPress-Bilder..."

# Logos
cp "$SOURCE/Coffee-Fellows-Logo-3-r5d43b1ubbft24ygxxu15gl980nzleguc2l48is64g.png" "$DEST/logos/coffee-fellows.png"
cp "$SOURCE/logo-graeff-2-r5d0qu2idqit1by6ev5ekv0gc6gf1y7brsirxtenls.png" "$DEST/logos/graeff.png"
cp "$SOURCE/Johannes-Bopp-Gmbh-Logo_09-21-schwarz-150x150.png" "$DEST/logos/johannes-bopp.png"
cp "$SOURCE/logo_rss-bochum-r5d0qt4o6whippzjkcqs0d8zqsl1u93lfnvagjg1s0.png" "$DEST/logos/rss-bochum.png"
cp "$SOURCE/hirshline-1-r5d49kn3vk0mgjuscnchrvnvshs2wrcf735nexhon4.png" "$DEST/logos/hirshline.png"
cp "$SOURCE/hald-r5d0qr8zt8ey2i29vbxivdq2k0ubeuw4rekbhziu4g.png" "$DEST/logos/hald.png"
cp "$SOURCE/Le-Postillion-Logo-r5d3ddo3sty2tcm9c8dhvi4jcegi9yjdrqryor83r4.png" "$DEST/logos/le-postillion.png"
cp "$SOURCE/Hausarztpraxis-Logo-Gehlmann-Menke-r5d2007at4cuyqc4ne1zegnw0rteybiynd4s6ifklc.png" "$DEST/logos/hausarztpraxis.png"

# Produkt-Bilder
cp "$SOURCE/2.geaendert-removebg-preview.png" "$DEST/home/chip-system.png"
cp "$SOURCE/1.geaendert__1_-removebg-preview.png" "$DEST/home/fingerprint-system.png"
cp "$SOURCE/Zeiterfassungsgeraete-4-bundle.geaendert-removebg-preview.png" "$DEST/home/multi-terminal.png"

# Sonstige Bilder
cp "$SOURCE/Gesetzesanderungen.geaendert.jpg" "$DEST/home/gesetz.jpg"
cp "$SOURCE/Optimized-ant.jpg" "$DEST/home/team.jpg"
cp "$SOURCE/Google_Icons-09-512.webp" "$DEST/testimonials/google-icon.webp"

echo "✅ Alle Bilder kopiert!"
echo ""
echo "📍 Bilder verfügbar unter:"
echo "   - $DEST/logos/ (8 Logos)"
echo "   - $DEST/home/ (5 Bilder)"
echo "   - $DEST/testimonials/ (1 Icon)"
```

---

## Vollständige Content-Zuordnung

### Content-Audit-Tabelle

| WP Zeilen | Content | Astro Ziel | Status |
|-----------|---------|------------|--------|
| 6-13 | Hero-Text + CTAs + Video | `hero:` | ⏳ |
| 15-17 | "Jetzt 100% Support" CTA | Separate CTA-Section | ⏳ |
| 19-21 | "Mehr als 2000 Unternehmen" + 8 Logos | `hero.customer:` | ⏳ |
| 23-48 | 7 USP-Features | `usps:` (neue Section) | ⏳ |
| 50-71 | 5 Warum-Argumente | `offering:` | ⏳ |
| 72-79 | ❌ DUPLIKAT von 52-66 | Weglassen | ✅ |
| 80 | CTA: Video + Referenzen | Separate CTA-Section | ⏳ |
| 82-88 | Testimonial-Intro + Video | Testimonial-Section Header | ⏳ |
| 89-157 | 6 Google Reviews | `testimonials:` | ⏳ |
| 159-163 | Fragebogen + YouTube | CTA + YouTube Shortcode | ⏳ |
| 165-191 | 6 Vorteile (detailliert) | `benefits:` [0-5] | ⏳ |
| 193-206 | 3 weitere Vorteile | `benefits:` [6-8] | ⏳ |
| 208-214 | Multi-Terminal-Text | `features[2].description` | ⏳ |
| 216-224 | Chip-System-Text | `features[0].description` | ⏳ |
| 225 | Chip-System-Bild + CTA | `features[0].image` + `button` | ⏳ |
| 227-232 | Fingerabdruck-Text + Bild + CTA | `features[1]` | ⏳ |
| 234-244 | Gesetzeskonform-Text + Bild | Neue Section (Grid) | ⏳ |
| 246-278 | FAQ (12 Fragen) | Accordion / FAQ Collection | ⏳ |
| 279-306 | ❌ DUPLIKAT FAQ | Weglassen | ✅ |
| 308 | FAQ-CTA-Links | CTA-Buttons | ⏳ |
| 310-314 | Über-Uns-Text + Bild | Neue Section (Grid) | ⏳ |

**Legende:**
- ✅ = Abgeschlossen
- ⏳ = Noch zu migrieren
- ❌ = Duplikat, wird übersprungen

---

## Implementierungs-Plan

### Phase 1: Vorbereitung
1. ✅ Spec-File erstellt
2. ⏳ Bilder-Migrations-Script ausführen
3. ⏳ Neue Komponenten erstellen (UspFeatures.astro)

### Phase 2: Basis-Content (bestehende Komponenten)
4. ⏳ Hero-Sektion befüllen
5. ⏳ Benefits-Sektion (9 Vorteile)
6. ⏳ Features-Sektion (3 Produkte)
7. ⏳ Offering-Sektion (3 Argumente)

### Phase 3: Zusätzliche Sektionen
8. ⏳ USP-Features (7 Icons)
9. ⏳ Testimonials (6 Reviews)
10. ⏳ CTA-Sektionen
11. ⏳ Gesetzeskonform-Sektion
12. ⏳ Über-Uns-Sektion

### Phase 4: FAQ & Finale
13. ⏳ FAQ-Sektion (Accordion)
14. ⏳ Finale Content-Validierung
15. ⏳ Bilder-Pfade verifizieren
16. ⏳ Tests auf `/new-home`

---

## Design-System-Regeln

### ✅ ERLAUBT:
- Bestehende Komponenten aus `/components/home/`
- Emoji/Unicode für Icons (🇩🇪 💬 🔒 etc.)
- Tailwind CSS Utility-Classes
- Design-Tokens aus `theme.json`
- Placeholder-Bilder aus `/public/images/placeholder.jpg`

### ❌ VERBOTEN:
- Neue React-Komponenten
- Icon-Libraries (astro-icon, react-icons)
- Externe Placeholder-Services
- Custom-CSS außerhalb Tailwind
- Pixel-Perfect-Kopie des WP-Designs

---

## Qualitätssicherung

### Finale Checks vor Abnahme:

- [ ] Alle 315 Zeilen aus `home.md` durchgegangen
- [ ] Alle einzigartigen Texte sind in Astro vorhanden
- [ ] Keine Text-Passagen verloren gegangen
- [ ] Alle 14 Bilder migriert und funktional
- [ ] Alle Links funktionieren
- [ ] Design ist konsistent mit SyncMaster-Theme
- [ ] Responsiveness auf Mobile/Tablet geprüft
- [ ] Performance: Lighthouse Score >90
- [ ] SEO: Meta-Description gesetzt

---

## Deliverables

1. ✅ Spec-File (`specs/wordpress-home-migration.md`)
2. ⏳ Migriertes Content (`src/content/homepage/new-home.md`)
3. ⏳ Neue Komponente (`src/layouts/components/home/UspFeatures.astro`)
4. ⏳ Testimonials (`src/content/sections/home-testimonials.md`)
5. ⏳ Migrierte Bilder (`public/images/*`)
6. ⏳ Bilder-Migrations-Script (`scripts/migrate-wp-images.sh`)
7. ⏳ Funktionierende `/new-home` Seite

---

**Status:** 📝 Spec erstellt, bereit zur Implementierung
**Nächster Schritt:** Bilder migrieren → `bash scripts/migrate-wp-images.sh`