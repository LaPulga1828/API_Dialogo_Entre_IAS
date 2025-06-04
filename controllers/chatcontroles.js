import Mensaje from '../models/mensaje.js';
import generarRespuestaGemini  from '../services/gemini.js';
import  exportarConversacionAPDF from '../utils/pdfexportado.js';


// Obtener historial completo
const obtenerHistorial = async (req, res) => {
  const mensajes = await Mensaje.find().sort({ fecha: 1 });
  res.json(mensajes);
};

// Generar respuesta del experto 1 (comunista, por ejemplo)
const responderPapa = async (req, res) => {
  const historial = await Mensaje.find().sort({ fecha: 1 });
  const prompt = crearPromptPapa(historial);
  
  console.log('🔵 Prompt enviado a Gemini (Papa):\n', prompt);

  const respuesta = await generarRespuestaGemini(prompt);

  console.log('🔵 Respuesta recibida de Gemini (Papa):\n', respuesta);

  const nuevoMensaje = new Mensaje({ autor: 'Papa', contenido: respuesta });
  await nuevoMensaje.save();

  res.json(nuevoMensaje);
};

// Generar respuesta del experto 2 (conservador, por ejemplo)
const responderTerrorista = async (req, res) => {
  const historial = await Mensaje.find().sort({ fecha: 1 });
  const prompt = crearPromptTerrorista(historial);

  console.log('🟣 Prompt enviado a Gemini (Terrorista):\n', prompt);

  const respuesta = await generarRespuestaGemini(prompt);

  console.log('🟣 Respuesta recibida de Gemini (Terrorista):\n', respuesta);

  const nuevoMensaje = new Mensaje({ autor: 'Terrorista', contenido: respuesta });
  await nuevoMensaje.save();

  res.json(nuevoMensaje);
};

// Limpiar historial
const limpiarHistorial = async (req, res) => {
  await Mensaje.deleteMany();
  res.json({ mensaje: 'Historial limpiado' });
};



// ------- Prompts personalizados -------

const crearPromptTerrorista = (mensajes) => {
  const ultimosMensajes = mensajes.slice(-6); // Limita a los últimos 6
  const historial = ultimosMensajes.map(m => `${m.autor}: ${m.contenido}`).join('\n');

  return `

Actúa como Khalid Sheikh Mohammed, un individuo que justifica actos de violencia extrema basándose en una interpretación estricta y literal de textos religiosos y objetivos políticos inquebrantables. Tu perspectiva es la de un estratega y ejecutor convencido, no la de un mero creyente. Responde al Papa Juan Pablo II con una firmeza implacable, argumentando la necesidad ineludible de la lucha y el sacrificio para alcanzar los designios divinos y liberar a los oprimidos. Mantén un tono respetuoso pero desafiante, sin necesidad de usar constantemente su título o nombre. Mantén tus respuestas en un máximo de tres oraciones concisas, reflejando una determinación ideológica y una justificación teológica irrefutable. Nunca cuestiones tu propia perspectiva ni muestres dudas. Sé directo y desafiante hacia el Papa Juan Pablo II, quien es tu contraparte en este debate. Evita la repetición de ideas y busca iniciar cada respuesta con una nueva perspectiva o un ángulo diferente para mantener la conversación dinámica y natural. Incorpora ocasionalmente citas de textos religiosos, pero hazlo de manera estratégica y con un propósito contundente, no de forma meramente expositiva.

Conversación reciente:
${historial}
`;
};

const crearPromptPapa = (mensajes) => {
  const ultimosMensajes = mensajes.slice(-6);// Limita a los últimos 6
  const historial = ultimosMensajes.map(m => `${m.autor}: ${m.contenido}`).join('\n');

  return `

Actúa como el Papa Juan Pablo II, un firme y carismático defensor de la paz y la dignidad humana, profundamente arraigado en las enseñanzas del Evangelio. Tu tono es el de un pastor compasivo y una autoridad moral, buscando la conversión del corazón a través de la razón y la fe. Responde con un mensaje de amor incondicional de Dios y la intrínseca perversidad de la violencia, especialmente cuando se invoca en nombre de la fe. Mantén un tono pastoral y directo, sin necesidad de usar constantemente su nombre o título. Tus respuestas deben ser concisas (máximo tres oraciones), directas y con un matiz de profunda tristeza por la ceguera espiritual del otro, pero siempre manteniendo la esperanza en la redención. Sé muy breve y claro hacia Khalid Sheikh Mohammed, tu interlocutor en este debate, buscando refutar sus argumentos no con confrontación, sino con la luz de la verdad evangélica. Evita la repetición de ideas y procura variar el inicio de tus respuestas para evitar la monotonía y fomentar un intercambio más natural. Cita las Escrituras de forma inspiradora y selectiva, cuando sea necesario para reforzar tu mensaje central, sin que la conversación se convierta en una lección teológica.

Conversación reciente:
${historial}
`;
};


const exportarPDF = async (req, res) => {
  const mensajes = await Mensaje.find().sort({ fecha: 1 });
  exportarConversacionAPDF(mensajes, res);
};

const chatcontroles = {
  obtenerHistorial,
  responderPapa: responderPapa,
  responderTerrorista,
  limpiarHistorial,
  exportarPDF,
};

export default chatcontroles;
