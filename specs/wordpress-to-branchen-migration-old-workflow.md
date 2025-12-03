# Migration Specification: WordPress Posts → Branchen-Einträge

**Version**: 1.0
**Datum**: 2025-01-29
**Autor**: Migration Spec für ZFDM SyncMaster Astro

---

## Template-Struktur `/branchen/[single].astro`

### Sektionen-Übersicht (in Reihenfolge)

#### 1. **Hero Section** (Zeilen 52-113)
- **Layout**: Blog-Style, zentriert mit GridBg-Hintergrund
- **Inhalt**:
  - H1-Titel (aus `title` frontmatter) - zentriert, große Schrift (`text-[2rem] md:text-[2.5rem] lg:text-[4rem]`)
  - **KEIN** Description-Text im Hero (nur im Meta-Tag)
  - **KEINE** CTA-Buttons im Hero
  - Hero-Bild (aus `image` frontmatter):
    - Zentriert, 10 Spalten breit (`lg:col-10`)
    - Rounded-3xl Ecken
    - Full-width, object-cover
  - Bild-Overlay (unterer Bereich, `absolute bottom-0`):
    - Backdrop-blur Hintergrund (`bg-text-dark/40`)
    - Links: Kategorie + erste 2 Stats als Preview
    - Rechts: Share-Buttons ("Teilen")
- **Animation**: AOS fade-up + zoom-in
- **Responsive**: Full-width auf allen Breakpoints, Overlay stapelt vertikal auf Mobile

#### 2. **Content Section** (Zeilen 116-126)
- **Layout**: Zentrierte Spalte, 80% Breite auf Large Screens
- **Styling**:
  - **Klasse**: `content` (identisch mit Blog-Posts)
  - **Breite**: `lg:col-10` (zentriert, bessere Lesbarkeit)
  - **Container**: `justify-center` Row
  - **Element**: `<article>` (semantisches HTML)
  - **Animation**: AOS fade-up
- **Inhalt**: Gerenderte Markdown-Content aus `.md` File
- **Referenz**: Identisches Styling wie `/ressourcen/blog/[single].astro` (PostSingle.astro:74)

**Code-Beispiel**:
```astro
<section class="section pt-0">
  <div class="container">
    <div class="row justify-center">
      <article class="lg:col-10">
        <div class="content" data-aos="fade-up-sm">
          <Content />
        </div>
      </article>
    </div>
  </div>
</section>
```

#### 3. **Testimonial Section** (Zeilen 128-164) - OPTIONAL
- **Bedingung**: Nur wenn `testimonial` Object vorhanden
- **Layout**: Zentriert, max-width 10 Spalten
- **Inhalt**:
  - Großes Anführungszeichen (Deko, `text-6xl`, opacity 30%)
  - Quote (italic, `text-xl lg:text-2xl`, medium weight)
  - Author Name (semibold)
  - Company Name (klein, text-dark)
  - Profile Icon (runder Container, 12x12)
- **Styling**: Gradient-Hintergrund (`from-secondary/10 to-primary/10`)

#### 4. **"Warum ZFDM" Features Section** (Zeilen 166-212)
- **Layout**: 3-spaltiges Grid
- **Inhalt**: HARDCODED, nicht aus Frontmatter
  - Feature 1: DSGVO-konform (Check-Icon)
  - Feature 2: Branchenspezifisch (Bullseye-Icon)
  - Feature 3: Persönlicher Support (Help-Icon)
- **Styling**: Hellblauer Hintergrund (`bg-primary/5`)

#### 5. **Related Industries Section** (Zeilen 214-301) - OPTIONAL
- **Bedingung**: Nur wenn andere Branchen vorhanden
- **Layout**: 3-spaltiges Grid (responsive: 1/2/3 Spalten)
- **Logik**:
  - Bevorzugt 2 Branchen aus gleicher `category`
  - Füllt auf 3 mit anderen Kategorien auf
- **Card-Inhalt**:
  - Bild (16:10 Aspect Ratio, rounded-top)
  - Titel (h5)
  - Beschreibung (text-sm, flex-grow)
  - Erste 2 Stats als Preview Grid
  - Dashed Separator
  - "Mehr erfahren" Link mit Arrow-Icon
- **Hover**: Shadow-Transition

#### 6. **Call to Action Section** (Zeile 303)
- **Component**: `<CallToAction />`
- **Inhalt**: Globale CTA-Komponente aus Partials
- **Position**: Immer als letzter Abschnitt

---

## Frontmatter Schema (Zod Validation)

```typescript
{
  title: string;              // REQUIRED - Haupt-Überschrift
  meta_title?: string;        // Optional - SEO-Titel (falls abweichend)
  description?: string;       // ⚠️ Nur für Meta Description, NICHT im Hero angezeigt
  image?: string;             // Hero-Bild, Pfad: /images/branchen/xxx.jpg
  category: "groesse" | "taetigkeit";  // REQUIRED - Kategorisierung
  keywords?: string[];        // SEO Keywords Array
  stats?: {                   // Optional - für Hero-Overlay + Related Cards
    label: string;            // Beschreibung (z.B. "Bereitschaftsdienste")
    value: string;            // Wert (z.B. "Automatisch", "✓", "24/7")
  }[];                        // ⚠️ Erste 2 Stats erscheinen im Hero-Bild-Overlay
  testimonial?: {             // Optional - für Testimonial Section
    author: string;           // Name (z.B. "Dr. med. Müller")
    company: string;          // Firma/Praxis (z.B. "Hausarztpraxis München")
    quote: string;            // Zitat-Text
  };
  draft?: boolean;            // Default: false
}
```

### Kategorie-Werte
- **`groesse`**: Nach Unternehmensgröße (z.B. Kleinbetriebe, Mittelstand)
- **`taetigkeit`**: Nach Tätigkeit/Branche (z.B. Arztpraxen, Gastronomie)

Diese Kategorisierung bestimmt die Darstellung auf `/branchen` (Overview-Page).

---

## WordPress zu Branchen: Mapping-Regeln

### Content-Transformation Matrix

| WordPress Element | Branchen Mapping | Aktion | Priorität |
|------------------|------------------|---------|-----------|
| `title` (frontmatter) | `title` | Direkt übernehmen | HOCH |
| `date` | - | **Entfernen** (nicht benötigt) | HOCH |
| `description` (frontmatter) | `description` | **Nur für SEO**, NICHT im Hero angezeigt | HOCH |
| `categories` | - | **Entfernen** (wird durch `category` ersetzt) | HOCH |
| `tags` | `keywords` | In Array umwandeln | MITTEL |
| Testimonials im Content | `testimonial` (frontmatter) | **Extrahieren** und ins Frontmatter | HOCH |
| CTA-Bilder im Content | - | **Entfernen** (nicht mehr benötigt) | HOCH |
| H1 im Content | - | **Entfernen** (wird aus `title` generiert) | HOCH |
| H2 "## Quote" Header | `testimonial.quote` | Ins Frontmatter extrahieren | MITTEL |
| Bildpfade `images/xxx.png` | `/images/branchen/xxx.png` | **Absoluten Pfad** setzen | HOCH |
| WordPress-Links | Astro-Routes | Z.B. `/contact/` → `/kontakt` | HOCH |
| Listen-Features | Stats Array | Erste 2 erscheinen im Hero-Overlay | MITTEL |
| Blockquotes | Behalten | Als Markdown-Element im Content | NIEDRIG |

---

## Migration-Workflow

### Phase 1: Analyse
**Ziel**: WordPress-Content verstehen und strukturieren

1. WordPress `.md` File öffnen
2. Frontmatter parsen und validieren
3. Content-Struktur analysieren:
   - Testimonials identifizieren (Quotes mit Autor + Firma)
   - Listen/Features identifizieren (Stats-Kandidaten)
   - Alle Bilder und deren Pfade extrahieren
   - Alle Links (intern/extern) identifizieren
   - H1/H2/H3-Struktur prüfen
   - CTA-Bildblöcke lokalisieren

**Tools**: Manuell oder Script für Bulk-Migration

### Phase 2: Frontmatter-Transformation

**WordPress Frontmatter** (Beispiel):
```yaml
---
title: "Digitale Zeiterfassung für die Arztpraxis"
date: 2025-05-31
categories:
  - "referenzen"
tags:
  - "digitale-zeiterfassung"
  - "kundenrezension"
  - "zeiterfassungssystem"
---
```

**Branchen Frontmatter** (Ziel):
```yaml
---
title: "Digitale Zeiterfassung für die Arztpraxis"
meta_title: "Zeiterfassung Arztpraxen | Speziell für Mediziner | ZFDM"
description: "Zeiterfassung speziell für Arztpraxen: Schichtplanung, Bereitschaftsdienste, DSGVO-konform. Einfach und rechtssicher."
# ⚠️ Description wird NUR für SEO Meta-Tags verwendet, NICHT im Hero angezeigt
image: "/images/branchen/arztpraxen.jpg"
category: "taetigkeit"
keywords:
  - "digitale-zeiterfassung"
  - "zeiterfassungssystem"
  - "Zeiterfassung Arztpraxen"
  - "medizinisches Personal"
stats:
  # ⚠️ Erste 2 Stats erscheinen im Hero-Bild-Overlay (unter Kategorie)
  - label: "Bereitschaftsdienste"
    value: "Automatisch"
  - label: "DSGVO-konform"
    value: "✓"
  - label: "KV-Abrechnung"
    value: "Kompatibel"
testimonial:
  author: "Dr. med. Meesters"
  company: "Internisten Vilsbiburg"
  quote: "Einfach zu installieren, flexibel – das Zeiterfassungssystem hat uns viel Arbeit abgenommen."
draft: false
---
```

**Transformations-Schritte**:
1. `title` → direkt übernehmen
2. `date` → entfernen
3. `categories` → entfernen
4. `tags` → in `keywords` Array konvertieren
5. **Manuell hinzufügen**:
   - `meta_title` (SEO-optimiert)
   - `description` (max 160 Zeichen)
   - `image` (Pfad zum Hero-Bild)
   - `category` ("groesse" oder "taetigkeit")
6. `stats` → aus Content oder manuell erstellen
7. `testimonial` → aus Content extrahieren

### Phase 3: Content-Bereinigung

#### ⚠️ WICHTIG: Null-Datenverlust-Prinzip

**KEIN TEXT DARF VERLOREN GEHEN!**

Diese Regel hat absolute Priorität über alle anderen Transformationsregeln.

**Bei Unsicherheit, wohin Content gehört:**
- ✅ Im Zweifel IMMER in Section 3 (Content Section) als Fließtext einfügen
- ✅ Testimonials: Hauptzitat → Frontmatter, ALLE anderen als Blockquotes im Content behalten
- ✅ Alle Absätze, Listen, Features, Zitate behalten
- ✅ Narrative Passagen, emotionale Argumentation, Details behalten
- ✅ Nur echte Duplikate entfernen (z.B. H1 wenn identisch mit `title`)

**Beispiel Multiple Testimonials:**
```markdown
## Das sagen unsere Kunden

> „Uns wurde eine Zeiterfassungslösung quasi auf den Leib geschneidert!"
>
> – Dr. Ganzera, Augenarzt Kulmbach

> „Das System ist einfach und übersichtlich gehalten."
>
> – Dr. med. Gehlmann-Menke, Hausarzt

> „Das Zeiterfassungssystem hat sich schnell als wertvolles Tool etabliert."
>
> – Dr. Hassan Nadjar, Zahnarzt Fürth
```

#### Entfernen:

**1. H1-Duplikate**
```markdown
# Digitale Zeiterfassung für die Arztpraxis  ← ENTFERNEN
```
→ Wird automatisch aus `title` generiert

**2. Hero-Description-Text**
```markdown
Professionelle Zeiterfassung speziell für...  ← NICHT im Hero anzeigen
```
→ `description` wird NUR für SEO Meta-Tags verwendet, NICHT im Hero-Bereich gerendert
→ Im neuen Blog-Style Hero erscheint nur der Titel, das Bild und das Bild-Overlay

**3. CTA-Bildblöcke**
```markdown
[![Zeiterfassungssystem mit Chip](images/CTA-1.png)](/contact/)  ← ENTFERNEN
```
→ CallToAction-Section übernimmt

**3. Testimonial-Hauptzitat für Frontmatter** (NUR das prominenteste!)
```markdown
„Das System hat uns viel Arbeit abgenommen."  ← EXTRAHIEREN für Frontmatter

Dr. med. Meesters
Internisten Vilsbiburg
```
→ **WICHTIG**: ALLE anderen Testimonials bleiben als Blockquotes im Content!

**4. Quote-Header des Frontmatter-Testimonials**
```markdown
## "Einfach zu installieren..."  ← NUR ENTFERNEN wenn dieses Quote ins Frontmatter geht
```
→ Andere Quote-Header bleiben als H2-Überschriften

#### Anpassen:

**1. Bildpfade**
```markdown
# Vorher (WordPress)
![Screenshot](images/screenshot.jpg)

# Nachher (Branchen)
![Screenshot](/images/branchen/screenshot.jpg)
```

**2. Links**
```markdown
# Vorher (WordPress)
[Kontakt](https://www.zeiterfassung-fdm.de/.../contact.php)
[Kundenrezension](https://www.zeiterfassung-fdm.de/kundenrezension-.../?lang=de)

# Nachher (Branchen)
[Kontakt](/kontakt)
[Weitere Referenzen](/referenzen)
```

**3. WordPress-spezifische URLs**
- Entferne Query-Parameter (`?lang=de`)
- Kürze auf interne Routen
- Externe Links bleiben

#### Behalten:

- ✅ Alle H2/H3-Überschriften (außer Testimonial-Quotes)
- ✅ Listen und Aufzählungen
- ✅ Textabsätze und Fließtext
- ✅ Feature-Beschreibungen
- ✅ Blockquotes (wenn keine Testimonials)
- ✅ Tabellen (falls vorhanden)

### Phase 4: Stats-Extraktion

**Ziel**: Content-Features in strukturierte Stats umwandeln

#### ⚠️ Hero-Overlay Design-Anforderungen

**Nur die ersten 2 Stats erscheinen im Hero-Bild-Overlay!**

- Die ersten 2 Stats werden im unteren Bildbereich über dem Hero-Bild angezeigt
- Sie sollten **kurz und prägnant** sein (max. 15 Zeichen pro Label/Value)
- **Design-Empfehlungen für erste 2 Stats**:
  - Kurze Labels: z.B. "Mitarbeiter", "Setup-Zeit", "Standorte"
  - Kompakte Values: z.B. "1-10", "< 1 Stunde", "Unbegrenzt"
  - Vermeide lange Texte (werden im Overlay schlecht lesbar)
- Alle weiteren Stats (ab Position 3) erscheinen nur in Related Cards
- Stats sind optional - ohne Stats wird nur die Kategorie im Overlay angezeigt

#### Beispiel 1: Liste mit Features

**WordPress-Content**:
```markdown
- **Mehr Transparenz:** Jeder Mitarbeitende hat Einsicht
- **Weniger Aufwand:** Keine manuelle Auswertung mehr
- **Bessere Planung:** Integrierte Urlaubsplanung
- **Gerechte Verteilung:** Überstunden korrekt erfasst
```

**Branchen Stats** (Option A - Checkmarks):
```yaml
stats:
  - label: "Transparenz"
    value: "✓"
  - label: "Zeitersparnis"
    value: "✓"
  - label: "Urlaubsplanung"
    value: "✓"
  - label: "Überstunden"
    value: "✓"
```

**Branchen Stats** (Option B - Werte):
```yaml
stats:
  - label: "Transparenz"
    value: "Komplett"
  - label: "Zeitersparnis"
    value: "Automatisch"
  - label: "Urlaubsplanung"
    value: "Integriert"
  - label: "Überstunden"
    value: "Gerecht"
```

#### Beispiel 2: Funktionen-Liste

**WordPress-Content**:
```markdown
**Die wichtigsten Funktionen im Überblick:**

- Kommen/Gehen/Pausen-Erfassung via Terminal, PC oder App
- Teilzeit-, Gleitzeit- und Schichtmodelle flexibel einrichtbar
- Automatische Berechnung von Überstunden und Pausen
- Digitale Urlaubs- und Fehlzeitenverwaltung
- DSGVO-konform mit Rollen- und Zugriffsrechten
```

**Branchen Stats**:
```yaml
stats:
  - label: "Erfassung"
    value: "Multi-Device"
  - label: "Zeitmodelle"
    value: "Flexibel"
  - label: "Überstunden"
    value: "Automatisch"
  - label: "DSGVO"
    value: "✓"
```

#### Stats-Design-Empfehlungen:
- **Anzahl**: Optimal 3-4 Stats (Grid passt perfekt)
- **Value-Typen**:
  - Checkmark: `"✓"` (für Ja/Nein-Features)
  - Status: `"Automatisch"`, `"Integriert"`, `"Inklusiv"`
  - Beschreibend: `"24/7"`, `"Multi-Device"`, `"Unbegrenzt"`
- **Label**: Kurz und prägnant (1-2 Worte)

### Phase 5: Testimonial-Extraktion

#### Pattern-Erkennung

**Typisches WordPress-Format**:
```markdown
„Uns wurde eine Zeiterfassungslösung quasi auf den Leib geschneidert! Die Einrichtung war schnell und wurde gut begleitet..."

Dr. Ganzera

Augenarzt Kulmbach
```

**Extraktions-Regeln**:
- **Quote**: Text in „deutschen Anführungszeichen" oder "normalen Quotes"
- **Author**: Zeile mit "Dr." ODER Name (wenn nächste Zeile Job/Ort enthält)
- **Company**: Folgezeile nach Author (Beruf + Ort ODER Praxisname)

**Ergebnis**:
```yaml
testimonial:
  author: "Dr. Ganzera"
  company: "Augenarzt Kulmbach"
  quote: "Uns wurde eine Zeiterfassungslösung quasi auf den Leib geschneidert! Die Einrichtung war schnell und wurde gut begleitet."
```

#### Multiple Testimonials

Bei **mehreren Testimonials** im WordPress-Content:

**Strategie A**: Hauptzitat ins Frontmatter
```yaml
testimonial:
  author: "Dr. med. Meesters"
  company: "Internisten Vilsbiburg"
  quote: "Einfach zu installieren, flexibel – das System hat uns viel Arbeit abgenommen."
```

**Weitere Zitate** im Content als Blockquotes:
```markdown
> „Das System ist einfach und übersichtlich gehalten. Wir mussten keine zusätzliche Software installieren."
>
> – Dr. med. Gehlmann-Menke, Hausarzt

> „Das Zeiterfassungssystem hat sich schnell als wertvolles Tool etabliert."
>
> – Dr. Hassan Nadjar, Zahnarzt Fürth
```

**Strategie B**: Liste im eigenen Content-Abschnitt
```markdown
## Das sagen unsere Kunden

- **Dr. Ganzera, Augenarzt Kulmbach**: „Uns wurde eine Lösung auf den Leib geschneidert."
- **Dr. Gehlmann-Menke, Hausarzt**: „Einfach und übersichtlich."
- **Dr. Hassan Nadjar, Zahnarzt**: „Schnell als wertvolles Tool etabliert."
```

### Phase 6: Bild-Migration

#### Schritt 1: Bilder identifizieren

**Im WordPress-Content nach folgenden Patterns suchen**:
```markdown
![Alt-Text](images/bild.jpg)
[![Alt](images/cta.png)](/link/)
```

**Alle Bildpfade extrahieren**:
- `images/CTA-fur-Blogbeitrage-1-ZFDM-1024x289.png`
- `images/CTA-ZEITERFASSUNG-LEICHT-GEMACHT-1-1024x289.png`
- `images/screenshot-dashboard.jpg`

#### Schritt 2: Bilder kopieren

```bash
# Von WordPress-Export
/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/wordpress-export/Posts/images/

# Nach Public-Folder
/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/syncmaster-astro/themes/syncmaster-astro/public/images/branchen/
```

**Dateinamen**:
- Behalten: Original-Namen (für einfaches Matching)
- Oder umbenennen: `arztpraxen-hero.jpg`, `arztpraxen-feature1.jpg`

#### Schritt 3: Hero-Bild festlegen

**Optionen**:
1. Erstes Bild im Content → Hero
2. Spezifisches Bild auswählen
3. Neues Bild erstellen/designen

**⚠️ Hero-Bild Design-Anforderungen für Overlay**:
- **Unterer Bereich sollte "ruhig" sein** (für bessere Lesbarkeit des Overlays)
- Zentrierte Darstellung mit `rounded-3xl` Ecken
- Object-fit: cover (Bild füllt Container aus)
- Empfohlene Auflösung: Mind. 1200x800px
- Das Overlay erscheint im unteren 20% des Bildes mit:
  - Links: Kategorie-Badge + erste 2 Stats
  - Rechts: Share-Buttons
  - Backdrop-blur Hintergrund (`bg-text-dark/40`)
- Vermeide wichtige Bildelemente im unteren Bereich (werden durch Overlay verdeckt)

**Im Frontmatter**:
```yaml
image: "/images/branchen/arztpraxen.jpg"
```

#### Schritt 4: Content-Bildpfade aktualisieren

**Suchen & Ersetzen**:
```markdown
# Vorher
![Screenshot](images/dashboard.jpg)

# Nachher
![Screenshot](/images/branchen/dashboard.jpg)
```

**CTA-Bilder entfernen**:
```markdown
[![Text](images/CTA-xxx.png)](/contact/)  ← LÖSCHEN
```

### Phase 7: Validierung & Testing

#### Build-Time Validation

```bash
yarn check
```

**Prüft**:
- TypeScript-Typen korrekt
- Zod-Schema-Validierung (Frontmatter)
- Astro-Syntax-Fehler

**Häufige Fehler**:
- `category` fehlt oder falscher Wert
- `title` fehlt
- Bildpfade existieren nicht
- Frontmatter-Syntax-Fehler (YAML)

#### Runtime Testing

```bash
yarn dev
```

**Visuelle Checkliste** (`/branchen/arztpraxen`):

- [ ] **Hero Section** (Blog-Style)
  - [ ] GridBg Hintergrund ist sichtbar
  - [ ] Titel wird zentriert angezeigt (große Schrift)
  - [ ] **KEINE** Beschreibung im Hero (nur im Meta-Tag)
  - [ ] Hero-Bild lädt korrekt (zentriert, rounded-3xl)
  - [ ] **KEINE** CTA-Buttons im Hero
  - [ ] Bild-Overlay erscheint im unteren Bereich:
    - [ ] Kategorie-Badge (links)
    - [ ] Erste 2 Stats (links, unter Kategorie)
    - [ ] Share-Buttons (rechts)
    - [ ] Backdrop-blur Effekt funktioniert
  - [ ] Responsive auf Mobile (Overlay stapelt vertikal)

- [ ] **Content Section**
  - [ ] Content rendert korrekt
  - [ ] Keine H1-Duplikate
  - [ ] Bilder laden (absolute Pfade)
  - [ ] Links funktionieren
  - [ ] Styling ist identisch mit Blog (nur `content` Klasse)
  - [ ] Breite ist 80% auf Large Screens (`lg:col-10`)

- [ ] **Testimonial Section** (falls vorhanden)
  - [ ] Quote wird angezeigt
  - [ ] Author Name sichtbar
  - [ ] Company Name sichtbar
  - [ ] Styling korrekt (Gradient-BG)

- [ ] **"Warum ZFDM" Section**
  - [ ] 3 Features werden angezeigt
  - [ ] Icons sind sichtbar

- [ ] **Related Branchen Section**
  - [ ] 3 verwandte Branchen erscheinen
  - [ ] Bilder laden
  - [ ] Stats-Preview funktioniert
  - [ ] Links funktionieren

- [ ] **CallToAction Section**
  - [ ] CTA wird am Ende angezeigt

#### SEO Validation

**Meta-Tags prüfen** (Browser DevTools):
```html
<title>Zeiterfassung Arztpraxen | Speziell für Mediziner | ZFDM</title>
<meta name="description" content="Zeiterfassung speziell für Arztpraxen...">
<meta property="og:image" content="/images/branchen/arztpraxen.jpg">
```

**Lighthouse-Audit** (Optional):
- Performance
- SEO Score
- Best Practices

---

## Spezial-Regeln & Edge Cases

### 1. Leerer oder minimaler Content

**Problem**: WordPress-Post hat nur Testimonials, keine echte Content-Section

**Lösung**:
- Mindestens 2-3 Absätze Content hinzufügen
- Oder: Branchen-spezifische Intro-Texte generieren
- Template rendert auch mit wenig Content korrekt

### 2. Sehr lange Content-Texte

**Problem**: WordPress-Post hat 3000+ Wörter

**Lösung**:
- Content behalten (Blog-Style ist für lange Texte optimiert)
- Optional: In Tabs/Accordion-Komponenten umwandeln
- Inhaltsverzeichnis hinzufügen (manuell via Markdown)

### 3. WordPress-Shortcodes

**Problem**: WordPress verwendet Shortcodes wie `[button]`, `[gallery]`

**Lösung**:
- Manuell in Astro/MDX-Komponenten umwandeln
- Verfügbare Komponenten: `<Button>`, `<Accordion>`, `<Tabs>`, etc.
- Falls nötig: Neue Komponente aus existierenden zusammensetzen

### 4. Eingebettete Medien

**Problem**: YouTube-Videos, Tweets, etc.

**Lösung**:
- YouTube: `<Youtube id="VIDEO_ID" />`
- Videos: `<Video src="/videos/demo.mp4" />`
- Andere Embeds: HTML-Code direkt im Markdown

### 5. Tabellen

**Problem**: WordPress hat Tabellen im Content

**Lösung**:
- Markdown-Tabellen werden von `.content` Klasse gerendert
- Komplexe Tabellen: HTML-Code verwenden
- Responsive: Overflow-Wrapper falls nötig

### 6. Fehlende Bilder

**Problem**: Bildpfade im Content, aber Bilder fehlen

**Lösung**:
- Placeholder verwenden: `/images/placeholder.jpg`
- Oder: Bild aus Content entfernen
- NIEMALS externe Placeholder-Services

---

## Checkliste: Single Migration

### Pre-Migration
- [ ] WordPress `.md` File liegt vor
- [ ] Bilder-Ordner identifiziert
- [ ] Ziel-Kategorie festgelegt ("groesse" oder "taetigkeit")

### Content-Analyse
- [ ] Testimonials identifiziert
- [ ] Stats-Kandidaten gefunden
- [ ] Bilder extrahiert
- [ ] Links geprüft
- [ ] CTA-Blöcke lokalisiert

### Frontmatter
- [ ] `title` gesetzt
- [ ] `meta_title` erstellt (SEO-optimiert)
- [ ] `description` geschrieben (max 160 Zeichen)
- [ ] `category` festgelegt
- [ ] `image` Pfad gesetzt
- [ ] `keywords` Array gefüllt
- [ ] `stats` erstellt (optional)
- [ ] `testimonial` extrahiert (optional)
- [ ] `draft: false` gesetzt

### Content-Cleanup
- [ ] H1-Duplikate entfernt
- [ ] Testimonials aus Content extrahiert
- [ ] CTA-Bildblöcke gelöscht
- [ ] Bildpfade auf `/images/branchen/` angepasst
- [ ] Links aktualisiert (WordPress → Astro-Routes)
- [ ] Query-Parameter entfernt

### Bilder
- [ ] Alle Bilder nach `public/images/branchen/` kopiert
- [ ] Hero-Bild vorhanden
- [ ] Content-Bilder vorhanden
- [ ] Pfade im Content aktualisiert

### Validierung
- [ ] `yarn check` erfolgreich
- [ ] Dev-Server gestartet
- [ ] Seite öffnet ohne Fehler
- [ ] Alle Sektionen rendern korrekt
- [ ] Bilder laden
- [ ] Links funktionieren
- [ ] Mobile-Ansicht geprüft

### SEO
- [ ] Meta-Title korrekt
- [ ] Meta-Description gesetzt
- [ ] OG-Image vorhanden
- [ ] Keywords sinnvoll

---

## Bulk-Migration: Mehrere Posts

### Vorbereitung

1. **Inventar erstellen**:
   - Liste aller WordPress-Posts
   - Ziel-Branchen festlegen
   - Kategorien zuordnen

2. **Ressourcen sammeln**:
   - Alle Bilder-Ordner
   - Hero-Bilder vorbereiten
   - Testimonials sammeln

3. **Template erstellen**:
   - Frontmatter-Vorlage
   - Stats-Templates pro Branche
   - Standard-Descriptions

### Batch-Processing

**Option A: Manuell** (empfohlen für < 10 Posts)
- Schritt-für-Schritt wie Single Migration
- Höchste Qualität

**Option B: Semi-Automatisch** (10-50 Posts)
- Script für Grundtransformation
- Manuelle Nachbearbeitung (Testimonials, Stats)

**Option C: Vollautomatisch** (> 50 Posts)
- Vollständiges Migrations-Script
- Bulk-Review nach Migration

### Quality Assurance

**Stichproben-Prüfung**:
- 10% der Branchen manuell prüfen
- Verschiedene Kategorien testen
- Edge Cases identifizieren

**Automated Testing**:
- Build-Fehler sammeln
- Broken-Link-Check
- Image-Availability-Check

---

## Häufige Probleme & Lösungen

### Problem 1: Zod Validation Error

**Fehler**:
```
Error: Category must be either "groesse" or "taetigkeit"
```

**Lösung**:
```yaml
# Falsch
category: arztpraxen

# Richtig
category: "taetigkeit"
```

### Problem 2: Bild lädt nicht

**Fehler**: 404 für Bild

**Ursachen**:
- Pfad relativ statt absolut: `images/x.jpg` → `/images/branchen/x.jpg`
- Bild fehlt in `public/` Ordner
- Tippfehler im Dateinamen

**Lösung**:
```markdown
# Prüfen
ls public/images/branchen/

# Pfad korrigieren
![Alt](/images/branchen/bild.jpg)
```

### Problem 3: Content wird nicht gerendert

**Fehler**: Leere Content-Section

**Ursachen**:
- `render()` Funktion fehlt
- Content zwischen `---` Frontmatter-Delimitern

**Lösung**:
```astro
// Datei: src/pages/branchen/[single].astro
import { render } from "astro:content";
const { Content } = await render(branche);  // Nicht: branche.render()
```

### Problem 4: Stats rendern nicht

**Fehler**: Stats-Section erscheint nicht

**Ursache**: Frontmatter-Syntax-Fehler

**Lösung**:
```yaml
# Falsch
stats:
  - label: Bereitschaft, value: Automatisch

# Richtig
stats:
  - label: "Bereitschaft"
    value: "Automatisch"
```

---

## Maintenance & Updates

### Branchen-Content aktualisieren

**Workflow**:
1. `.md` File in `src/content/branchen/` editieren
2. Content oder Frontmatter anpassen
3. Speichern (Hot-Reload im Dev-Mode)
4. Prüfen, committen, deployen

### Neue Branche hinzufügen

**Schritte**:
1. Neue `.md` Datei in `src/content/branchen/` erstellen
2. Frontmatter nach Schema ausfüllen
3. Content schreiben
4. Bilder in `public/images/branchen/` ablegen
5. Build testen
6. Deployment

**Dateiname** = URL-Slug:
- `kindergarten.md` → `/branchen/kindergarten`
- `online-handel.md` → `/branchen/online-handel`

### Template-Änderungen

**Vorsicht**: Änderungen an `src/pages/branchen/[single].astro` betreffen ALLE Branchen

**Best Practice**:
1. Änderung lokal testen
2. Mehrere Branchen-Seiten prüfen
3. Mobile + Desktop testen
4. Commit mit aussagekräftiger Message

---

## Referenzen

### Dateien
- Template: `src/pages/branchen/[single].astro`
- Content: `src/content/branchen/*.md`
- Schema: `src/content.config.ts` (Zeilen 294-320)
- Blog-Referenz: `src/layouts/partials/PostSingle.astro` (Zeile 74)

### Dokumentation
- Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Astro 5 Glob Loader: https://docs.astro.build/en/reference/content-loader-reference/
- Zod Schema: https://zod.dev/

### Interne Guidelines
- CLAUDE.md: Projektrichtlinien
- Design System: `src/config/theme.json`
- Komponenten: `src/layouts/components/`

---

**Ende der Spezifikation**

Version 1.0 | 2025-01-29
