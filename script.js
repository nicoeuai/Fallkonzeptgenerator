// Skript zur Steuerung des mehrstufigen Formulars und zum Generieren des Berichts

// Für die KI‑Zusammenfassung verwenden wir das Transformers‑JS‑Paket von Hugging Face.
// Um sicherzustellen, dass das restliche Skript auch ohne Netzwerkverbindung läuft, laden wir
// das Modul erst dynamisch, wenn der Benutzer die KI‑Funktion nutzt.

// Globale Variable für den Summarizer. Dieser wird lazy‑initialisiert, sobald der Nutzer
// erstmals den KI‑Button anklickt. Die Verwendung einer kleinen T5‑Variante mit quantisierter
// Genauigkeit (dtype: 'q4') reduziert die Ladezeit und Ressourcen auf mobilen Geräten.
let summarizer;
async function getSummarizer() {
  if (!summarizer) {
    // Dynamischer Import des Transformers‑Pipelines, damit das Script ohne Netzwerk weiterhin funktioniert.
    const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2/dist/transformers.esm.min.js');
    summarizer = await pipeline('summarization', 'Xenova/t5-small', { dtype: 'q4' });
  }
  return summarizer;
}

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("startButton");
  const formContainer = document.getElementById("formContainer");
  // Hero‑Section statt Intro
  const heroSection = document.querySelector(".hero");
  const steps = document.querySelectorAll(".form-step");
  let currentStep = 0;
  const progressEl = document.getElementById("progress");
  const totalSteps = steps.length - 1;

  // Header Menü
  const menuToggle = document.querySelector(".menu-toggle");
  const headerMenu = document.getElementById("headerMenu");
  const menuItems = headerMenu ? headerMenu.querySelectorAll("li") : [];

  // Geschlechtsauswahl: zeigt optionales Textfeld bei Auswahl "selbst angegeben"
  const genderSelect = document.getElementById("patientGender");
  const genderOtherInput = document.getElementById("patientGenderOther");
  if (genderSelect && genderOtherInput) {
    genderSelect.addEventListener("change", () => {
      if (genderSelect.value === "selbst") {
        genderOtherInput.classList.remove("hidden");
      } else {
        genderOtherInput.classList.add("hidden");
        genderOtherInput.value = "";
      }
    });
  }

  // Bildungsabschluss: Zeigt optionales Textfeld bei Auswahl "Andere"
  const educationSelectEl = document.getElementById("education");
  const educationOtherInput = document.getElementById("educationOther");
  if (educationSelectEl && educationOtherInput) {
    educationSelectEl.addEventListener("change", () => {
      if (educationSelectEl.value === "Andere") {
        educationOtherInput.classList.remove("hidden");
      } else {
        educationOtherInput.classList.add("hidden");
        educationOtherInput.value = "";
      }
    });
  }

  // Partnersituation: Zeigt optionales Textfeld bei Auswahl "Andere"
  const partnerStatusEl = document.getElementById("partnerStatus");
  const partnerOtherInput = document.getElementById("partnerOther");
  if (partnerStatusEl && partnerOtherInput) {
    partnerStatusEl.addEventListener("change", () => {
      if (partnerStatusEl.value === "Andere") {
        partnerOtherInput.classList.remove("hidden");
      } else {
        partnerOtherInput.classList.add("hidden");
        partnerOtherInput.value = "";
      }
    });
  }

  // Hilfsfunktion zum Anzeigen eines bestimmten Schritts
  function showStep(stepIndex) {
    if (heroSection) heroSection.classList.add("hidden");
    if (formContainer) formContainer.classList.remove("hidden");
    steps.forEach((step) => step.classList.remove("active"));
    const target = document.querySelector(`.form-step[data-step="${stepIndex}"]`);
    if (target) {
      target.classList.add("active");
      currentStep = stepIndex;
      if (progressEl) {
        const percent = (stepIndex / totalSteps) * 100;
        progressEl.style.width = `${percent}%`;
      }
      if (stepIndex === 9) {
        compileReport();
      }
      // Aktives Element in der Navigationsleiste markieren
      menuItems.forEach((item) => item.classList.remove("active"));
      const activeItem = Array.from(menuItems).find(
        (item) => parseInt(item.dataset.step, 10) === stepIndex
      );
      if (activeItem) activeItem.classList.add("active");
    }
  }

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      const step = parseInt(item.dataset.step, 10);
      showStep(step);
      if (headerMenu) headerMenu.classList.remove("open");
    });
  });

  if (menuToggle && headerMenu) {
    menuToggle.addEventListener("click", () => {
      headerMenu.classList.toggle("open");
    });
  }

  // Start: Fragebogen anzeigen
  startButton.addEventListener("click", () => {
    if (heroSection) heroSection.classList.add("hidden");
    formContainer.classList.remove("hidden");
    if (headerMenu) headerMenu.classList.add("open");
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
    // Geschlecht: wenn "selbst angegeben" gewählt, nutze Freitextfeld
    const genderSelectEl = document.getElementById("patientGender");
    const genderOtherEl = document.getElementById("patientGenderOther");
    if (genderSelectEl) {
      const selectedGender = genderSelectEl.value;
      if (selectedGender === "selbst") {
        data.patientGender = genderOtherEl ? genderOtherEl.value : "";
      } else {
        data.patientGender = selectedGender;
      }
    } else {
      data.patientGender = "";
    }
    data.occupation = document.getElementById("occupation").value;
    data.workStatus = document.getElementById("workStatus").value;
    data.maritalStatus = document.getElementById("maritalStatus").value;
    data.children = document.getElementById("children").value;
    data.livingSituation = document.getElementById("livingSituation").value;
    // "Weitere"-Freitextangaben werden später gesammelt
    // Erweiterte soziodemographische Angaben
    // Bildungsabschluss: bei "Andere" den spezifischen Text übernehmen
    const educationSel = document.getElementById("education");
    const educationOtherEl2 = document.getElementById("educationOther");
    if (educationSel) {
      if (educationSel.value === "Andere") {
        data.education = educationOtherEl2 ? educationOtherEl2.value : "";
      } else {
        data.education = educationSel.value;
      }
    } else {
      data.education = "";
    }
    data.housingType = document.getElementById("housingType") ? document.getElementById("housingType").value : "";
    // Partnersituation: wenn "Andere", nutze Freitextfeld
    const partnerStatusEl2 = document.getElementById("partnerStatus");
    const partnerOtherEl2 = document.getElementById("partnerOther");
    if (partnerStatusEl2) {
      if (partnerStatusEl2.value === "Andere") {
        data.partnerDetails = partnerOtherEl2 ? partnerOtherEl2.value : "";
      } else {
        data.partnerDetails = partnerStatusEl2.value;
      }
    } else {
      data.partnerDetails = "";
    }
    data.financialSituation = document.getElementById("financialSituation") ? document.getElementById("financialSituation").value : "";
    data.socialNetwork = getSelectValues("socialNetwork");
    data.workHours = document.getElementById("workHours") ? document.getElementById("workHours").value : "";
    data.vacationUsage = document.getElementById("vacationUsage") ? document.getElementById("vacationUsage").value : "";
    const disabilityRadio = document.querySelector('input[name="disabilityPension"]:checked');
    data.disabilityPension = disabilityRadio ? disabilityRadio.value : "";
    // Symptomatik
    data.mainReason = document.getElementById("mainReason").value;
    // Physiologische Ebene
    data.symptomPhys = getSelectValues("symptomPhysList");
    data.symptomEmo = getSelectValues("symptomEmoList");
    data.symptomCog = getSelectValues("symptomCogList");
    data.symptomBeh = getSelectValues("symptomBehList");
    data.symptomCourse = getSelectValues("symptomCourseList");
    data.comorbidities = getSelectValues("comorbiditiesList");
    const distressRadio = document.querySelector('input[name="subjectiveDistressLevel"]:checked');
    data.subjectiveDistress = distressRadio ? distressRadio.value : "";
    data.subjectiveDistressNotes = document.getElementById("subjectiveDistressNotes").value;

    // Zusätzliche Angaben: Störungs- & Familienanamnese, Testdaten und Therapievariablen
    data.familyHistory = getSelectValues("familyHistoryList");
    data.firstOnset = document.getElementById("firstOnset") ? document.getElementById("firstOnset").value : "";
    data.courseDescription = document.getElementById("courseDescription") ? document.getElementById("courseDescription").value : "";
    data.tests = [];
    const testNames = document.querySelectorAll('input[name="testName[]"]');
    const testValues = document.querySelectorAll('input[name="testValue[]"]');
    const testTypes = document.querySelectorAll('input[name="testType[]"]');
    testNames.forEach((tn, idx) => {
      const name = tn.value.trim();
      const value = testValues[idx] ? testValues[idx].value.trim() : "";
      const type = testTypes[idx] ? testTypes[idx].value.trim() : "";
      if (name || value || type) {
        data.tests.push({ name, value, type });
      }
    });
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
    function hasConflicts(d) {
      const issues = [];
      const social = d.socialNetwork || [];
      if (social.includes('kein Freundeskreis') && (social.includes('kleiner Freundeskreis') || social.includes('mittlerer Freundeskreis') || social.includes('großer Freundeskreis'))) {
        issues.push('Konflikt bei Freundeskreis-Angaben');
      }
      if (issues.length > 0) {
        alert(issues.join('\n'));
        return true;
      }
      return false;
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
    data.heightWeight = document.getElementById("heightWeight").value;
    data.substanceUse = getSelectValues("substanceUseList");
    data.medication = getSelectValues("medicationList");
    data.previousTreatments = getSelectValues("previousTreatmentsList");
    // Zusätzliche Details zum Konsum, pathologischen Befunden und bisherigen Psychotherapien
    data.substanceDetails = document.getElementById("substanceDetails") ? document.getElementById("substanceDetails").value : "";
    data.pathologicalFindings = document.getElementById("pathologicalFindings") ? document.getElementById("pathologicalFindings").value : "";
    data.previousPsychotherapyDetails = document.getElementById("previousPsychotherapyDetails") ? document.getElementById("previousPsychotherapyDetails").value : "";
    // Lebensgeschichte & funktionales Modell
    data.lifeInfluences = getSelectValues("lifeInfluences");
    data.predispositionsList = getSelectValues("predispositionsList");
    data.triggersList = getSelectValues("triggersList");
    data.maintenanceBehaviors = getSelectValues("maintenanceBehaviors");
    data.resources = getSelectValues("resources");
    // SORKC Felder (dynamische Einträge)
    data.sorkcEntries = [];
    document.querySelectorAll("#sorkcContainer .sorkc-entry").forEach((entry) => {
      const situation = entry.querySelector(".sorkcSituation")?.value || "";
      const organism = entry.querySelector(".sorkcOrganism")?.value || "";
      const reaction = entry.querySelector(".sorkcReaction")?.value || "";
      const short = [];
      entry.querySelectorAll(".short-consequences .consequence-item").forEach((item) => {
        const type = item.querySelector(".consequence-type")?.value || "";
        const text = item.querySelector(".consequence-text")?.value || "";
        if (type || text) short.push({ type: type, text: text });
      });
      const long = [];
      entry.querySelectorAll(".long-consequences .consequence-item").forEach((item) => {
        const type = item.querySelector(".consequence-type")?.value || "";
        const text = item.querySelector(".consequence-text")?.value || "";
        if (type || text) long.push({ type: type, text: text });
      });
      data.sorkcEntries.push({
        situation: situation,
        organism: organism,
        reaction: reaction,
        short: short,
        long: long,
      });
    });
    // Zusätzliche Anamnesen und Störungsmodell (Step 5)
    data.schoolHistory = document.getElementById("schoolHistory") ? document.getElementById("schoolHistory").value : "";
    data.illnessHistory = document.getElementById("illnessHistory") ? document.getElementById("illnessHistory").value : "";
    data.modelPredisposing = document.getElementById("modelPredisposing") ? document.getElementById("modelPredisposing").value : "";
    data.modelTrigger = document.getElementById("modelTrigger") ? document.getElementById("modelTrigger").value : "";
    data.modelMaintaining = document.getElementById("modelMaintaining") ? document.getElementById("modelMaintaining").value : "";
    // Familienstruktur und prägende Erfahrungen
    data.familyBackground = document.getElementById("familyBackground") ? document.getElementById("familyBackground").value : "";
    // Diagnosen
    data.primaryDiagnosis = document.getElementById("primaryDiagnosis") ? document.getElementById("primaryDiagnosis").value : "";
    data.additionalDiagnoses = [];
    document.querySelectorAll("#additionalDiagnoses .diagnosis-item").forEach(item => {
      const diag = item.querySelector(".diagnosis-input")?.value.trim();
      const status = item.querySelector('.diagnosis-status')?.value;
      if (diag) data.additionalDiagnoses.push({ diagnosis: diag, status: status });
    });
    // Weitere Angaben zu Diagnosen
    data.somaticDiagnoses = document.getElementById("somaticDiagnoses") ? document.getElementById("somaticDiagnoses").value : "";
    // Therapieplanung
    data.therapyGoals = getSelectValues("therapyGoalsList");
    data.plannedInterventions = getSelectValues("plannedInterventionsList");
    data.therapyScope = document.getElementById("therapyScopeSelect").value;
    data.prognosisPositive = getSelectValues("prognosisPositive");
    data.prognosisNegative = getSelectValues("prognosisNegative");
    // Zusatz
    data.previousCourse = document.getElementById("previousCourse").value;
    data.updatedFindings = getSelectValues("updatedFindingsList");
    data.justification = getSelectValues("justificationList");
    data.changedGoals = getSelectValues("changedGoalsList");
    data.closingPlan = getSelectValues("closingPlanList");

    // Zusätzliche Freitextangaben aus dynamischen "Weitere"-Feldern sammeln
    document.querySelectorAll('input[name$="Other[]"]').forEach((input) => {
      const key = input.name.slice(0, -2);
      if (!data[key]) data[key] = [];
      if (input.value.trim()) data[key].push(input.value.trim());
    });

    if (hasConflicts(data)) return;

    // Bericht zusammenbauen
    // Hilfsfunktionen zum Kombinieren von Listen und "Weitere"-Feldern
    const joinList = (arr) => Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "";
    const listWithOther = (arr, other) => {
      const items = [];
      if (Array.isArray(arr) && arr.length > 0) {
        items.push(...arr);
      }
      if (Array.isArray(other)) {
        other.forEach((o) => {
          if (o && o.trim() !== "") items.push(o.trim());
        });
      } else if (other && typeof other === "string" && other.trim() !== "") {
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
      if (data.financialOther && data.financialOther.length > 0) report += ` (${data.financialOther.join(", ")})`;
      report += "\n";
    }
    // Sozialer Freundeskreis & Freizeit
    const socialNetStr = listWithOther(data.socialNetwork, data.socialNetworkOther);
    if (socialNetStr) report += `Freundeskreis/Freizeit: ${socialNetStr}\n`;
    if (data.workHours) report += `Arbeitszeit/Bedingungen: ${data.workHours}\n`;
    if (data.vacationUsage) report += `Urlaubsnutzung: ${data.vacationUsage}\n`;
    if (data.disabilityPension) report += `GdB/Rentenbegehren: ${data.disabilityPension}\n`;
    if (data.socialOther && data.socialOther.length > 0) report += `Weitere soziale Angaben: ${data.socialOther.join(", ")}\n`;

    // 2. Symptomatik und psychischer Befund
    report += "\n2. Symptomatik und psychischer Befund\n";
    // Symptomatik
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
    // Störungs- & Familienanamnese, Testdaten und Therapievariablen (falls vorhanden)
    if (data.familyHistory || (data.familyHistoryOther && data.familyHistoryOther.length > 0) || data.firstOnset || data.courseDescription || (data.tests && data.tests.length > 0) || data.familyBackground || data.motivationLevel || data.introspectionAbility || data.empathyAbility || data.illnessInsight || data.changeAbility) {
      const familyHistStr = listWithOther(data.familyHistory, data.familyHistoryOther);
      if (familyHistStr) report += `Familienanamnese: ${familyHistStr}\n`;
      if (data.familyBackground) report += `Familienstruktur/Kindheit: ${data.familyBackground}\n`;
      if (data.firstOnset) report += `Beginn der Störung: ${data.firstOnset}\n`;
      if (data.courseDescription) report += `Verlauf & frühere Episoden: ${data.courseDescription}\n`;
      // Testdaten
      if (data.tests && data.tests.length > 0) {
        const testParts = data.tests.map(t => {
          let part = t.name || "Test";
          if (t.value) part += `: ${t.value}`;
          if (t.type) part += ` (${t.type})`;
          return part;
        });
        report += `Testwerte: ${testParts.join(", ")}\n`;
      }
      // Therapievariablen
      const tvars = [];
      if (data.motivationLevel) tvars.push(`Motivation: ${data.motivationLevel}`);
      if (data.introspectionAbility) tvars.push(`Introspektionsfähigkeit: ${data.introspectionAbility}`);
      if (data.empathyAbility) tvars.push(`Empathiefähigkeit: ${data.empathyAbility}`);
      if (data.illnessInsight) tvars.push(`Krankheitseinsicht: ${data.illnessInsight}`);
      if (data.changeAbility) tvars.push(`Veränderungsfähigkeit: ${data.changeAbility}`);
      if (tvars.length > 0) report += `Therapievariablen: ${tvars.join(", ")}\n`;
    }
    // Psychischer Befund
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
    if (data.suicideIdeation || data.suicideAttempts || data.harmOthers || data.suicideNotes) {
      report += `Suizidalität/Fremdgefährdung: Suizidgedanken: ${data.suicideIdeation || "-"}; Frühere Suizidversuche: ${data.suicideAttempts || "-"}; Fremdgefährdung: ${data.harmOthers || "-"}`;
      if (data.suicideNotes) report += `; Anmerkungen: ${data.suicideNotes}`;
      report += "\n";
    }

    // 3. Somatischer Befund / Konsiliarbericht
    report += "\n3. Somatischer Befund / Konsiliarbericht\n";
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

    // 4. Behandlungsrelevante Angaben zur Lebensgeschichte, zur Krankheitsanamnese, zum funktionalen Bedingungsmodell
    report += "\n4. Behandlungsrelevante Angaben zur Lebensgeschichte, zur Krankheitsanamnese, zum funktionalen Bedingungsmodell\n";
    const lifeInfStr = listWithOther(data.lifeInfluences, data.lifeInfluencesOther);
    if (lifeInfStr) {
      report += `Lebensgeschichtliche Einflüsse: ${lifeInfStr}. Diese Einflüsse bilden den Hintergrund der geschilderten Symptomatik.\n`;
    }
    const familyBg = data.familyBackground;
    if (familyBg) report += `Familienstruktur & prägende Erfahrungen: ${familyBg}\n`;
    const predisStr = listWithOther(data.predispositionsList, data.predispositionsOther);
    if (predisStr) report += `Prädispositionen / langfristige Faktoren: ${predisStr}\n`;
    const triggersStr = listWithOther(data.triggersList, data.triggersOther);
    if (triggersStr) {
      report += `Auslösende Bedingungen: ${triggersStr}. Diese Ereignisse stehen im zeitlichen Zusammenhang mit der Symptomatik.\n`;
    }
    const maintStr = listWithOther(data.maintenanceBehaviors, data.maintenanceOther);
    if (maintStr) report += `Aufrechterhaltende Bedingungen: ${maintStr}\n`;
    const resourcesStr = listWithOther(data.resources, data.resourcesOther);
    if (resourcesStr) report += `Ressourcen/Stärken: ${resourcesStr}\n`;
    if (data.schoolHistory) report += `Schulische Anamnese: ${data.schoolHistory}\n`;
    if (data.illnessHistory) report += `Krankheitsanamnese: ${data.illnessHistory}\n`;
    // SORKC zusammenstellen
    // Mehrere SORKC‑Einträge ausgeben
    if (Array.isArray(data.sorkcEntries) && data.sorkcEntries.length > 0) {
      data.sorkcEntries.forEach((entry, idx) => {
        const shortStr = (Array.isArray(entry.short) && entry.short.length > 0)
          ? entry.short.map((c) => `${c.type}: ${c.text}`).join("; ")
          : "-";
        const longStr = (Array.isArray(entry.long) && entry.long.length > 0)
          ? entry.long.map((c) => `${c.type}: ${c.text}`).join("; ")
          : "-";
        report += `Verhaltensanalyse (SORKC) – Situation ${idx + 1}: Situation: ${entry.situation || "-"}; Organismus: ${entry.organism || "-"}; Reaktion: ${entry.reaction || "-"}; Kurzfristige Konsequenzen: ${shortStr}; Langfristige Konsequenzen: ${longStr}\n`;
      });
    }
    // Verhaltensanalytische Problemdefinition (Störungsmodell)
    if (data.modelPredisposing || data.modelTrigger || data.modelMaintaining) {
      report += `Störungsmodell – Prädisponierende Faktoren: ${data.modelPredisposing || "-"}\n`;
      report += `Störungsmodell – Auslösende Faktoren: ${data.modelTrigger || "-"}\n`;
      report += `Störungsmodell – Aufrechterhaltende Faktoren: ${data.modelMaintaining || "-"}\n`;
    }

    // 5. ICD‑Diagnosen zum Zeitpunkt der Antragstellung
    report += "\n5. ICD‑Diagnosen zum Zeitpunkt der Antragstellung\n";
    if (data.primaryDiagnosis) {
      report += `Primäre Diagnose: ${data.primaryDiagnosis} (gesichert)\n`;
    }
    if (Array.isArray(data.additionalDiagnoses) && data.additionalDiagnoses.length > 0) {
      const addStr = data.additionalDiagnoses.map(d => `${d.diagnosis} (${d.status})`).join(", ");
      report += `Weitere Diagnosen: ${addStr}\n`;
    }
    if (data.somaticDiagnoses) {
        report += `Somatische Diagnosen: ${data.somaticDiagnoses}\n`;
      }

    // 6. Behandlungsplan und Prognose
    report += "\n6. Behandlungsplan und Prognose\n";
    const therapyGoalsStr = listWithOther(data.therapyGoals, data.therapyGoalsOther);
    if (therapyGoalsStr) report += `Therapieziele: ${therapyGoalsStr}\n`;
    const interventionsStr = listWithOther(data.plannedInterventions, data.plannedInterventionsOther);
    if (interventionsStr) report += `Geplante Interventionen: ${interventionsStr}\n`;
    const scopeStr = data.therapyScope || (data.therapyScopeOther && data.therapyScopeOther.join(", "));
    if (scopeStr) report += `Beantragter Therapieumfang: ${scopeStr}\n`;
    // Prognose
    const progPosStr = listWithOther(data.prognosisPositive, data.prognosisPositiveOther);
    const progNegStr = listWithOther(data.prognosisNegative, data.prognosisNegativeOther);
    if (progPosStr || progNegStr) {
      report += `Prognose – förderliche Faktoren: ${progPosStr || "-"}, hindernde Faktoren: ${progNegStr || "-"}\n`;
    }

    // 7. Zusatzabschnitt für Umwandlung/Fortführung
    if (data.applicationType === "umwandlung" || data.applicationType === "fortfuehrung") {
      report += "\n7. Zusatzabschnitt für Umwandlungs-/Fortführungsanträge\n";
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
  const addTestBtn = document.getElementById("addTest");
  if (addTestBtn) {
    addTestBtn.addEventListener("click", () => {
      const tbody = document.querySelector("#testTable tbody");
      if (!tbody) return;
      const row = document.createElement("tr");
      row.classList.add("test-row");
      row.innerHTML = '<td><input type="text" name="testName[]" /></td>' +
                      '<td><input type="number" name="testValue[]" step="any" /></td>' +
                      '<td><input type="text" name="testType[]" /></td>';
      tbody.appendChild(row);
    });
  }

  function createConsequenceItem() {
    const div = document.createElement('div');
    div.className = 'consequence-item';
    div.innerHTML = `<select class="consequence-type">
        <option value="">– Art wählen –</option>
        <option value="C+">C+</option>
        <option value="C-">C-</option>
        <option value="C+/">C+/</option>
        <option value="C-/">C-/</option>
      </select>
      <input type="text" class="consequence-text" placeholder="Beschreibung" />`;
    return div;
  }

  function setupSorkcConsequences(entry) {
    const shortContainer = entry.querySelector('.short-consequences');
    const addShort = entry.querySelector('.add-short-consequence');
    if (shortContainer && addShort) {
      addShort.addEventListener('click', () => {
        shortContainer.appendChild(createConsequenceItem());
      });
    }
    const longContainer = entry.querySelector('.long-consequences');
    const addLong = entry.querySelector('.add-long-consequence');
    if (longContainer && addLong) {
      addLong.addEventListener('click', () => {
        longContainer.appendChild(createConsequenceItem());
      });
    }
  }

  const sorkcContainer = document.getElementById('sorkcContainer');
  const sorkcTemplateHTML = sorkcContainer ? sorkcContainer.querySelector('.sorkc-entry').outerHTML : '';
  if (sorkcContainer) {
    const firstEntry = sorkcContainer.querySelector('.sorkc-entry');
    if (firstEntry) setupSorkcConsequences(firstEntry);
  }

  // Handler zum Hinzufügen neuer SORKC‑Situationen
  const addDiagBtn = document.getElementById("addDiagnosis");
  const additionalDiagContainer = document.getElementById("additionalDiagnoses");
  if (addDiagBtn && additionalDiagContainer) {
    addDiagBtn.addEventListener("click", () => {
      const div = document.createElement("div");
      div.className = "diagnosis-item";
      div.innerHTML = `<input type="text" list="diagnosisOptions" class="diagnosis-input" placeholder="Diagnose suchen oder eintragen" />
      <select class="diagnosis-status">
        <option value="gesichert">gesichert</option>
        <option value="Verdachtsdiagnose">Verdachtsdiagnose</option>
      </select>
      <button type="button" class="remove-diagnosis">✖</button>`;
      additionalDiagContainer.appendChild(div);
      const removeBtn = div.querySelector('.remove-diagnosis');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => div.remove());
      }
    });
  }

  const addSorkcBtn = document.getElementById('addSorkc');
  if (addSorkcBtn) {
    addSorkcBtn.addEventListener('click', () => {
      if (!sorkcContainer) return;
      const wrapper = document.createElement('div');
      wrapper.innerHTML = sorkcTemplateHTML;
      const clone = wrapper.firstElementChild;
      const count = sorkcContainer.querySelectorAll('.sorkc-entry').length + 1;
      const heading = clone.querySelector('h3');
      if (heading) heading.textContent = `SORKC‑Situation ${count}`;
      sorkcContainer.appendChild(clone);
      setupSorkcConsequences(clone);
    });
  }

  function setupDynamicOtherFields() {
    const ids = [
      'familyHistoryOther',
      'symptomPhysOther',
      'symptomEmoOther',
      'symptomCogOther',
      'symptomBehOther',
      'symptomCourseOther',
      'comorbiditiesOther',
      'somaticOther',
      'substanceUseOther',
      'medicationOther',
      'previousTreatmentsOther',
      'lifeInfluencesOther',
      'predispositionsOther',
      'triggersOther',
      'maintenanceOther',
      'resourcesOther',
      'therapyGoalsOther',
      'plannedInterventionsOther',
      'prognosisPositiveOther',
      'prognosisNegativeOther',
      'updatedFindingsOther',
      'justificationOther',
      'changedGoalsOther',
      'closingPlanOther'
    ];
    ids.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const wrapper = document.createElement('div');
      wrapper.classList.add('additional-inputs');
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);
      input.name = id + '[]';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'secondary-btn add-more';
      btn.textContent = 'Weiteren Eintrag hinzufügen';
      btn.addEventListener('click', () => {
        const clone = input.cloneNode();
        clone.value = '';
        clone.id = '';
        clone.name = input.name;
        wrapper.appendChild(clone);
      });
      wrapper.parentNode.insertBefore(btn, wrapper.nextSibling);
    });
  }
  setupDynamicOtherFields();
  // Initialisiert Checkbox- und Radio-Labels für visuelles Feedback
  function setupSelectableLabels() {
    const inputs = document.querySelectorAll('.checkbox-group input[type="checkbox"], .radio-group input[type="radio"]');
    inputs.forEach((inp) => {
      const label = inp.parentElement;
      if (inp.checked) {
        label.classList.add('checked');
      }
      inp.addEventListener('change', () => {
        if (inp.type === 'radio') {
          document.querySelectorAll(`input[name="${inp.name}"]`).forEach((r) => {
            if (r.parentElement) r.parentElement.classList.remove('checked');
          });
        }
        if (inp.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });
    });
  }
  setupSelectableLabels();

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

  // KI‑Schaltfläche: Wandelt den strukturierten Bericht in einen fließenden Text um
  const aiSummaryBtn = document.getElementById("aiSummaryBtn");
  if (aiSummaryBtn) {
    aiSummaryBtn.addEventListener("click", async () => {
      const textarea = document.getElementById("reportOutput");
      if (!textarea) return;
      const rawText = textarea.value;
      // Initialisiere das Modell bei Bedarf
      const summarizerPipe = await getSummarizer();
      try {
        const result = await summarizerPipe(rawText, {
          max_length: 300,
          min_length: 150,
          do_sample: false,
        });
        if (Array.isArray(result) && result.length > 0 && result[0].summary_text) {
          textarea.value = result[0].summary_text;
        }
      } catch (error) {
        console.error('Fehler bei der Zusammenfassung:', error);
      }
    });
  }
});