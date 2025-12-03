#!/bin/bash

SOURCE="/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/wordpress-export/pages/images"
DEST="/Users/raphaelbridts/Documents/Agentur/Kunden/ZFDM/syncmaster-astro/themes/syncmaster-astro/public/images"

# Erstelle Ziel-Ordner
mkdir -p "$DEST/logos"
mkdir -p "$DEST/home"
mkdir -p "$DEST/testimonials"

echo "📦 Migriere WordPress-Bilder..."

# Logos
echo "📍 Logos..."
cp "$SOURCE/Coffee-Fellows-Logo-3-r5d43b1ubbft24ygxxu15gl980nzleguc2l48is64g.png" "$DEST/logos/coffee-fellows.png" 2>/dev/null && echo "  ✓ coffee-fellows.png" || echo "  ✗ coffee-fellows.png FEHLT"
cp "$SOURCE/logo-graeff-2-r5d0qu2idqit1by6ev5ekv0gc6gf1y7brsirxtenls.png" "$DEST/logos/graeff.png" 2>/dev/null && echo "  ✓ graeff.png" || echo "  ✗ graeff.png FEHLT"
cp "$SOURCE/Johannes-Bopp-Gmbh-Logo_09-21-schwarz-150x150.png" "$DEST/logos/johannes-bopp.png" 2>/dev/null && echo "  ✓ johannes-bopp.png" || echo "  ✗ johannes-bopp.png FEHLT"
cp "$SOURCE/logo_rss-bochum-r5d0qt4o6whippzjkcqs0d8zqsl1u93lfnvagjg1s0.png" "$DEST/logos/rss-bochum.png" 2>/dev/null && echo "  ✓ rss-bochum.png" || echo "  ✗ rss-bochum.png FEHLT"
cp "$SOURCE/hirshline-1-r5d49kn3vk0mgjuscnchrvnvshs2wrcf735nexhon4.png" "$DEST/logos/hirshline.png" 2>/dev/null && echo "  ✓ hirshline.png" || echo "  ✗ hirshline.png FEHLT"
cp "$SOURCE/hald-r5d0qr8zt8ey2i29vbxivdq2k0ubeuw4rekbhziu4g.png" "$DEST/logos/hald.png" 2>/dev/null && echo "  ✓ hald.png" || echo "  ✗ hald.png FEHLT"
cp "$SOURCE/Le-Postillion-Logo-r5d3ddo3sty2tcm9c8dhvi4jcegi9yjdrqryor83r4.png" "$DEST/logos/le-postillion.png" 2>/dev/null && echo "  ✓ le-postillion.png" || echo "  ✗ le-postillion.png FEHLT"
cp "$SOURCE/Hausarztpraxis-Logo-Gehlmann-Menke-r5d2007at4cuyqc4ne1zegnw0rteybiynd4s6ifklc.png" "$DEST/logos/hausarztpraxis.png" 2>/dev/null && echo "  ✓ hausarztpraxis.png" || echo "  ✗ hausarztpraxis.png FEHLT"

# Produkt-Bilder
echo "📍 Produkt-Bilder..."
cp "$SOURCE/2.geaendert-removebg-preview.png" "$DEST/home/chip-system.png" 2>/dev/null && echo "  ✓ chip-system.png" || echo "  ✗ chip-system.png FEHLT"
cp "$SOURCE/1.geaendert__1_-removebg-preview.png" "$DEST/home/fingerprint-system.png" 2>/dev/null && echo "  ✓ fingerprint-system.png" || echo "  ✗ fingerprint-system.png FEHLT"
cp "$SOURCE/Zeiterfassungsgeraete-4-bundle.geaendert-removebg-preview.png" "$DEST/home/multi-terminal.png" 2>/dev/null && echo "  ✓ multi-terminal.png" || echo "  ✗ multi-terminal.png FEHLT"

# Sonstige Bilder
echo "📍 Sonstige Bilder..."
cp "$SOURCE/Gesetzesanderungen.geaendert.jpg" "$DEST/home/gesetz.jpg" 2>/dev/null && echo "  ✓ gesetz.jpg" || echo "  ✗ gesetz.jpg FEHLT"
cp "$SOURCE/Optimized-ant.jpg" "$DEST/home/team.jpg" 2>/dev/null && echo "  ✓ team.jpg" || echo "  ✗ team.jpg FEHLT"
cp "$SOURCE/Google_Icons-09-512.webp" "$DEST/testimonials/google-icon.webp" 2>/dev/null && echo "  ✓ google-icon.webp" || echo "  ✗ google-icon.webp FEHLT"

echo ""
echo "✅ Migration abgeschlossen!"
echo ""
echo "📊 Zusammenfassung:"
echo "   - Logos: $DEST/logos/ (8 Dateien)"
echo "   - Home: $DEST/home/ (5 Dateien)"
echo "   - Testimonials: $DEST/testimonials/ (1 Datei)"
