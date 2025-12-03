# Migration Specification: WordPress Posts → Branchen-Einträge

**Version**: 2.0 (Zero-Loss Workflow)
**Datum**: 2025-01-29
**Autor**: Migration Spec für ZFDM SyncMaster Astro

---

## 📋 Workflow-Übersicht (Quick Reference)

**Grundprinzip**: "Copy-First, Mark-Later" - Text überlebt standardmäßig

| Phase | Name | Aktion | Datenverlust? |
|-------|------|--------|---------------|
| 1 | Mechanisches Kopieren | 100% WordPress → Branchen | ❌ Nein |
| 2 | Frontmatter Enhancement | Felder hinzufügen | ❌ Nein |
| 3 | Duplicate Marking & Extraction | HTML-Kommentare + Stats/Testimonials extrahieren | ❌ Nein |
| 4 | Verified Removal | Nur markierte Blöcke löschen | ⚠️ Ja (nur Duplikate) |
| 5 | Bild-Migration | Bilder kopieren & Pfade setzen | ❌ Nein |
| 6 | Final Validation | Word Count + Visual + Build Check | ❌ Nein |

**Commit-Strategie**: Nach jeder Phase committen für einfaches Rollback

**Red Flags**:
- ❌ > 20% Word Count Reduktion nach Phase 4
- ❌ Fehlende H2/H3-Überschriften
- ❌ Fehlende narrative Absätze (z.B. "Zeiterfassungssystem mit Chip")
- ❌ Gekürzte oder paraphrasierte Sätze
- ❌ Fehlende Testimonials (außer dem ins Frontmatter extrahierten)

**Bei Red Flags**: Sofort `git checkout` → Zurück zu Phase 3 → Konservativer markieren

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

### ⚠️ WICHTIG: Null-Datenverlust-Prinzip

**KEIN TEXT DARF VERLOREN GEHEN!**

Diese Regel hat **absolute Priorität** über alle anderen Transformationsregeln.

Der neue Workflow ist darauf ausgelegt, Text **standardmäßig zu bewahren** statt zu entscheiden, was behalten wird.

**Grundprinzip**: "Copy-First, Mark-Later"
- Phase 1: 100% des Contents kopieren (keine Entscheidungen)
- Phase 2: Frontmatter ergänzen (nur Addition, keine Löschung)
- Phase 3: Duplikate markieren (mit HTML-Kommentaren, nicht löschen)
- Phase 4: Nur markierte Blöcke entfernen (verifizierbar)

---

### Phase 1: Mechanisches Kopieren (Zero-Loss)

**Ziel**: Gesamten WordPress-Content 1:1 übernehmen, **ohne** Analyse oder Entscheidungen

**Schritte**:

1. **Neue Branchen-Datei erstellen**:
   ```bash
   # In: /src/content/branchen/
   touch arztpraxen.md
   ```

2. **Frontmatter kopieren** (komplett, 100%):
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
   draft: true  # ← WICHTIG: Als Draft markieren
   ---
   ```

3. **Content kopieren** (komplett, 100%):
   - Gesamten Markdown-Body von WordPress → Branchen kopieren
   - **Keine Zeile auslassen**
   - **Keine Kürzungen**
   - **Keine Entscheidungen**
   - Auch CTA-Bilder, H1-Duplikate, etc. vorerst behalten

**Ergebnis nach Phase 1**:
- ✅ Datei ist buildbar (draft: true verhindert Production-Build)
- ✅ 100% des Original-Texts vorhanden
- ✅ Keine Analyse erforderlich
- ✅ Keine Fehlerquelle

**Tools**: Copy-Paste oder Script für Bulk-Migration

### Phase 2: Frontmatter Enhancement (Additive Only)

**Ziel**: Fehlende Frontmatter-Felder hinzufügen, **ohne** bestehende Felder zu löschen

**Ausgangspunkt** (nach Phase 1):
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
draft: true
---
```

**Ergebnis** (nach Phase 2):
```yaml
---
title: "Digitale Zeiterfassung für die Arztpraxis"
meta_title: "Zeiterfassung Arztpraxen | Speziell für Mediziner | ZFDM"  # ← NEU
description: "Zeiterfassung speziell für Arztpraxen: Schichtplanung, Bereitschaftsdienste, DSGVO-konform."  # ← NEU
image: "/images/branchen/arztpraxen.jpg"  # ← NEU
category: "taetigkeit"  # ← NEU
keywords:  # ← UMBENANNT von "tags"
  - "digitale-zeiterfassung"
  - "kundenrezension"
  - "zeiterfassungssystem"
  - "Zeiterfassung Arztpraxen"  # ← NEU hinzugefügt
  - "medizinisches Personal"  # ← NEU hinzugefügt
date: 2025-05-31  # ← BEHALTEN (wird später in Phase 4 entfernt)
categories:  # ← BEHALTEN (wird später in Phase 4 entfernt)
  - "referenzen"
draft: true  # ← BEHALTEN
---
```

**Transformations-Schritte** (nur Addition!):

1. ✅ **Behalten**: `title` (unverändert)
2. ✅ **Behalten**: `date` (vorerst, wird in Phase 4 entfernt)
3. ✅ **Behalten**: `categories` (vorerst, wird in Phase 4 entfernt)
4. ✅ **Umbenennen**: `tags` → `keywords` (alle Werte übernehmen)
5. ➕ **Hinzufügen**:
   - `meta_title` (SEO-optimiert, ~60 Zeichen)
   - `description` (SEO-Meta-Tag, max 160 Zeichen)
   - `image` (Pfad: `/images/branchen/xxx.jpg`)
   - `category` (Wert: `"groesse"` oder `"taetigkeit"`)
6. ➕ **Optional hinzufügen** (werden später in Phase 3 aus Content extrahiert):
   - `stats` (leer lassen, später füllen)
   - `testimonial` (leer lassen, später füllen)

**⚠️ WICHTIG**: In dieser Phase wird **NICHTS gelöscht**!
- Alte Felder (`date`, `categories`) bleiben erhalten
- Content bleibt 100% unverändert
- Nur neue Felder werden hinzugefügt

**Ergebnis nach Phase 2**:
- ✅ Datei hat alle erforderlichen Branchen-Felder
- ✅ Alte WordPress-Felder noch vorhanden (für Referenz)
- ✅ Content immer noch 100% original
- ✅ Datei ist buildbar (draft: true)

### Phase 3: Duplicate Marking & Content Extraction (Non-Destructive)

**Ziel**: Duplikate und zu extrahierenden Content **markieren** (nicht löschen!), Frontmatter-Daten aus Content kopieren

**⚠️ WICHTIG**: In dieser Phase wird **NICHTS gelöscht**! Nur HTML-Kommentare hinzugefügt.

---

#### Schritt 3.1: Stats aus Content extrahieren

**Ziel**: Features/Listen → `stats` Frontmatter **kopieren** (Original im Content bleibt)

**Beispiel**:

**WordPress-Content** (bleibt vollständig erhalten):
```markdown
## Ihre Vorteile

- **Mehr Transparenz:** Jeder Mitarbeitende hat Einsicht
- **Weniger Aufwand:** Keine manuelle Auswertung mehr
- **Bessere Planung:** Integrierte Urlaubsplanung
- **Gerechte Verteilung:** Überstunden korrekt erfasst
```

**Aktion**: Frontmatter ergänzen (Content bleibt!):
```yaml
stats:
  - label: "Transparenz"
    value: "✓"
  - label: "Zeitersparnis"
    value: "✓"
  - label: "Urlaubsplanung"
    value: "Integriert"
  - label: "Überstunden"
    value: "Korrekt"
```

**⚠️ Content-Liste bleibt vollständig erhalten!**

**Hero-Overlay Design-Hinweise**:
- Erste 2 Stats erscheinen im Hero-Bild-Overlay
- Kurz halten: max. 15 Zeichen pro Label/Value
- Empfohlene Labels: "Mitarbeiter", "Setup-Zeit", "Standorte", "DSGVO", etc.
- Empfohlene Values: "1-10", "< 1 Stunde", "✓", "Kompatibel", etc.

---

#### Schritt 3.2: Testimonials aus Content extrahieren

**Ziel**: Bestes Testimonial → `testimonial` Frontmatter **kopieren** (Original im Content bleibt)

**Beispiel**:

**WordPress-Content** (bleibt vollständig erhalten):
```markdown
„Einfach zu installieren, flexibel – das Zeiterfassungssystem hat uns viel Arbeit abgenommen."

Dr. med. Meesters
Internisten Vilsbiburg
```

**Aktion**: Frontmatter ergänzen (Content bleibt!):
```yaml
testimonial:
  author: "Dr. med. Meesters"
  company: "Internisten Vilsbiburg"
  quote: "Einfach zu installieren, flexibel – das Zeiterfassungssystem hat uns viel Arbeit abgenommen."
```

**⚠️ Original-Testimonial im Content bleibt erhalten!**

**Falls mehrere Testimonials vorhanden**:
- Bestes/prominentestes → Frontmatter
- Alle anderen → als Blockquotes behalten
- **KEINE** Testimonials löschen

---

#### Schritt 3.3: Duplikate MARKIEREN (nicht löschen!)

**Ziel**: Elemente, die später entfernt werden sollen, mit HTML-Kommentaren umgeben

**Marker-Typen**:

1. **`<!-- DUPLICATE:title -->` ... `<!-- /DUPLICATE -->`**
   - Für H1, die exakt mit `frontmatter.title` übereinstimmt

2. **`<!-- EXTRACTED:testimonial -->` ... `<!-- /EXTRACTED -->`**
   - Für Testimonial, das ins Frontmatter kopiert wurde

3. **`<!-- CTA-IMAGE -->` ... `<!-- /CTA-IMAGE -->`**
   - Für CTA-Bildblöcke (z.B. `[![...](images/CTA-xxx.png)](/contact/)`)

**⚠️ REGEL**: **Im Zweifel NICHT markieren!**

Nur markieren wenn:
- H1 **exakt** identisch mit `title` (Zeichen für Zeichen)
- Testimonial **exakt** identisch mit `testimonial.quote`
- Bild eindeutig CTA-Grafik (`CTA-` im Dateinamen)

---

**Beispiel Markierung**:

```markdown
<!-- DUPLICATE:title -->
# Digitale Zeiterfassung für die Arztpraxis
<!-- /DUPLICATE -->

Einleitungstext bleibt vollständig erhalten...

<!-- EXTRACTED:testimonial -->
„Einfach zu installieren, flexibel – das Zeiterfassungssystem hat uns viel Arbeit abgenommen."

Dr. med. Meesters
Internisten Vilsbiburg
<!-- /EXTRACTED -->

Weitere Absätze bleiben vollständig erhalten...

<!-- CTA-IMAGE -->
[![Zeiterfassungssystem mit Chip](images/CTA-1.png)](/contact/)
<!-- /CTA-IMAGE -->

Noch mehr Content bleibt vollständig erhalten...
```

**⚠️ Alles zwischen den Kommentaren bleibt zunächst im Content!**

---

#### Schritt 3.4: Pfade anpassen (URLs & Bilder)

**Ziel**: Links und Bildpfade aktualisieren (keine Textänderungen!)

**Bildpfade**:
```markdown
# Vorher
![Screenshot](images/dashboard.jpg)

# Nachher
![Screenshot](/images/branchen/dashboard.jpg)
```

**Interne Links**:
```markdown
# Vorher
[Kontakt](https://www.zeiterfassung-fdm.de/.../contact.php?lang=de)

# Nachher
[Kontakt](/kontakt)
```

**Externe Links**: Unverändert lassen

---

**Ergebnis nach Phase 3**:
- ✅ `stats` und `testimonial` im Frontmatter hinzugefügt
- ✅ Duplikate mit HTML-Kommentaren markiert
- ✅ Pfade aktualisiert
- ✅ **100% des Original-Textes noch vorhanden**
- ✅ Datei ist buildbar und optisch korrekt (Duplikate werden gerendert, aber das ist OK)

**Nächster Schritt**: Phase 4 entfernt nur die markierten Blöcke

### Phase 4: Verified Removal (Nur markierte Blöcke löschen)

**Ziel**: **NUR** mit HTML-Kommentaren markierte Blöcke entfernen, Rest bleibt vollständig erhalten

**⚠️ WICHTIG**: In dieser Phase wird zum ersten Mal Text gelöscht - aber nur, wenn er markiert wurde!

---

#### Schritt 4.1: Markierte Duplikate entfernen

**Regex-Pattern zum Suchen**:
```regex
<!-- DUPLICATE:.*? -->[\s\S]*?<!-- /DUPLICATE -->
<!-- EXTRACTED:.*? -->[\s\S]*?<!-- /EXTRACTED -->
<!-- CTA-IMAGE -->[\s\S]*?<!-- /CTA-IMAGE -->
```

**Beispiel Vorher** (nach Phase 3):
```markdown
<!-- DUPLICATE:title -->
# Digitale Zeiterfassung für die Arztpraxis
<!-- /DUPLICATE -->

Einleitungstext bleibt vollständig erhalten...

<!-- EXTRACTED:testimonial -->
„Einfach zu installieren, flexibel..."

Dr. med. Meesters
Internisten Vilsbiburg
<!-- /EXTRACTED -->

Weitere Absätze bleiben vollständig erhalten...

## Zeiterfassungssystem mit Chip  ← NICHT MARKIERT, bleibt erhalten!

Flexibel skalierbar – auch für wachsende Teams...

<!-- CTA-IMAGE -->
[![CTA](images/CTA-1.png)](/contact/)
<!-- /CTA-IMAGE -->

Noch mehr Content bleibt vollständig erhalten...
```

**Beispiel Nachher** (nach Phase 4):
```markdown
Einleitungstext bleibt vollständig erhalten...

Weitere Absätze bleiben vollständig erhalten...

## Zeiterfassungssystem mit Chip  ← NICHT MARKIERT, bleibt erhalten!

Flexibel skalierbar – auch für wachsende Teams...

Noch mehr Content bleibt vollständig erhalten...
```

**⚠️ Nur markierte Blöcke wurden entfernt!** Alles andere bleibt erhalten.

---

#### Schritt 4.2: WordPress-Felder aus Frontmatter entfernen

**Felder zum Entfernen**:
- `date`
- `categories`
- Alle anderen WordPress-spezifischen Felder

**Vorher**:
```yaml
---
title: "..."
meta_title: "..."
keywords: [...]
date: 2025-05-31  ← ENTFERNEN
categories:  ← ENTFERNEN
  - "referenzen"
draft: true
---
```

**Nachher**:
```yaml
---
title: "..."
meta_title: "..."
keywords: [...]
draft: true
---
```

---

#### Schritt 4.3: Verification (WICHTIG!)

**Vor dem Entfernen prüfen**:

1. **Git Diff Check**:
   ```bash
   git diff src/content/branchen/arztpraxen.md | grep "^-" | grep -v "^---" | grep -v "<!-- "
   ```
   **Erwartung**: Nur markierte Blöcke erscheinen (mit `<!-- ... -->`)
   **Red Flag**: Unmarkierte Zeilen mit `-` Prefix

2. **Word Count Check**:
   ```bash
   # Vorher (WordPress)
   wc -w wordpress-export/Posts/arztpraxis.md

   # Nachher (Branchen, nach Phase 4)
   wc -w src/content/branchen/arztpraxen.md
   ```
   **Erwartung**: Max. 10-15% Differenz (nur Duplikate + CTA-Bilder)
   **Red Flag**: > 20% Differenz (zu viel gelöscht!)

3. **Visual Check**:
   ```bash
   yarn dev
   # Browser: http://localhost:4321/branchen/arztpraxen
   ```
   **Checkliste**:
   - [ ] Alle narrativen Passagen vorhanden?
   - [ ] Alle H2/H3-Überschriften da?
   - [ ] Alle Testimonials (außer Frontmatter) vorhanden?
   - [ ] Alle Features/Listen vorhanden?
   - [ ] "Zeiterfassungssystem mit Chip" Sektion vorhanden?
   - [ ] Keine wichtigen Absätze fehlen?

**Falls Verification fehlschlägt**:
```bash
git checkout src/content/branchen/arztpraxen.md
# Zurück zu Phase 3, neu markieren
```

---

**Ergebnis nach Phase 4**:
- ✅ Nur echte Duplikate entfernt (H1, extrahierte Testimonials, CTA-Bilder)
- ✅ Alle narrativen Passagen, Features, Überschriften erhalten
- ✅ WordPress-Felder aus Frontmatter entfernt
- ✅ Datei ist fertig migriert
- ✅ `draft: false` setzen für Production

### Phase 5: Bild-Migration

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

**⚠️ Hinweis**: Bildpfade wurden bereits in Phase 3.4 angepasst, CTA-Bilder in Phase 4.1 entfernt

---

**Ergebnis nach Phase 5**:
- ✅ Alle Bilder kopiert nach `/public/images/branchen/`
- ✅ Hero-Bild im Frontmatter referenziert
- ✅ Content-Bildpfade aktualisiert
- ✅ Migration abgeschlossen

### Phase 6: Final Validation & Testing

**Ziel**: Sicherstellen, dass die Migration vollständig und korrekt ist

---

#### Schritt 6.1: Build-Time Validation

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

---

#### Schritt 6.2: Content Completeness Check

**Word Count Comparison**:
```bash
# WordPress Original
wc -w /path/to/wordpress-export/arztpraxis.md
# Output: 1850 words

# Branchen Migriert
wc -w src/content/branchen/arztpraxen.md
# Output: 1670 words (10% weniger = OK, nur Duplikate entfernt)
```

**✅ Acceptable**: 10-15% Reduktion (H1-Duplikat, CTA-Bilder, extrahiertes Testimonial)
**❌ Red Flag**: > 20% Reduktion (zu viel gelöscht, zurück zu Phase 3!)

**Manual Content Check**:
- [ ] Alle H2/H3-Überschriften aus WordPress vorhanden?
- [ ] Alle narrativen Absätze vorhanden?
- [ ] Alle Listen/Features vorhanden?
- [ ] Alle Testimonials (außer Frontmatter) vorhanden?
- [ ] Spezielle Sektionen erhalten (z.B. "Zeiterfassungssystem mit Chip")?
- [ ] Keine Textkürzungen oder Paraphrasierungen?

---

#### Schritt 6.3: Runtime Testing

```bash
yarn dev
# Browser: http://localhost:4321/branchen/arztpraxen
```

**Visuelle Checkliste**:

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

#### Schritt 6.4: Rollback & Recovery (Falls Text fehlt)

**Falls fehlender Text entdeckt wird:**

1. **Identify Missing Text**:
   ```bash
   # Vergleiche WordPress vs. Branchen
   diff <(cat wordpress-export/arztpraxis.md) <(cat src/content/branchen/arztpraxen.md)
   ```

2. **Rollback to Phase 3**:
   ```bash
   git checkout src/content/branchen/arztpraxen.md
   # Oder: git reset --hard HEAD~1 (falls committed)
   ```

3. **Re-mark with More Care**:
   - Zurück zu Phase 3.3 (Duplicate Marking)
   - Nur **exakte** Duplikate markieren
   - **Im Zweifel NICHT markieren**
   - Neue Markierung committen:
     ```bash
     git add src/content/branchen/arztpraxen.md
     git commit -m "Phase 3: Re-marked duplicates (conservative)"
     ```

4. **Re-run Phase 4** (Verified Removal):
   - Markierte Blöcke entfernen
   - Word Count Check wiederholen
   - Visual Check wiederholen

**Prevention Best Practice**:
- **Commit nach jeder Phase**:
  ```bash
  git add src/content/branchen/arztpraxen.md
  git commit -m "Phase 3: Duplicates marked, content intact"
  ```
- So kann jede Phase einzeln zurückgesetzt werden

---

**Ergebnis nach Phase 6**:
- ✅ Migration verifiziert und getestet
- ✅ Kein Text verloren gegangen
- ✅ Datei ist production-ready
- ✅ `draft: false` setzen

---

## Rollback & Recovery Procedures

### Scenario 1: Text fehlt nach Phase 4

**Symptom**: Wichtige Absätze, Überschriften oder Features fehlen

**Root Cause**: Zu viele Blöcke in Phase 3 markiert

**Solution**:
```bash
# 1. Rollback
git checkout src/content/branchen/arztpraxen.md

# 2. Zurück zu Phase 3.3
# Nur EXAKTE Duplikate markieren:
# - H1 == frontmatter.title (Zeichen für Zeichen)
# - Testimonial == frontmatter.testimonial.quote (wörtlich)
# - CTA-Bilder (eindeutig mit "CTA-" im Namen)

# 3. Re-run Phase 4 mit Verification
```

### Scenario 2: Frontmatter-Daten fehlen

**Symptom**: `stats` oder `testimonial` im Frontmatter sind leer/falsch

**Root Cause**: Extraktion in Phase 3 übersprungen

**Solution**:
```bash
# Zurück zu Phase 3.1/3.2
# Stats & Testimonials aus Content extrahieren
# WICHTIG: Original im Content behalten!
```

### Scenario 3: Build schlägt fehl

**Symptom**: `yarn check` zeigt Fehler

**Root Cause**: Frontmatter-Schema verletzt

**Solution**:
```yaml
# Prüfe erforderliche Felder:
title: "..." # required
category: "taetigkeit" oder "groesse" # required, enum
keywords: [...] # optional
image: "/images/..." # optional
```

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
