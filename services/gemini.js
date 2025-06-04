import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const generarRespuestaGemini = async (prompt, intentos = 3) => {
  try {
    console.log('🧠 Enviando prompt a Gemini:\n', prompt);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(prompt);
    const text = await result.response.text();

    console.log('✅ Respuesta de Gemini:\n', text);
    return text.trim();
  } catch (error) {
    console.error('❌ Error al generar respuesta con Gemini:', error);

    if (error.status === 429 && intentos > 0) {
      const retryDelayMatch = /"retryDelay":"(\d+)s"/.exec(JSON.stringify(error));
      const delaySegundos = retryDelayMatch ? parseInt(retryDelayMatch[1], 10) : 30;

      console.log(`⏳ Esperando ${delaySegundos} segundos antes de reintentar...`);
      await sleep(delaySegundos * 1000);
      return generarRespuestaGemini(prompt, intentos - 1);
    }

    return '⚠️ Error al generar la respuesta. Revisa la consola del servidor.';
  }
};

export default generarRespuestaGemini;



