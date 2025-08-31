// Skript zur Steuerung des mehrstufigen Formulars und zum Generieren des Berichts

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const formContainer = document.getElementById("formContainer");
  const introSection = document.getElementById("intro");
  const steps = document.querySelectorAll(".form-step");
  let currentStep = 0;

  // Hilfsfunktion zum Anzeigen eines bestimmten Schritts
  function showStep(stepIndex) {
    steps.forEach((step) => step.classList.remove("active"));
    const target = document.querySelector(`.form-step[data-step="${stepIndex}"]`);
    if (target) {
      target.classList.add("active");
      currentStep = stepIndex;
    }
  }

  // Start: Fragebogen anzeigen
  startButton.addEventListener("click", () => {
    introSection.classList.add("hidden");
    formContainer.classList.remove("hidden");
    showStep(0);
  });

  // Navigation Buttons definieren
  function addNavHandlers() {
    // Schritt 0
    document.getElementById("next0").addEventListener("click", () => {
      showStep(1);
    });
    // Schritt 1
    document.getElementById("prev1").addEventListener("click", () => showStep(0));
    document.getElementById("next1").addEventListener("click", () => showStep(2));
    // Schritt 2
    document.getElementById("prev2").addEventListener("click", () => showStep(1));
    document.getElementById("next2").addEventListener("click", () => showStep(3));
    // Schritt 3
    document.getElementById("prev3").addEventListener("click", () => showStep(2));
    document.getElementById("next3").addEventListener("click", () => showStep(4));
    // Schritt 4
    document.getElementById("prev4").addEventListener("click", () => showStep(3));
    document.getElementById("next4").addEventListener("click", () => showStep(5));
    // Schritt 5
    document.getElementById("prev5").addEventListener("click", () => showStep(4));
    document.getElementById("next5").addEventListener("click", () => showStep(6));
    // Schritt 6
    document.getElementById("prev6").addEventListener("click", () => showStep(5));
    document.getElementById("next6").addEventListener("click", () => showStep(7));
    // Schritt 7
    document.getElementById("prev7").addEventListener("click", () => showStep(6));
    document.getElementById("next7").addEventListener("click", () => {
      // Entscheiden, ob Zusatzschritt angezeigt werden muss
      const applicationType = document.getElementById("applicationType").value;
      if (applicationType === "umwandlung" || applicationType === "fortfuehrung") {
        showStep(8);
      } else {
        // Direkt zur Zusammenfassung
        showStep(9);
        compileReport();
      }
    });
    // Schritt 8
    document.getElementById("prev8").addEventListener("click", () => showStep(7));
    document.getElementById("next8").addEventListener("click", () => {
      showStep(9);
      compileReport();
    });
    // Schritt 9
    document.getElementById("prev9").addEventListener("click", () => {
      const applicationType = document.getElementById("applicationType").value;
      if (applicationType === "umwandlung" || applicationType === "fortfuehrung") {
        showStep(8);
      } else {
        showStep(7);
      }
    });
    document.getElementById("downloadReport").addEventListener("click", downloadReport);
  }

  // Bericht generieren
  function compileReport() {
    const data = {};
    // Allgemeine Daten
    data.applicationType = document.getElementById("applicationType").value;
    data.patientInitials = document.getElementById("patientInitials").value;
    data.patientAge = document.getElementById("patientAge").value;
    data.patientGender = document.getElementById("patientGender").value;
    data.occupation = document.getElementById("occupation").value;
    data.workStatus = document.getElementById("workStatus").value;
    data.maritalStatus = document.getElementById("maritalStatus").value;
    data.children = document.getElementById("children").value;
    data.livingSituation = document.getElementById("livingSituation").value;
    data.socialOther = document.getElementById("socialOther").value;
    // Symptomatik
    data.mainReason = document.getElementById("mainReason").value;
    data.symptomPhys = document.getElementById("symptomPhys").value;
    data.symptomEmo = document.getElementById("symptomEmo").value;
    data.symptomCog = document.getElementById("symptomCog").value;
    data.symptomBeh = document.getElementById("symptomBeh").value;
    data.symptomCourse = document.getElementById("symptomCourse").value;
    data.comorbidities = document.getElementById("comorbidities").value;
    data.subjectiveDistress = document.getElementById("subjectiveDistress").value;
    // Befund
    data.appearance = document.getElementById("appearance").value;
    data.behaviour = document.getElementById("behaviour").value;
    data.consciousness = document.getElementById("consciousness").value;
    data.orientation = document.getElementById("orientation").value;
    data.attentionMemory = document.getElementById("attentionMemory").value;
    data.thinkingFormal = document.getElementById("thinkingFormal").value;
    data.thinkingContent = document.getElementById("thinkingContent").value;
    data.perception = document.getElementById("perception").value;
    data.ichStörungen = document.getElementById("ichStörungen").value;
    data.affectivity = document.getElementById("affectivity").value;
    data.drive = document.getElementById("drive").value;
    data.vegetative = document.getElementById("vegetative").value;
    data.suicidality = document.getElementById("suicidality").value;
    // Somatik
    data.consiliar = document.getElementById("consiliar").value;
    data.somatic = document.getElementById("somatic").value;
    data.heightWeight = document.getElementById("heightWeight").value;
    data.substanceUse = document.getElementById("substanceUse").value;
    data.medication = document.getElementById("medication").value;
    data.previousTreatments = document.getElementById("previousTreatments").value;
    // Lebensgeschichte
    data.lifeHistory = document.getElementById("lifeHistory").value;
    data.predispositions = document.getElementById("predispositions").value;
    data.triggers = document.getElementById("triggers").value;
    data.maintenance = document.getElementById("maintenance").value;
    data.sorkc = document.getElementById("sorkc").value;
    // Diagnosen
    data.primaryDiagnosis = document.getElementById("primaryDiagnosis").value;
    data.comorbidDiagnosis = document.getElementById("comorbidDiagnosis").value;
    data.differentialDiagnosis = document.getElementById("differentialDiagnosis").value;
    data.diagnosisJustification = document.getElementById("diagnosisJustification").value;
    // Therapieplanung
    data.therapyGoals = document.getElementById("therapyGoals").value;
    data.plannedInterventions = document.getElementById("plannedInterventions").value;
    data.therapyScope = document.getElementById("therapyScope").value;
    data.prognosis = document.getElementById("prognosis").value;
    // Zusatz
    data.previousCourse = document.getElementById("previousCourse").value;
    data.updatedFindings = document.getElementById("updatedFindings").value;
    data.justification = document.getElementById("justification").value;
    data.changedGoals = document.getElementById("changedGoals").value;
    data.closingPlan = document.getElementById("closingPlan").value;
    // Bericht zusammenbauen
    let report = "";
    // Überschrift
    report += "Bericht an die Gutachterin / den Gutachter\n\n";
    // Antragstyp
    const typeLabel = {
      erst: "Erstantrag",
      umwandlung: "Umwandlungsantrag",
      fortfuehrung: "Fortführungsantrag",
    }[data.applicationType] || "Erstantrag";
    report += `Antragstyp: ${typeLabel}\n\n`;
    report += "1. Soziodemographische Daten\n";
    report += `Patient: ${data.patientInitials || "-"}, Alter: ${data.patientAge || "-"}, Geschlecht: ${data.patientGender || "-"}\n`;
    if (data.occupation) report += `Beruf/Beschäftigung: ${data.occupation}` + (data.workStatus ? ` (${data.workStatus})` : "") + "\n";
    report += `Familienstand: ${data.maritalStatus || "-"}, Kinder: ${data.children || "-"}, Wohnsituation: ${data.livingSituation || "-"}\n`;
    if (data.socialOther) report += `Weitere Angaben: ${data.socialOther}\n`;
    report += "\n2. Symptomatik und subjektiver Leidensdruck\n";
    report += `Hauptgrund: ${data.mainReason || "-"}\n`;
    if (data.symptomPhys) report += `Physiologische Ebene: ${data.symptomPhys}\n`;
    if (data.symptomEmo) report += `Emotionale Ebene: ${data.symptomEmo}\n`;
    if (data.symptomCog) report += `Kognitive Ebene: ${data.symptomCog}\n`;
    if (data.symptomBeh) report += `Verhaltensebene: ${data.symptomBeh}\n`;
    if (data.symptomCourse) report += `Verlauf/Schwere: ${data.symptomCourse}\n`;
    if (data.comorbidities) report += `Komorbiditäten: ${data.comorbidities}\n`;
    if (data.subjectiveDistress) report += `Subjektiver Leidensdruck: ${data.subjectiveDistress}\n`;
    report += "\n3. Psychischer Befund\n";
    if (data.appearance) report += `Äußeres Erscheinungsbild: ${data.appearance}\n`;
    if (data.behaviour) report += `Verhalten / Psychomotorik: ${data.behaviour}\n`;
    if (data.consciousness) report += `Bewusstsein: ${data.consciousness}\n`;
    if (data.orientation) report += `Orientierung: ${data.orientation}\n`;
    if (data.attentionMemory) report += `Aufmerksamkeit & Gedächtnis: ${data.attentionMemory}\n`;
    if (data.thinkingFormal) report += `Formales Denken: ${data.thinkingFormal}\n`;
    if (data.thinkingContent) report += `Inhaltliches Denken: ${data.thinkingContent}\n`;
    if (data.perception) report += `Wahrnehmungsstörungen: ${data.perception}\n`;
    if (data.ichStörungen) report += `Ich‑Störungen: ${data.ichStörungen}\n`;
    if (data.affectivity) report += `Affektivität: ${data.affectivity}\n`;
    if (data.drive) report += `Antrieb & Psychomotorik: ${data.drive}\n`;
    if (data.vegetative) report += `Zirkadiane/vegetative Besonderheiten: ${data.vegetative}\n`;
    if (data.suicidality) report += `Suizidalität / Fremdgefährlichkeit: ${data.suicidality}\n`;
    report += "\n4. Somatischer Befund / Konsiliarbericht\n";
    report += `Konsiliarbericht vorhanden: ${data.consiliar || "-"}\n`;
    if (data.somatic) report += `Relevante Erkrankungen: ${data.somatic}\n`;
    if (data.heightWeight) report += `Körpergröße/Gewicht: ${data.heightWeight}\n`;
    if (data.substanceUse) report += `Substanzkonsum: ${data.substanceUse}\n`;
    if (data.medication) report += `Medikation: ${data.medication}\n`;
    if (data.previousTreatments) report += `Vorbehandlungen: ${data.previousTreatments}\n`;
    report += "\n5. Lebensgeschichte & funktionales Bedingungsmodell\n";
    if (data.lifeHistory) report += `Lebensgeschichte / Krankheitsanamnese: ${data.lifeHistory}\n`;
    if (data.predispositions) report += `Prädispositionen: ${data.predispositions}\n`;
    if (data.triggers) report += `Auslösende Bedingungen: ${data.triggers}\n`;
    if (data.maintenance) report += `Aufrechterhaltende Bedingungen: ${data.maintenance}\n`;
    if (data.sorkc) report += `Verhaltensanalyse / SORKC: ${data.sorkc}\n`;
    report += "\n6. Diagnosen\n";
    if (data.primaryDiagnosis) report += `Primäre Diagnose: ${data.primaryDiagnosis}\n`;
    if (data.comorbidDiagnosis) report += `Weitere Diagnosen: ${data.comorbidDiagnosis}\n`;
    if (data.differentialDiagnosis) report += `Differentialdiagnosen: ${data.differentialDiagnosis}\n`;
    if (data.diagnosisJustification) report += `Begründung: ${data.diagnosisJustification}\n`;
    report += "\n7. Behandlungsplan und Prognose\n";
    if (data.therapyGoals) report += `Therapieziele: ${data.therapyGoals}\n`;
    if (data.plannedInterventions) report += `Interventionen: ${data.plannedInterventions}\n`;
    if (data.therapyScope) report += `Umfang: ${data.therapyScope}\n`;
    if (data.prognosis) report += `Prognose: ${data.prognosis}\n`;
    // Zusatzabschnitt
    if (data.applicationType === "umwandlung" || data.applicationType === "fortfuehrung") {
      report += "\n8. Zusätzliche Angaben\n";
      if (data.previousCourse) report += `Bisheriger Verlauf: ${data.previousCourse}\n`;
      if (data.updatedFindings) report += `Aktueller Befund / Testresultate: ${data.updatedFindings}\n`;
      if (data.justification) report += `Begründung der Fortführung/Umwandlung: ${data.justification}\n`;
      if (data.changedGoals) report += `Geänderte/erweiterte Ziele & Methoden: ${data.changedGoals}\n`;
      if (data.closingPlan) report += `Prognose & Abschlussplanung: ${data.closingPlan}\n`;
    }
    // Ausgabe ins Textfeld
    document.getElementById("reportOutput").value = report;
  }

  // Bericht herunterladen
  function downloadReport() {
    const text = document.getElementById("reportOutput").value;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bericht.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  addNavHandlers();
});