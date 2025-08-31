# Fallkonzeptgenerator – vereinfachtes Konzept

Dieses Dokument beschreibt ein verbessertes Bedienkonzept für den Fallkonzeptgenerator. Ziel ist die Standardisierung der Eingaben. Freitextfelder werden nur dort eingesetzt, wo individuelle Angaben unverzichtbar sind; alle übrigen Informationen werden über Auswahl‑ oder strukturierte Eingabefelder erfasst.

## 1. Eingangsdaten
- **Antragsart** – Auswahl: `Erstantrag`, `Umwandlungsantrag (KZT → LZT)`, `Fortführungsantrag (z. B. 60 → 80 Sitzungen)`
- **Patienten‑Chiffre/Initialen** – Freitext
- **Therapeut*in** – Name und Berufsbezeichnung (Freitext)
- **Probatorik** – Anzahl bisheriger probatorischer Sitzungen (Ganzzahl) und Datum des Erstgesprächs (Datum)

## 2. Soziodemografische Daten
- **Alter** – Ganzzahl
- **Geschlecht** – Auswahl oder Freitext
- **Berufliche Situation** – Auswahl: `Vollzeit`, `Teilzeit`, `arbeitslos`, `Krankengeld`, `ALG II`, `Freitext`
- **Familienstand/Partnerschaft** – Auswahl: `Single`, `verheiratet`, `geschieden`, `feste Partnerschaft`
- **Kinder** – Wiederholbare strukturierte Eingabe (Alter pro Kind)
- **Wohnsituation** – Mehrfachauswahl: `mit Partner*in`, `mit Eltern`, `mit Kindern`, `allein`, `Wohngemeinschaft`
- **Weitere soziale Daten** – Freitext

## 3. Symptomatik und subjektiver Leidensdruck
- **Vorstellungsgrund** – Freitext
- **Symptome** – pro Ebene Auswahl typischer Beschwerden + optionales Freitextfeld:
  - Physiologisch: `Schlafstörungen`, `Appetitveränderung`, `Spannungszustände`, …
  - Emotional: `Angst`, `Traurigkeit`, `Anspannung`, …
  - Kognitiv: `Grübeln`, `Selbstzweifel`, `Überzeugungen`, …
  - Verhalten: `Vermeidung`, `Rückzug`, `Sicherheitsverhalten`, …
- **Verlauf/Schweregrad** – Dauer (Auswahl: `<1 Monat`, `1‑6 Monate`, `>6 Monate`), Häufigkeit (Auswahl: `selten`, `gelegentlich`, `häufig`, `ständig`) + Freitext zur Intensität/Veränderung
- **Komorbiditäten** – wiederholbare Auswahl typischer Störungen + Freitext
- **Subjektiver Leidensdruck/Therapiebedarf** – Freitext (für Konjunktiv im Bericht)

## 4. Psychischer Befund (AMDP)
Für jede Kategorie Mehrfachauswahl typischer Merkmale + optionaler Freitext.
- Äußeres Erscheinungsbild
- Verhalten/Psychomotorik
- Bewusstsein
- Orientierung – für Ort/Zeit/Situation/Person Auswahl: `voll orientiert`, `teilweise`, `desorientiert`
- Aufmerksamkeit/Gedächtnis
- Formales Denken
- Inhaltliches Denken
- Wahrnehmungsstörungen
- Ich‑Störungen
- Affektivität
- Antrieb/Psychomotorik
- Zirkadiane/vegetative Besonderheiten
- **Suizidalität/Fremdgefährlichkeit**
  - Aktuelle Suizidgedanken – Auswahl: `ja` + Freitext / `nein`
  - Frühere Versuche/Fremdaggression – Auswahl + Freitext
  - Protektive Faktoren – Auswahl (z. B. `soziale Bindungen`) + Freitext

## 5. Somatischer Befund und Konsiliarbericht
- **Konsiliarbericht vorhanden** – Auswahl: `ja` (Upload) / `nein`
- **Somatischer Befund** – Freitext
- **Körpergröße/Gewicht** – numerische Felder
- **Substanzkonsum** – Mehrfachauswahl: `Alkohol`, `Nikotin`, `illegale Drogen`, `kein Konsum`
- **Aktuelle Medikation** – wiederholbare strukturierte Eingabe (Name, Dosierung, Wirkung/Nebenwirkungen)
- **Vorbehandlungen** – wiederholbare Auswahl (`ambulant`, `stationär`, `Medikation`) + Freitext

## 6. Lebensgeschichte, Krankheitsanamnese und funktionales Bedingungsmodell
- **Lebensgeschichtliche Aspekte** – Auswahl relevanter Kategorien (`Kindheit/Familie`, `Schule/Beruf`, `Partnerschaften`, `Belastende Ereignisse`, `Ressourcen`) mit Freitext zur Erläuterung
- **Krankheitsanamnese** – strukturierte Felder für `Ersterkrankung` (Datum), `Verlauf` (Auswahl + Freitext), `Vorbehandlungen` (Auswahl + Freitext), `Krankheitsverständnis` (Freitext)
- **Prädispositionen** – Auswahl typischer Faktoren + Freitext
- **Auslösende Bedingungen** – Auswahl `solitäres Ereignis`/`schleichender Beginn` + Freitext zur Beschreibung
- **Aufrechterhaltende Bedingungen** – pro Bereich Auswahl typischer Faktoren (`kognitive Prozesse`, `fehlende Kompetenzen`, `Verhaltensweisen`, `Konsequenzen`, `Ressourcen`) + Freitext
- **Verhaltensanalyse (SORKC)** – wiederholbare Maske mit strukturierten Feldern für S, O, R, K, C

## 7. Diagnosen (ICD‑10/ICD‑11)
- **Primäre Diagnose** – Auswahl aus Liste gängiger Codes oder Freitext (Kennzeichnung `G`/`V`)
- **Komorbiditäten** – wiederholbare Auswahl
- **Differentialdiagnosen** – optionales Freitextfeld
- **Begründung** – Freitext

## 8. Behandlungsplan und Prognose
- **Therapieziele** – wiederholbare Eingabe: Ziel (Freitext), Klassifikation `kurzfristig`/`mittelfristig`/`langfristig`, Zuordnung zu Problembereich
- **Zielvereinbarung mit Patient*in** – Auswahl: `ja`/`nein`
- **Geplante Interventionen** – pro Ziel Mehrfachauswahl typischer Methoden + Freitext
- **Therapieumfang** – Anzahl Sitzungen (numerisch)
- **Prognose** – Auswahl: `positiv`, `eher günstig`, `kritisch`, `ungünstig` + Freitext zu förderlichen/hemmenden Faktoren
- **Rückfallprophylaxe/Weiterbehandlung** – Freitext

## 9. Zusatz für Umwandlungs‑ und Fortführungsanträge
Erscheint nur, wenn in Abschnitt 1 ausgewählt.
- **Bisheriger Behandlungsverlauf** – Freitext
- **Aktueller psychischer Befund/Testresultate** – strukturierte Felder wie in Abschnitt 4 + Freitext
- **Begründung der Fortführung/Umwandlung** – Freitext
- **Geänderte/erweiterte Ziele und Methoden** – wiederholbare Felder wie in Abschnitt 8
- **Prognose/Abschlussplanung** – Freitext
- **Berichtnummer** – numerisches Feld (nur Fortführungsantrag)

## 10. Anlagen
Checkliste mit Ankreuzfeldern für erforderliche Unterlagen (`PTV‑Formulare`, `Konsiliarbericht`, `frühere Berichte`).

---
Dieses vereinfachte Konzept ermöglicht eine weitgehend standardisierte Datenerfassung und unterstützt die automatische Erstellung strukturierter Berichte.
