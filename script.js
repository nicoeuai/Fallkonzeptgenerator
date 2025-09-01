// Skript zur Steuerung des mehrstufigen Formulars und zum Generieren des Berichts

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const formContainer = document.getElementById("formContainer");
  // Hero‑Section statt Intro
  const heroSection = document.querySelector(".hero");
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
    if (heroSection) heroSection.classList.add("hidden");
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
    // Erweiterte soziodemographische Angaben
    data.education = document.getElementById("education") ? document.getElementById("education").value : "";
    data.housingType = document.getElementById("housingType") ? document.getElementById("housingType").value : "";
    data.partnerDetails = document.getElementById("partnerDetails") ? document.getElementById("partnerDetails").value : "";
    data.financialSituation = document.getElementById("financialSituation") ? document.getElementById("financialSituation").value : "";
    data.financialOther = document.getElementById("financialOther") ? document.getElementById("financialOther").value : "";
    data.socialNetwork = getSelectValues("socialNetwork");
    data.socialNetworkOther = document.getElementById("socialNetworkOther") ? document.getElementById("socialNetworkOther").value : "";
    data.workHours = document.getElementById("workHours") ? document.getElementById("workHours").value : "";
    data.vacationUsage = document.getElementById("vacationUsage") ? document.getElementById("vacationUsage").value : "";
    data.disabilityPension = document.getElementById("disabilityPension") ? document.getElementById("disabilityPension").value : "";
    // Symptomatik
    data.mainReason = document.getElementById("mainReason").value;
    // Physiologische Ebene
    data.symptomPhys = getSelectValues("symptomPhysList");
    data.symptomPhysOther = document.getElementById("symptomPhysOther").value;
    // Emotionale Ebene
    data.symptomEmo = getSelectValues("symptomEmoList");
    data.symptomEmoOther = document.getElementById("symptomEmoOther").value;
    // Kognitive Ebene
    data.symptomCog = getSelectValues("symptomCogList");
    data.symptomCogOther = document.getElementById("symptomCogOther").value;
    // Verhaltensebene
    data.symptomBeh = getSelectValues("symptomBehList");
    data.symptomBehOther = document.getElementById("symptomBehOther").value;
    // Verlauf/Schwere
    data.symptomCourse = getSelectValues("symptomCourseList");
    data.symptomCourseOther = document.getElementById("symptomCourseOther").value;
    // Komorbiditäten
    data.comorbidities = getSelectValues("comorbiditiesList");
    data.comorbiditiesOther = document.getElementById("comorbiditiesOther").value;
    // Subjektiver Leidensdruck
    data.subjectiveDistress = document.getElementById("subjectiveDistressLevel").value;
    data.subjectiveDistressNotes = document.getElementById("subjectiveDistressNotes").value;

    // Zusätzliche Angaben: Störungs- & Familienanamnese, Testdaten und Therapievariablen
    data.familyHistory = getSelectValues("familyHistoryList");
    data.familyHistoryOther = document.getElementById("familyHistoryOther") ? document.getElementById("familyHistoryOther").value : "";
    data.firstOnset = document.getElementById("firstOnset") ? document.getElementById("firstOnset").value : "";
    data.courseDescription = document.getElementById("courseDescription") ? document.getElementById("courseDescription").value : "";
    data.testBDI = document.getElementById("testBDI") ? document.getElementById("testBDI").value : "";
    data.testBSI = document.getElementById("testBSI") ? document.getElementById("testBSI").value : "";
    data.testINK = document.getElementById("testINK") ? document.getElementById("testINK").value : "";
    data.testOther = document.getElementById("testOther") ? document.getElementById("testOther").value : "";
    data.motivationLevel = document.getElementById("motivationLevel") ? document.getElementById("motivationLevel").value : "";
    data.introspectionAbility = document.getElementById("introspectionAbility") ? document.getElementById("introspectionAbility").value : "";
    data.empathyAbility = document.getElementById("empathyAbility") ? document.getElementById("empathyAbility").value : "";
    data.illnessInsight = document.getElementById("illnessInsight") ? document.getElementById("illnessInsight").value : "";
    data.changeAbility = document.getElementById("changeAbility") ? document.getElementById("changeAbility").value : "";
    // Befund
    // Helfer, um Mehrfachauswahl aus <select multiple> zu extrahieren
    function getSelectValues(selectId) {
      const element = document.getElementById(selectId);
      const values = [];
      // Wenn ein Select vorhanden ist (klassische Mehrfachauswahl)
      if (element && element.options) {
        for (const option of element.options) {
          if (option.selected && option.value) {
            values.push(option.value);
          }
        }
        return values;
      }
      // Ansonsten versuchen wir, Checkboxen mit entsprechendem Namen zu sammeln
      const checkboxes = document.querySelectorAll('input[name="' + selectId + '"]:checked');
      checkboxes.forEach(cb => {
        if (cb.value) {
          values.push(cb.value);
        }
      });
      return values;
    }
    data.appearance = getSelectValues("appearance");
    data.behaviour = getSelectValues("behaviour");
    data.consciousness = document.getElementById("consciousness").value;
    data.orientation = getSelectValues("orientation");
    data.attentionMemory = getSelectValues("attentionMemory");
    data.thinkingFormal = getSelectValues("thinkingFormal");
    data.thinkingContent = getSelectValues("thinkingContent");
    data.perception = getSelectValues("perception");
    data.ichStoerungen = getSelectValues("ichStoerungen");
    data.affectivity = getSelectValues("affectivity");
    data.drive = document.getElementById("drive").value;
    data.vegetative = getSelectValues("vegetative");
    // Suizidalität / Fremdgefährlichkeit
    data.suicideIdeation = document.getElementById("suicideIdeation").value;
    data.suicideAttempts = document.getElementById("suicideAttempts").value;
    data.harmOthers = document.getElementById("harmOthers").value;
    data.suicideNotes = document.getElementById("suicideNotes").value;
    // Somatik
    data.consiliar = document.getElementById("consiliar").value;
    data.somaticConditions = getSelectValues("somaticConditions");
    data.somaticOther = document.getElementById("somaticOther") ? document.getElementById("somaticOther").value : "";
    data.heightWeight = document.getElementById("heightWeight").value;
    data.substanceUse = getSelectValues("substanceUseList");
    data.substanceUseOther = document.getElementById("substanceUseOther") ? document.getElementById("substanceUseOther").value : "";
    data.medication = getSelectValues("medicationList");
    data.medicationOther = document.getElementById("medicationOther") ? document.getElementById("medicationOther").value : "";
    data.previousTreatments = getSelectValues("previousTreatmentsList");
    data.previousTreatmentsOther = document.getElementById("previousTreatmentsOther") ? document.getElementById("previousTreatmentsOther").value : "";
    // Zusätzliche Details zum Konsum, pathologischen Befunden und bisherigen Psychotherapien
    data.substanceDetails = document.getElementById("substanceDetails") ? document.getElementById("substanceDetails").value : "";
    data.pathologicalFindings = document.getElementById("pathologicalFindings") ? document.getElementById("pathologicalFindings").value : "";
    data.previousPsychotherapyDetails = document.getElementById("previousPsychotherapyDetails") ? document.getElementById("previousPsychotherapyDetails").value : "";
    // Lebensgeschichte & funktionales Modell
    data.lifeInfluences = getSelectValues("lifeInfluences");
    data.lifeInfluencesOther = document.getElementById("lifeInfluencesOther") ? document.getElementById("lifeInfluencesOther").value : "";
    data.predispositionsList = getSelectValues("predispositionsList");
    data.predispositionsOther = document.getElementById("predispositionsOther") ? document.getElementById("predispositionsOther").value : "";
    data.triggersList = getSelectValues("triggersList");
    data.triggersOther = document.getElementById("triggersOther") ? document.getElementById("triggersOther").value : "";
    data.maintenanceBehaviors = getSelectValues("maintenanceBehaviors");
    data.maintenanceOther = document.getElementById("maintenanceOther") ? document.getElementById("maintenanceOther").value : "";
    data.resources = getSelectValues("resources");
    data.resourcesOther = document.getElementById("resourcesOther") ? document.getElementById("resourcesOther").value : "";
    data.sorkc = document.getElementById("sorkc").value;
    // Familienstruktur und prägende Erfahrungen
    data.familyBackground = document.getElementById("familyBackground") ? document.getElementById("familyBackground").value : "";
    // Diagnosen
    data.primaryDiagnosis = document.getElementById("primaryDiagnosisSelect").value;
    data.primaryDiagnosisOther = document.getElementById("primaryDiagnosisOther") ? document.getElementById("primaryDiagnosisOther").value : "";
    data.primaryDiagnosisStatus = document.getElementById("primaryDiagnosisStatus") ? document.getElementById("primaryDiagnosisStatus").value : "";
    data.comorbidDiagnosis = getSelectValues("comorbidDiagnosisList");
    data.comorbidDiagnosisOther = document.getElementById("comorbidDiagnosisOther") ? document.getElementById("comorbidDiagnosisOther").value : "";
    data.differentialDiagnosis = getSelectValues("differentialDiagnosisList");
    data.differentialDiagnosisOther = document.getElementById("differentialDiagnosisOther") ? document.getElementById("differentialDiagnosisOther").value : "";
    data.diagnosisJustification = getSelectValues("diagnosisJustificationList");
    data.diagnosisJustificationOther = document.getElementById("diagnosisJustificationOther") ? document.getElementById("diagnosisJustificationOther").value : "";
    // Weitere Angaben zu Diagnosen
    data.somaticDiagnoses = document.getElementById("somaticDiagnoses") ? document.getElementById("somaticDiagnoses").value : "";
    data.emotionalProblems = document.getElementById("emotionalProblems") ? document.getElementById("emotionalProblems").value : "";
    // Therapieplanung
    data.therapyGoals = getSelectValues("therapyGoalsList");
    data.therapyGoalsOther = document.getElementById("therapyGoalsOther") ? document.getElementById("therapyGoalsOther").value : "";
    data.plannedInterventions = getSelectValues("plannedInterventionsList");
    data.plannedInterventionsOther = document.getElementById("plannedInterventionsOther") ? document.getElementById("plannedInterventionsOther").value : "";
    data.therapyScope = document.getElementById("therapyScopeSelect").value;
    data.therapyScopeOther = document.getElementById("therapyScopeOther") ? document.getElementById("therapyScopeOther").value : "";
    data.prognosisPositive = getSelectValues("prognosisPositive");
    data.prognosisPositiveOther = document.getElementById("prognosisPositiveOther") ? document.getElementById("prognosisPositiveOther").value : "";
    data.prognosisNegative = getSelectValues("prognosisNegative");
    data.prognosisNegativeOther = document.getElementById("prognosisNegativeOther") ? document.getElementById("prognosisNegativeOther").value : "";
    // Zusatz
    data.previousCourse = document.getElementById("previousCourse").value;
    data.updatedFindings = getSelectValues("updatedFindingsList");
    data.updatedFindingsOther = document.getElementById("updatedFindingsOther") ? document.getElementById("updatedFindingsOther").value : "";
    data.justification = getSelectValues("justificationList");
    data.justificationOther = document.getElementById("justificationOther") ? document.getElementById("justificationOther").value : "";
    data.changedGoals = getSelectValues("changedGoalsList");
    data.changedGoalsOther = document.getElementById("changedGoalsOther") ? document.getElementById("changedGoalsOther").value : "";
    data.closingPlan = getSelectValues("closingPlanList");
    data.closingPlanOther = document.getElementById("closingPlanOther") ? document.getElementById("closingPlanOther").value : "";
    // Bericht zusammenbauen
    // Hilfsfunktionen zum Kombinieren von Listen und "Weitere"-Feldern
    const joinList = (arr) => Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "";
    const listWithOther = (arr, other) => {
      const items = [];
      if (Array.isArray(arr) && arr.length > 0) {
        items.push(...arr);
      }
      if (other && other.trim() !== "") {
        items.push(other.trim());
      }
      return items.length > 0 ? items.join(", ") : "";
    };

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

    // 1. Soziodemographische Daten
    report += "1. Soziodemographische Daten\n";
    report += `Patient: ${data.patientInitials || "-"}, Alter: ${data.patientAge || "-"}, Geschlecht: ${data.patientGender || "-"}\n`;
    if (data.occupation) {
      report += `Beruf/Beschäftigung: ${data.occupation}`;
      if (data.workStatus) report += ` (${data.workStatus})`;
      report += "\n";
    }
    // Erweiterte soziodemographische Angaben
    if (data.education) report += `Bildungsabschluss: ${data.education}\n`;
    if (data.housingType) report += `Wohnform/Eigentum: ${data.housingType}\n`;
    if (data.partnerDetails) report += `Partnersituation: ${data.partnerDetails}\n`;
    // Familienstand, Kinder, Wohnsituation
    report += `Familienstand: ${data.maritalStatus || "-"}, Kinder: ${data.children || "-"}, Wohnsituation: ${data.livingSituation || "-"}\n`;
    // Finanzen
    if (data.financialSituation) {
      report += `Finanzielle Situation: ${data.financialSituation}`;
      if (data.financialOther) report += ` (${data.financialOther})`;
      report += "\n";
    }
    // Sozialer Freundeskreis & Freizeit
    const socialNetStr = listWithOther(data.socialNetwork, data.socialNetworkOther);
    if (socialNetStr) report += `Freundeskreis/Freizeit: ${socialNetStr}\n`;
    if (data.workHours) report += `Arbeitszeit/Bedingungen: ${data.workHours}\n`;
    if (data.vacationUsage) report += `Urlaubsnutzung: ${data.vacationUsage}\n`;
    if (data.disabilityPension) report += `GdB/Rentenbegehren: ${data.disabilityPension}\n`;
    if (data.socialOther) report += `Weitere soziale Angaben: ${data.socialOther}\n`;

    // 2. Symptomatik und subjektiver Leidensdruck
    report += "\n2. Symptomatik und subjektiver Leidensdruck\n";
    report += `Hauptgrund: ${data.mainReason || "-"}\n`;
    const physStr = listWithOther(data.symptomPhys, data.symptomPhysOther);
    if (physStr) report += `Physiologische Ebene: ${physStr}\n`;
    const emoStr = listWithOther(data.symptomEmo, data.symptomEmoOther);
    if (emoStr) report += `Emotionale Ebene: ${emoStr}\n`;
    const cogStr = listWithOther(data.symptomCog, data.symptomCogOther);
    if (cogStr) report += `Kognitive Ebene: ${cogStr}\n`;
    const behStr = listWithOther(data.symptomBeh, data.symptomBehOther);
    if (behStr) report += `Verhaltensebene: ${behStr}\n`;
    const courseStr = listWithOther(data.symptomCourse, data.symptomCourseOther);
    if (courseStr) report += `Verlauf/Schweregrad: ${courseStr}\n`;
    const comorbStr = listWithOther(data.comorbidities, data.comorbiditiesOther);
    if (comorbStr) report += `Weitere Beschwerden/Komorbiditäten: ${comorbStr}\n`;
    if (data.subjectiveDistress) {
      report += `Subjektiver Leidensdruck: ${data.subjectiveDistress}`;
      if (data.subjectiveDistressNotes) report += ` (Anmerkungen: ${data.subjectiveDistressNotes})`;
      report += "\n";
    }

    // 2a. Störungs- & Familienanamnese, Testdaten und Therapievariablen
    if (data.familyHistory || data.familyHistoryOther || data.firstOnset || data.courseDescription || data.testBDI || data.testBSI || data.testINK || data.testOther || data.familyBackground || data.motivationLevel || data.introspectionAbility || data.empathyAbility || data.illnessInsight || data.changeAbility) {
      report += "\n2a. Störungs- & Familienanamnese, Testdaten und Therapievariablen\n";
      const familyHistStr = listWithOther(data.familyHistory, data.familyHistoryOther);
      if (familyHistStr) report += `Familienanamnese: ${familyHistStr}\n`;
      if (data.familyBackground) report += `Familienstruktur/Kindheit: ${data.familyBackground}\n`;
      if (data.firstOnset) report += `Beginn der Störung: ${data.firstOnset}\n`;
      if (data.courseDescription) report += `Verlauf & frühere Episoden: ${data.courseDescription}\n`;
      // Testdaten
      const testParts = [];
      if (data.testBDI) testParts.push(`BDI-II: ${data.testBDI}`);
      if (data.testBSI) testParts.push(`BSI: ${data.testBSI}`);
      if (data.testINK) testParts.push(`INK: ${data.testINK}`);
      if (data.testOther) testParts.push(`Andere Tests: ${data.testOther}`);
      if (testParts.length > 0) report += `Testwerte: ${testParts.join(", ")}\n`;
      // Therapievariablen
      const tvars = [];
      if (data.motivationLevel) tvars.push(`Motivation: ${data.motivationLevel}`);
      if (data.introspectionAbility) tvars.push(`Introspektionsfähigkeit: ${data.introspectionAbility}`);
      if (data.empathyAbility) tvars.push(`Empathiefähigkeit: ${data.empathyAbility}`);
      if (data.illnessInsight) tvars.push(`Krankheitseinsicht: ${data.illnessInsight}`);
      if (data.changeAbility) tvars.push(`Veränderungsfähigkeit: ${data.changeAbility}`);
      if (tvars.length > 0) report += `Therapievariablen: ${tvars.join(", ")}\n`;
    }

    // 3. Psychischer Befund
    report += "\n3. Psychischer Befund\n";
    const appearanceStr2 = joinList(data.appearance);
    if (appearanceStr2) report += `Äußeres Erscheinungsbild: ${appearanceStr2}\n`;
    const behaviourStr2 = joinList(data.behaviour);
    if (behaviourStr2) report += `Verhalten/Psychomotorik: ${behaviourStr2}\n`;
    if (data.consciousness) report += `Bewusstsein: ${data.consciousness}\n`;
    const orientationStr2 = joinList(data.orientation);
    if (orientationStr2) report += `Orientierung: ${orientationStr2}\n`;
    const attentionStr2 = joinList(data.attentionMemory);
    if (attentionStr2) report += `Aufmerksamkeit & Gedächtnis: ${attentionStr2}\n`;
    const thinkingFormalStr2 = joinList(data.thinkingFormal);
    if (thinkingFormalStr2) report += `Formales Denken: ${thinkingFormalStr2}\n`;
    const thinkingContentStr2 = joinList(data.thinkingContent);
    if (thinkingContentStr2) report += `Inhaltliches Denken: ${thinkingContentStr2}\n`;
    const perceptionStr2 = joinList(data.perception);
    if (perceptionStr2) report += `Wahrnehmungsstörungen: ${perceptionStr2}\n`;
    const ichStr2 = joinList(data.ichStoerungen);
    if (ichStr2) report += `Ich‑Störungen: ${ichStr2}\n`;
    const affectivityStr2 = joinList(data.affectivity);
    if (affectivityStr2) report += `Affektivität: ${affectivityStr2}\n`;
    if (data.drive) report += `Antrieb/Psychomotorik: ${data.drive}\n`;
    const vegetativeStr2 = joinList(data.vegetative);
    if (vegetativeStr2) report += `Zirkadiane/vegetative Besonderheiten: ${vegetativeStr2}\n`;
    // Suizidalität/Fremdgefährdung
    if (data.suicideIdeation || data.suicideAttempts || data.harmOthers || data.suicideNotes) {
      report += `Suizidalität/Fremdgefährdung: Suizidgedanken: ${data.suicideIdeation || "-"}; Frühere Suizidversuche: ${data.suicideAttempts || "-"}; Fremdgefährdung: ${data.harmOthers || "-"}`;
      if (data.suicideNotes) report += `; Anmerkungen: ${data.suicideNotes}`;
      report += "\n";
    }

    // 4. Somatischer Befund / Konsiliarbericht
    report += "\n4. Somatischer Befund / Konsiliarbericht\n";
    report += `Konsiliarbericht vorhanden: ${data.consiliar || "-"}\n`;
    const somaticStr = listWithOther(data.somaticConditions, data.somaticOther);
    if (somaticStr) report += `Relevante körperliche Erkrankungen/Behinderungen: ${somaticStr}\n`;
    if (data.heightWeight) report += `Körpergröße/Gewicht: ${data.heightWeight}\n`;
    const substanceStr = listWithOther(data.substanceUse, data.substanceUseOther);
    if (substanceStr) report += `Substanzkonsum: ${substanceStr}\n`;
    const medicationStr = listWithOther(data.medication, data.medicationOther);
    if (medicationStr) report += `Medikation: ${medicationStr}\n`;
    const prevTreatStr = listWithOther(data.previousTreatments, data.previousTreatmentsOther);
    if (prevTreatStr) report += `Vorbehandlungen: ${prevTreatStr}\n`;
    // Weitere somatische Angaben
    if (data.substanceDetails) report += `Konsumdetails: ${data.substanceDetails}\n`;
    if (data.pathologicalFindings) report += `Pathologische Befunde: ${data.pathologicalFindings}\n`;
    if (data.previousPsychotherapyDetails) report += `Bisherige psychotherapeutische Behandlungen (Details): ${data.previousPsychotherapyDetails}\n`;

    // 5. Lebensgeschichte & funktionales Bedingungsmodell
    report += "\n5. Lebensgeschichte & funktionales Bedingungsmodell\n";
    const lifeInfStr = listWithOther(data.lifeInfluences, data.lifeInfluencesOther);
    if (lifeInfStr) report += `Lebensgeschichtliche Einflüsse: ${lifeInfStr}\n`;
    const predisStr = listWithOther(data.predispositionsList, data.predispositionsOther);
    if (predisStr) report += `Prädispositionen/ langfristige Faktoren: ${predisStr}\n`;
    const triggersStr = listWithOther(data.triggersList, data.triggersOther);
    if (triggersStr) report += `Auslösende Bedingungen: ${triggersStr}\n`;
    const maintStr = listWithOther(data.maintenanceBehaviors, data.maintenanceOther);
    if (maintStr) report += `Aufrechterhaltende Bedingungen: ${maintStr}\n`;
    const resourcesStr = listWithOther(data.resources, data.resourcesOther);
    if (resourcesStr) report += `Ressourcen/Stärken: ${resourcesStr}\n`;
    if (data.sorkc) report += `Verhaltensanalyse (SORKC): ${data.sorkc}\n`;

    // 6. Diagnosen
    report += "\n6. Diagnosen\n";
    // Primäre Diagnose
    let primaryDiag = "";
    if (data.primaryDiagnosis === "Andere" && data.primaryDiagnosisOther) {
      primaryDiag = data.primaryDiagnosisOther;
    } else {
      primaryDiag = data.primaryDiagnosis || data.primaryDiagnosisOther || "";
    }
    if (primaryDiag) {
      report += `Primäre Diagnose: ${primaryDiag}`;
      if (data.primaryDiagnosisStatus) report += ` (Status: ${data.primaryDiagnosisStatus})`;
      report += "\n";
    }
    const comorbidDiagStr = listWithOther(data.comorbidDiagnosis, data.comorbidDiagnosisOther);
    if (comorbidDiagStr) report += `Weitere Diagnosen/Komorbiditäten: ${comorbidDiagStr}\n`;
    const diffDiagStr = listWithOther(data.differentialDiagnosis, data.differentialDiagnosisOther);
    if (diffDiagStr) report += `Differentialdiagnosen: ${diffDiagStr}\n`;
    const diagJustifStr = listWithOther(data.diagnosisJustification, data.diagnosisJustificationOther);
    if (diagJustifStr) report += `Begründung der Diagnose(n): ${diagJustifStr}\n`;

    // Somatische Diagnosen und emotionale Probleme
    if (data.somaticDiagnoses) report += `Somatische Diagnosen: ${data.somaticDiagnoses}\n`;
    if (data.emotionalProblems) report += `Emotionale Probleme/Kernprobleme: ${data.emotionalProblems}\n`;

    // 7. Behandlungsplan und Prognose
    report += "\n7. Behandlungsplan und Prognose\n";
    const therapyGoalsStr = listWithOther(data.therapyGoals, data.therapyGoalsOther);
    if (therapyGoalsStr) report += `Therapieziele: ${therapyGoalsStr}\n`;
    const interventionsStr = listWithOther(data.plannedInterventions, data.plannedInterventionsOther);
    if (interventionsStr) report += `Geplante Interventionen: ${interventionsStr}\n`;
    const scopeStr = data.therapyScope || data.therapyScopeOther;
    if (scopeStr) report += `Beantragter Therapieumfang: ${scopeStr}\n`;
    // Prognose
    const progPosStr = listWithOther(data.prognosisPositive, data.prognosisPositiveOther);
    const progNegStr = listWithOther(data.prognosisNegative, data.prognosisNegativeOther);
    if (progPosStr || progNegStr) {
      report += `Prognose – förderliche Faktoren: ${progPosStr || "-"}, hindernde Faktoren: ${progNegStr || "-"}\n`;
    }

    // 8. Zusatzabschnitt für Umwandlung/Fortführung
    if (data.applicationType === "umwandlung" || data.applicationType === "fortfuehrung") {
      report += "\n8. Zusätzliche Angaben bei Umwandlungs-/Fortführungsanträgen\n";
      if (data.previousCourse) report += `Bisheriger Behandlungsverlauf: ${data.previousCourse}\n`;
      const updatedFindStr = listWithOther(data.updatedFindings, data.updatedFindingsOther);
      if (updatedFindStr) report += `Aktueller psychischer Befund/Testresultate: ${updatedFindStr}\n`;
      const justificationStr = listWithOther(data.justification, data.justificationOther);
      if (justificationStr) report += `Begründung der Fortführung/Umwandlung: ${justificationStr}\n`;
      const changedGoalsStr2 = listWithOther(data.changedGoals, data.changedGoalsOther);
      if (changedGoalsStr2) report += `Geänderte oder erweiterte Ziele/Methoden: ${changedGoalsStr2}\n`;
      const closingPlanStr = listWithOther(data.closingPlan, data.closingPlanOther);
      if (closingPlanStr) report += `Prognose, Abschlussplanung und weiterführende Maßnahmen: ${closingPlanStr}\n`;
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

  // Nachdem die Navigation eingerichtet ist, initialisieren wir die Checkbox‑Labels.
  // Jede Checkbox innerhalb einer `.checkbox-group` erhält einen Click‑Listener, der
  // die Klasse `.checked` am zugehörigen Label setzt oder entfernt. Dies sorgt für
  // eine visuelle Rückmeldung (Invertierung der Farbe) bei Auswahl.
  function setupCheckboxLabels() {
    const checkboxInputs = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    checkboxInputs.forEach((cb) => {
      const label = cb.parentElement;
      // Initialstatus setzen
      if (cb.checked) {
        label.classList.add('checked');
      }
      // Bei Änderung Klasse toggeln
      cb.addEventListener('change', () => {
        if (cb.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });
    });
  }
  setupCheckboxLabels();

  // Dark/Light‑Modus Umschalter
  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      // Symbol anpassen je nach Modus
      if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "☀️";
      } else {
        themeToggleBtn.textContent = "🌙";
      }
    });
  }
});