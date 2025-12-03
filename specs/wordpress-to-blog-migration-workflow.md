# Migration Specification: WordPress Posts → Blog-Einträge

**Version**: 1.0
**Datum**: 2025-01-30
**Autor**: Migration Spec für ZFDM SyncMaster Astro

---

## Template-Struktur `/ressourcen/blog/[single].astro`

### Sektionen-Übersicht (in Reihenfolge)

#### 1. **Hero Section** (Zeilen 20-73)
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
    - Links: "Written by" + Author, "Published on" + Datum
    - Rechts: Share-Buttons ("Share On")
- **Animation**: AOS fade-up + zoom-in
- **Responsive**: Full-width auf allen Breakpoints, Overlay stapelt vertikal auf Mobile

#### 2. **Content Section** (Zeilen 74-78)
- **Layout**: Zentrierte Spalte, 80% Breite auf Large Screens
- **Styling**:
  - **Klasse**: `content` (Blog-Style CSS)
  - **Breite**: `lg:col-10` (zentriert, bessere Lesbarkeit)
  - **Container**: `justify-center` Row
  - **Element**: `<article>` (semantisches HTML)
  - **Animation**: AOS fade-up
- **Inhalt**: Gerenderte Markdown-Content aus `.md` File

**Code-Beispiel**:
```astro
<div class="content" data-aos="fade-up-sm" data-aos-delay="400">
  <Content />
</div>
```

#### 3. **Related Posts Section** (Zeilen 80-98)
- **Layout**: 3-spaltiges Grid (responsive: 1/2/3 Spalten)
- **Logik**: Zeigt 3 ähnliche Artikel basierend auf Tags/Kategorien
- **Card-Inhalt**:
  - Bild (BlogCard-Komponente)
  - Kategorie-Badge
  - Titel
  - Datum + Author
  - "Read More" Link
- **Titel**: "Read similar articles"

#### 4. **Call to Action Section** (Nach PostSingle.astro)
- **Component**: `<CallToAction />`
- **Inhalt**: Globale CTA-Komponente aus Partials
- **Position**: Immer als letzter Abschnitt

---

## Frontmatter Schema (Zod Validation)

```typescript
{
  title: string;              // REQUIRED - Haupt-Überschrift
  meta_title?: string;        // Optional - SEO-Titel (falls abweichend)
  description: string;        // REQUIRED - Meta Description (max 160 Zeichen)
  date?: Date;                // Optional - Publikationsdatum
  image?: string;             // Hero-Bild, Pfad: /images/blog/xxx.jpg
  categories?: string[];      // Optional - Kategorien Array (z.B. ["Zeiterfassung", "DSGVO"])
  author?: string;            // Optional - Author Name (Standard: "ZFDM Team")
  draft: boolean;             // REQUIRED - Default: false
  hero?: {                    // Optional - Wird NICHT im Standard-Template verwendet
    title?: string;
    content: string;
  };
}
```

### Kategorie-Werte
Blog-Posts können mehrere Kategorien haben. Gängige Kategorien:
- **"Zeiterfassung"**: Allgemeine Zeiterfassungs-Themen
- **"DSGVO"**: Datenschutz und Compliance
- **"Produktivität"**: Effizienz und Best Practices
- **"Branchen"**: Branchenspezifische Artikel
- **"Updates"**: Produkt-Updates und Features
- **"Rechtliches"**: Gesetzliche Anforderungen

---

## WordPress zu Blog: Mapping-Regeln

### Content-Transformation Matrix

| WordPress Element | Blog Mapping | Aktion | Priorität |
|------------------|--------------|---------|-----------|
| `title` (frontmatter) | `title` | Direkt übernehmen | HOCH |
| `date` | `date` | **Behalten** als Date-Object | HOCH |
| `description` (frontmatter) | `description` | Direkt übernehmen (für SEO) | HOCH |
| `categories` | `categories` | In String-Array umwandeln | HOCH |
| `tags` | `categories` | Mit categories zusammenführen | MITTEL |
| `author` (falls vorhanden) | `author` | Übernehmen oder "ZFDM Team" | MITTEL |
| Hero-Bild im Content | `image` | Erstes Bild → Hero, Rest im Content | HOCH |
| CTA-Bilder im Content | - | **Entfernen** (nicht mehr benötigt) | HOCH |
| H1 im Content | - | **Entfernen** (wird aus `title` generiert) | HOCH |
| Bildpfade `images/xxx.png` | `/images/blog/xxx.png` | **Absoluten Pfad** setzen | HOCH |
| WordPress-Links | Astro-Routes | Z.B. `/contact/` → `/kontakt` | HOCH |
| Testimonials/Quotes | Behalten | Als Blockquotes im Content | NIEDRIG |

---

## Migration-Workflow

### Phase 1: Analyse

**Ziel**: WordPress-Content verstehen und strukturieren

1. WordPress `.md` File öffnen
2. Frontmatter parsen und validieren
3. Content-Struktur analysieren:
   - Datum extrahieren und validieren
   - Kategorien/Tags identifizieren
   - Author identifizieren (oder "ZFDM Team" als Standard)
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

**Blog Frontmatter** (Ziel):
```yaml
---
title: "Digitale Zeiterfassung für die Arztpraxis"
meta_title: "Zeiterfassung Arztpraxen | Praxiserfahrung | ZFDM"
description: "Erfahrungsbericht: Wie eine Arztpraxis mit digitaler Zeiterfassung Zeit spart und gesetzliche Anforderungen erfüllt. Jetzt lesen!"
date: 2025-05-31T00:00:00Z
image: "/images/blog/zeiterfassung-arztpraxis.jpg"
categories:
  - "Referenzen"
  - "Zeiterfassung"
  - "Branchen"
author: "ZFDM Team"
draft: false
---
```

**Transformations-Schritte**:
1. `title` → direkt übernehmen
2. `date` → in ISO 8601 Date-Format konvertieren (z.B. `2025-05-31T00:00:00Z`)
3. `categories` + `tags` → zusammenführen in `categories` Array
4. **Manuell hinzufügen**:
   - `meta_title` (SEO-optimiert, falls abweichend)
   - `description` (REQUIRED, max 160 Zeichen)
   - `image` (Pfad zum Hero-Bild)
   - `author` (oder "ZFDM Team" als Standard)
5. `draft: false` setzen

### Phase 3: Content-Bereinigung

#### ⚠️ WICHTIG: Null-Datenverlust-Prinzip

**KEIN TEXT DARF VERLOREN GEHEN!**

Diese Regel hat absolute Priorität über alle anderen Transformationsregeln.

**Bei Unsicherheit, wohin Content gehört:**
- ✅ Im Zweifel IMMER als Fließtext im Content behalten
- ✅ Testimonials als Blockquotes im Content behalten
- ✅ Alle Absätze, Listen, Features, Zitate behalten
- ✅ Narrative Passagen, emotionale Argumentation, Details behalten
- ✅ Nur echte Duplikate entfernen (z.B. H1 wenn identisch mit `title`)

#### Entfernen:

**1. H1-Duplikate**
```markdown
# Digitale Zeiterfassung für die Arztpraxis  ← ENTFERNEN
```
→ Wird automatisch aus `title` generiert

**2. CTA-Bildblöcke**
```markdown
[![Zeiterfassungssystem mit Chip](images/CTA-1.png)](/contact/)  ← ENTFERNEN
```
→ CallToAction-Section übernimmt

**3. Redundante Hero-Description**
```markdown
Eine einleitende Beschreibung direkt nach H1  ← PRÜFEN
```
→ Wenn identisch mit `description`, kann entfernt werden

#### Anpassen:

**1. Bildpfade**
```markdown
# Vorher (WordPress)
![Screenshot](images/screenshot.jpg)

# Nachher (Blog)
![Screenshot](/images/blog/screenshot.jpg)
```

**2. Links**
```markdown
# Vorher (WordPress)
[Kontakt](https://www.zeiterfassung-fdm.de/.../contact.php)
[Kundenrezension](https://www.zeiterfassung-fdm.de/kundenrezension-.../?lang=de)

# Nachher (Blog)
[Kontakt](/kontakt)
[Weitere Referenzen](/referenzen)
```

**3. WordPress-spezifische URLs**
- Entferne Query-Parameter (`?lang=de`)
- Kürze auf interne Routen
- Externe Links bleiben

**4. Datum-Format**
```markdown
# Vorher (WordPress)
date: 2025-05-31

# Nachher (Blog)
date: 2025-05-31T00:00:00Z
```

#### Behalten:

- ✅ Alle H2/H3-Überschriften
- ✅ Listen und Aufzählungen
- ✅ Textabsätze und Fließtext
- ✅ Feature-Beschreibungen
- ✅ Blockquotes und Testimonials
- ✅ Tabellen (falls vorhanden)
- ✅ Code-Blöcke

### Phase 4: Bild-Migration

#### Schritt 1: Bilder identifizieren

**Im WordPress-Content nach folgenden Patterns suchen**:
```markdown
![Alt-Text](images/bild.jpg)
[![Alt](images/cta.png)](/link/)
```

**Alle Bildpfade extrahieren**:
- `images/CTA-fur-Blogbeitrage-1-ZFDM-1024x289.png`
- `images/screenshot-dashboard.jpg`
- `images/feature-example.png`

#### Schritt 2: Bilder kopieren

```bash
# Von WordPress-Export
/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/wordpress-export/Posts/images/

# Nach Public-Folder
/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/syncmaster-astro/themes/syncmaster-astro/public/images/blog/
```

**Dateinamen**:
- Behalten: Original-Namen (für einfaches Matching)
- Oder umbenennen: `zeiterfassung-arztpraxis-hero.jpg`, `dashboard-screenshot.jpg`

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
  - Links: Author + Datum
  - Rechts: Share-Buttons
  - Backdrop-blur Hintergrund (`bg-text-dark/40`)
- Vermeide wichtige Bildelemente im unteren Bereich (werden durch Overlay verdeckt)

**Im Frontmatter**:
```yaml
image: "/images/blog/zeiterfassung-arztpraxis.jpg"
```

#### Schritt 4: Content-Bildpfade aktualisieren

**Suchen & Ersetzen**:
```markdown
# Vorher
![Screenshot](images/dashboard.jpg)

# Nachher
![Screenshot](/images/blog/dashboard.jpg)
```

**CTA-Bilder entfernen**:
```markdown
[![Text](images/CTA-xxx.png)](/contact/)  ← LÖSCHEN
```

### Phase 5: Kategorien-Normalisierung

**WordPress Kategorien** sind oft inkonsistent. Normalisiere sie:

#### Mapping-Regeln:

**WordPress → Blog Kategorien**:
- `"referenzen"` → `["Referenzen", "Branchen"]`
- `"zeiterfassung"` → `["Zeiterfassung"]`
- `"dsgvo"`, `"datenschutz"` → `["DSGVO"]`
- `"produktivitat"` → `["Produktivität"]`
- `"updates"` → `["Updates"]`
- `"rechtliches"` → `["Rechtliches"]`
- `"branchen"` → `["Branchen"]`

**Tags kombinieren**:
```yaml
# WordPress
categories: ["referenzen"]
tags: ["digitale-zeiterfassung", "kundenrezension"]

# Blog
categories: ["Referenzen", "Zeiterfassung"]
```

#### Kategorie-Guidelines:
- Maximal 3 Kategorien pro Post
- Erste Kategorie = Hauptkategorie
- Groß-/Kleinschreibung beachten (Erste Buchstaben groß)
- Deutsche Namen bevorzugen

### Phase 6: Author-Handling

**Standard-Author**: `"ZFDM Team"`

**WordPress Author-Mapping**:
- Wenn Author vorhanden → übernehmen
- Wenn leer → `"ZFDM Team"`
- Wenn "admin" oder "system" → `"ZFDM Team"`

**Beispiel**:
```yaml
# WordPress (kein Author)
title: "Mein Artikel"

# Blog
title: "Mein Artikel"
author: "ZFDM Team"
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
- Datum-Format korrekt

**Häufige Fehler**:
- `description` fehlt (REQUIRED)
- `draft` fehlt (REQUIRED)
- Datum-Format falsch (muss Date-Object sein)
- Bildpfade existieren nicht
- Frontmatter-Syntax-Fehler (YAML)

#### Runtime Testing

```bash
yarn dev
```

**Visuelle Checkliste** (`/ressourcen/blog/artikel-slug`):

- [ ] **Hero Section** (Blog-Style)
  - [ ] GridBg Hintergrund ist sichtbar
  - [ ] Titel wird zentriert angezeigt (große Schrift)
  - [ ] **KEINE** Beschreibung im Hero (nur im Meta-Tag)
  - [ ] Hero-Bild lädt korrekt (zentriert, rounded-3xl)
  - [ ] **KEINE** CTA-Buttons im Hero
  - [ ] Bild-Overlay erscheint im unteren Bereich:
    - [ ] "Written by" + Author (links)
    - [ ] "Published on" + Datum (links)
    - [ ] Share-Buttons (rechts)
    - [ ] Backdrop-blur Effekt funktioniert
  - [ ] Responsive auf Mobile (Overlay stapelt vertikal)

- [ ] **Content Section**
  - [ ] Content rendert korrekt
  - [ ] Keine H1-Duplikate
  - [ ] Bilder laden (absolute Pfade)
  - [ ] Links funktionieren
  - [ ] Styling ist korrekt (nur `content` Klasse)
  - [ ] Breite ist 80% auf Large Screens (`lg:col-10`)

- [ ] **Related Posts Section**
  - [ ] 3 ähnliche Artikel erscheinen
  - [ ] Bilder laden
  - [ ] Kategorie-Badges sichtbar
  - [ ] Links funktionieren

- [ ] **CallToAction Section**
  - [ ] CTA wird am Ende angezeigt

#### SEO Validation

**Meta-Tags prüfen** (Browser DevTools):
```html
<title>Zeiterfassung Arztpraxen | Praxiserfahrung | ZFDM</title>
<meta name="description" content="Erfahrungsbericht: Wie eine Arztpraxis...">
<meta property="og:image" content="/images/blog/zeiterfassung-arztpraxis.jpg">
```

**Lighthouse-Audit** (Optional):
- Performance
- SEO Score
- Best Practices

---

## Spezial-Regeln & Edge Cases

### 1. Leerer oder minimaler Content

**Problem**: WordPress-Post hat nur 1-2 Absätze Content

**Lösung**:
- Mindestens 3-5 Absätze Content hinzufügen
- Oder: Blog-spezifische Intro-Texte generieren
- Template rendert auch mit wenig Content korrekt

### 2. Sehr lange Content-Texte

**Problem**: WordPress-Post hat 3000+ Wörter

**Lösung**:
- Content behalten (Blog-Style ist für lange Texte optimiert)
- Optional: Inhaltsverzeichnis hinzufügen (manuell via Markdown)
- Keine Kürzung notwendig

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

### 7. Mehrere Autoren

**Problem**: Artikel hat mehrere Autoren oder Co-Autoren

**Lösung**:
- Hauptautor in `author` Field
- Co-Autoren im Content erwähnen (z.B. in Intro)
- Oder: `"ZFDM Team"` verwenden

### 8. Fehlende Datums-Angaben

**Problem**: WordPress-Post hat kein Datum

**Lösung**:
```yaml
# Option 1: Aktuelles Datum verwenden
date: 2025-01-30T00:00:00Z

# Option 2: Geschätztes Datum (aus Dateiname oder Context)
date: 2024-12-15T00:00:00Z

# Option 3: Datum optional lassen (wird dann nicht angezeigt)
# date field weglassen
```

---

## Checkliste: Single Migration

### Pre-Migration
- [ ] WordPress `.md` File liegt vor
- [ ] Bilder-Ordner identifiziert
- [ ] Ziel-Kategorien festgelegt

### Content-Analyse
- [ ] Datum extrahiert und validiert
- [ ] Kategorien/Tags identifiziert
- [ ] Author identifiziert
- [ ] Bilder extrahiert
- [ ] Links geprüft
- [ ] CTA-Blöcke lokalisiert

### Frontmatter
- [ ] `title` gesetzt
- [ ] `meta_title` erstellt (optional, SEO-optimiert)
- [ ] `description` geschrieben (REQUIRED, max 160 Zeichen)
- [ ] `date` konvertiert (ISO 8601 Format)
- [ ] `image` Pfad gesetzt
- [ ] `categories` Array gefüllt
- [ ] `author` gesetzt (oder "ZFDM Team")
- [ ] `draft: false` gesetzt

### Content-Cleanup
- [ ] H1-Duplikate entfernt
- [ ] CTA-Bildblöcke gelöscht
- [ ] Bildpfade auf `/images/blog/` angepasst
- [ ] Links aktualisiert (WordPress → Astro-Routes)
- [ ] Query-Parameter entfernt
- [ ] Testimonials als Blockquotes behalten

### Bilder
- [ ] Alle Bilder nach `public/images/blog/` kopiert
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
- [ ] Kategorien sinnvoll

---

## Bulk-Migration: Mehrere Posts

### Vorbereitung

1. **Inventar erstellen**:
   - Liste aller WordPress-Posts
   - Kategorien zuordnen
   - Autoren identifizieren

2. **Ressourcen sammeln**:
   - Alle Bilder-Ordner
   - Hero-Bilder vorbereiten
   - Standard-Author festlegen

3. **Template erstellen**:
   - Frontmatter-Vorlage
   - Kategorie-Mapping-Tabelle
   - Standard-Descriptions

### Batch-Processing

**Option A: Manuell** (empfohlen für < 10 Posts)
- Schritt-für-Schritt wie Single Migration
- Höchste Qualität

**Option B: Semi-Automatisch** (10-50 Posts)
- Script für Grundtransformation
- Manuelle Nachbearbeitung (Kategorien, Bilder)

**Option C: Vollautomatisch** (> 50 Posts)
- Vollständiges Migrations-Script
- Bulk-Review nach Migration

### Quality Assurance

**Stichproben-Prüfung**:
- 10% der Artikel manuell prüfen
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
Error: "description" is required
```

**Lösung**:
```yaml
# Falsch
title: "Mein Artikel"

# Richtig
title: "Mein Artikel"
description: "Eine kurze Beschreibung des Artikels für SEO-Zwecke."
```

### Problem 2: Datum-Format Error

**Fehler**:
```
Error: Invalid date format
```

**Lösung**:
```yaml
# Falsch
date: 2025-05-31

# Richtig
date: 2025-05-31T00:00:00Z
```

### Problem 3: Bild lädt nicht

**Fehler**: 404 für Bild

**Ursachen**:
- Pfad relativ statt absolut: `images/x.jpg` → `/images/blog/x.jpg`
- Bild fehlt in `public/` Ordner
- Tippfehler im Dateinamen

**Lösung**:
```markdown
# Prüfen
ls public/images/blog/

# Pfad korrigieren
![Alt](/images/blog/bild.jpg)
```

### Problem 4: Content wird nicht gerendert

**Fehler**: Leere Content-Section

**Ursachen**:
- `render()` Funktion fehlt
- Content zwischen `---` Frontmatter-Delimitern

**Lösung**:
```astro
// Datei: src/pages/ressourcen/blog/[single].astro
import { render } from "astro:content";
const { Content } = await render(post);  // Nicht: post.render()
```

### Problem 5: Related Posts erscheinen nicht

**Fehler**: Related Posts Section leer

**Ursache**: Keine ähnlichen Posts oder fehlende Kategorien

**Lösung**:
- Mindestens 3 andere Blog-Posts mit ähnlichen Kategorien erstellen
- Kategorien im Frontmatter korrekt setzen

---

## Maintenance & Updates

### Blog-Content aktualisieren

**Workflow**:
1. `.md` File in `src/content/blog/` editieren
2. Content oder Frontmatter anpassen
3. Speichern (Hot-Reload im Dev-Mode)
4. Prüfen, committen, deployen

### Neuen Blog-Post hinzufügen

**Schritte**:
1. Neue `.md` Datei in `src/content/blog/` erstellen
2. Frontmatter nach Schema ausfüllen
3. Content schreiben
4. Bilder in `public/images/blog/` ablegen
5. Build testen
6. Deployment

**Dateiname** = URL-Slug:
- `zeiterfassung-tipps.md` → `/ressourcen/blog/zeiterfassung-tipps`
- `dsgvo-compliance.md` → `/ressourcen/blog/dsgvo-compliance`

### Template-Änderungen

**Vorsicht**: Änderungen an `src/pages/ressourcen/blog/[single].astro` betreffen ALLE Blog-Posts

**Best Practice**:
1. Änderung lokal testen
2. Mehrere Blog-Seiten prüfen
3. Mobile + Desktop testen
4. Commit mit aussagekräftiger Message

---

## Unterschiede zur Branchen-Migration

### Hauptunterschiede:

| Aspekt | Branchen | Blog |
|--------|----------|------|
| **Datum** | Nicht verwendet | WICHTIG (Publikationsdatum) |
| **Author** | Nicht verwendet | Optional (Standard: "ZFDM Team") |
| **Stats** | 4 Stats im Hero-Overlay | KEINE Stats |
| **Testimonial** | Dedicated Section | Als Blockquotes im Content |
| **Hero-Overlay** | Kategorie + Stats + Share | Author + Datum + Share |
| **Related Items** | 3 Branchen (nach Kategorie) | 3 Posts (nach Kategorien) |
| **Kategorien** | Single (groesse/taetigkeit) | Multiple (Array) |
| **Content-Typ** | Evergreen, produkt-fokussiert | News, Updates, Erfahrungsberichte |

### Gemeinsamkeiten:

- ✅ Blog-Style Hero mit GridBg
- ✅ Zentrierter Content (lg:col-10)
- ✅ Content-Klasse für Styling
- ✅ Rounded-3xl Bild mit Overlay
- ✅ Share-Buttons im Overlay
- ✅ CallToAction am Ende
- ✅ Null-Datenverlust-Prinzip

---

## Referenzen

### Dateien
- Template: `src/pages/ressourcen/blog/[single].astro`
- Content: `src/content/blog/*.md`
- Schema: `src/content.config.ts` (Zeilen 167-176)
- PostSingle Partial: `src/layouts/partials/PostSingle.astro`
- BlogCard Component: `src/layouts/components/BlogCard.astro`

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

Version 1.0 | 2025-01-30
