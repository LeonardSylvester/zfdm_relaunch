import { useState, useMemo } from "react";

const Kostenrechner = () => {
  const [monatslohn, setMonatslohn] = useState(3500);
  const [minutenProTag, setMinutenProTag] = useState(20);
  const arbeitstage = 22;

  const berechnungen = useMemo(() => {
    // Lohnkosten pro Minute = Monatslohn / 22 Tage / 8 Stunden / 60 Minuten
    const lohnkostenProMinute = monatslohn / arbeitstage / 8 / 60;
    // Monatlicher Zeitaufwand = Minuten pro Tag * Arbeitstage
    const monatlicheMinuten = minutenProTag * arbeitstage;
    // Monatliche Kosten = Lohnkosten pro Minute * Monatlicher Zeitaufwand
    const monatlicheKosten = lohnkostenProMinute * monatlicheMinuten;

    return {
      lohnkostenProMinute: lohnkostenProMinute.toFixed(2).replace(".", ","),
      monatlicheMinuten,
      monatlicheKosten: Math.round(monatlicheKosten),
    };
  }, [monatslohn, minutenProTag]);

  return (
    <div className="space-y-6">
      {/* Eingabefelder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Monatslohn */}
        <div className="bg-body rounded-xl p-5 border border-border/30">
          <label className="block text-sm text-text mb-2">
            Monatslohn verantwortliche Person
          </label>
          <div className="flex items-center gap-2">
            <span className="text-text">EUR</span>
            <input
              type="number"
              value={monatslohn}
              onChange={(e) => setMonatslohn(Number(e.target.value) || 0)}
              className="w-full bg-transparent text-xl font-semibold text-dark border-none outline-none focus:ring-0"
              min="0"
              step="100"
            />
          </div>
        </div>

        {/* Aufwand pro Tag */}
        <div className="bg-body rounded-xl p-5 border border-border/30">
          <label className="block text-sm text-text mb-2">
            Aufwand Zeiterfassung pro Tag (Min.)
          </label>
          <input
            type="number"
            value={minutenProTag}
            onChange={(e) => setMinutenProTag(Number(e.target.value) || 0)}
            className="w-full bg-transparent text-xl font-semibold text-dark border-none outline-none focus:ring-0"
            min="0"
            step="5"
          />
        </div>

        {/* Arbeitstage (fix) */}
        <div className="bg-body rounded-xl p-5 border border-border/30">
          <label className="block text-sm text-text mb-2">
            Arbeitstage / Monat
          </label>
          <div className="text-xl font-semibold text-dark">{arbeitstage}</div>
          <div className="text-xs text-text/60 mt-1">fix angenommen</div>
        </div>
      </div>

      {/* Ergebnisse */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Lohnkosten pro Minute */}
        <div className="bg-body rounded-xl p-5 border border-border/30">
          <div className="text-sm text-text mb-1">Lohnkosten pro Minute</div>
          <div className="text-2xl font-bold text-dark">
            {berechnungen.lohnkostenProMinute} EUR
          </div>
          <div className="text-xs text-text/60 mt-1">
            = Monatslohn / 22 / 8 / 60
          </div>
        </div>

        {/* Monatlicher Zeitaufwand */}
        <div className="bg-body rounded-xl p-5 border border-border/30">
          <div className="text-sm text-text mb-1">Monatlicher Zeitaufwand</div>
          <div className="text-2xl font-bold text-dark">
            {berechnungen.monatlicheMinuten} Min.
          </div>
          <div className="text-xs text-text/60 mt-1">= Minuten/Tag x 22</div>
        </div>

        {/* Monatliche Kosten - hervorgehoben */}
        <div className="bg-primary rounded-xl p-5">
          <div className="text-sm text-white/80 mb-1">
            Monatliche Kosten (manuell)
          </div>
          <div className="text-3xl font-bold text-white">
            {berechnungen.monatlicheKosten} EUR
          </div>
          <div className="text-xs text-white/60 mt-1">
            = Lohnkosten/Min. x monatlicher Zeitaufwand
          </div>
        </div>
      </div>

      {/* Beispielrechnung */}
      <div className="bg-body rounded-xl p-5 border border-border/30">
        <p className="text-text text-sm">
          <strong className="text-dark">Beispiel:</strong> Bei{" "}
          {monatslohn.toLocaleString("de-DE")} EUR Monatslohn und {minutenProTag}{" "}
          Min./Tag entstehen pro Monat{" "}
          <strong className="text-primary">
            {berechnungen.monatlicheKosten} EUR
          </strong>{" "}
          reine Prozesskosten nur fuer die manuelle Zeiterfassung. Mit ZFDM
          entfallen grosse Teile dieser Zeit (und Fehlerkorrekturen).
        </p>
      </div>

      {/* Formel-Hinweis */}
      <p className="text-xs text-text/50 text-center">
        Berechnung: Lohnkosten/Minute = Monatslohn / 22 / 8 / 60 - Monatliche
        Kosten = Lohnkosten/Minute x (Minuten/Tag x 22)
      </p>
    </div>
  );
};

export default Kostenrechner;