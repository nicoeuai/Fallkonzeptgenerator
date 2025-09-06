const express = require('express');
// In neueren Node.js‑Versionen (ab 18) ist fetch global verfügbar. Für frühere Versionen
// können Sie alternativ das Paket 'node-fetch' installieren und importieren.
const fetch = require('node-fetch');

const app = express();

// Aktiviert CORS, damit Anfragen von anderen Ursprüngen (z. B. von localhost mit anderem Port)
// zugelassen werden. Alternativ kann ein spezifischer Origin angegeben werden.
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Laden des API‑Tokens aus der Umgebungsvariable. Stellen Sie sicher, dass diese
// gesetzt ist (z. B. über die Hosting‑Plattform oder in einer .env‑Datei).
const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
const HF_API_TOKEN = process.env.HF_API_TOKEN;

if (!HF_API_TOKEN) {
  console.warn('Warnung: HF_API_TOKEN ist nicht gesetzt. Bitte definieren Sie die Umgebungsvariable, sonst wird der Endpunkt nicht funktionieren.');
}

/**
 * POST /summarize
 * Erhält ein JSON‑Objekt { text: "..." } und gibt { summary: "..." } zurück.
 * Das Backend ruft die Hugging‑Face‑Inference‑API auf und sendet die Antwort an den Client.
 */
app.post('/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Es wurde kein Text übergeben.' });
  }
  if (!HF_API_TOKEN) {
    return res.status(500).json({ error: 'HF_API_TOKEN ist nicht gesetzt.' });
  }
  try {
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 512,
          min_length: 150,
          do_sample: false
        }
      })
    });
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Fehler bei Hugging‑Face API', detail: errText });
    }
    const result = await response.json();
    if (Array.isArray(result) && result.length > 0 && result[0].summary_text) {
      return res.json({ summary: result[0].summary_text.trim() });
    }
    return res.status(500).json({ error: 'Unerwartetes Antwortformat', detail: result });
  } catch (err) {
    console.error('Fehler bei der Kommunikation mit Hugging‑Face:', err);
    return res.status(500).json({ error: 'Serverfehler', detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Summarization proxy läuft auf Port ${PORT}`);
});