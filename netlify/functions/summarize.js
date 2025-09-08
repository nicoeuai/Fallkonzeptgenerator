// In Netlify Functions steht ab Node.js 18 die Fetch‑API global zur Verfügung,
// sodass kein zusätzliches Modul geladen werden muss. Wenn Sie eine frühere Node‑Version
// verwenden, können Sie stattdessen das Paket 'node-fetch' installieren und importieren.

// Netlify Function Handler
exports.handler = async function(event, context) {
  // Aktivieren von CORS, damit der Browser die Antwort akzeptiert. Hier erlauben wir alle
  // Ursprünge. In einer produktiven Umgebung kann der Origin eingeschränkt werden.
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  // Vorab-Handling für OPTIONS-Anfragen (CORS Preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }
  const text = payload.text;
  if (!text) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'No text provided' }),
    };
  }

  // Verwenden Sie ein text2text‑Generierungsmodell (FLAN‑T5‑Base), das Anweisungen versteht.
  // Dieses Modell kann aus stichpunktartigen Angaben einen kohärenten Bericht erzeugen.
  const HF_API_URL = 'https://api-inference.huggingface.co/models/google/flan-t5-base';
  const token = process.env.HF_API_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'HF_API_TOKEN is not set' }),
    };
  }

  try {
    // Formuliere eine Anweisung, damit das Modell aus den Notizen einen zusammenhängenden
    // psychotherapeutischen Bericht erstellt. Diese Aufforderung wird an das Modell gesendet.
    const prompt = `Schreibe einen zusammenhängenden, strukturierten psychotherapeutischen Bericht für eine Begutachtung. Verwende vollständige Sätze und fasse die folgenden Notizen sinnvoll zusammen. Notizen: ${text}`;
    const resp = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 512,
          do_sample: false
        },
      }),
    });
    if (!resp.ok) {
      const detail = await resp.text();
      return {
        statusCode: resp.status,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Error from Hugging Face', detail }),
      };
    }
    const result = await resp.json();
    if (Array.isArray(result) && result[0] && result[0].generated_text) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ summary: result[0].summary_text.trim() }),
      };
    } else {
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Unexpected response format', detail: result }),
      };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Server error', detail: err.message }),
    };
  }
};