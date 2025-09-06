const fetch = require('node-fetch');

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

  const HF_API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';
  const token = process.env.HF_API_TOKEN;
  if (!token) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'HF_API_TOKEN is not set' }),
    };
  }

  try {
    const resp = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 512,
          min_length: 150,
          do_sample: false,
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
    if (Array.isArray(result) && result[0] && result[0].summary_text) {
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