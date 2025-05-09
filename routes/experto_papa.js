import { Router } from 'express';
const router = Router();

router.get('/conversations', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({})
      .sort({ createdAt: -1 })
      .populate('messages')
      .exec();
    if (!conversation) {
      return res.status(404).json({ message: 'No se encontraron conversaciones' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Error al buscar la conversación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/conversations/expert1', async (req, res) => {
  const userInput = req.body.input;
  
  if (!userInput) {
    return res.status(400).json({ message: 'Se requiere la entrada' });
  }
  
  // Construir el prompt para la API de Gemini
  const expertDescription = "Tu descripción predefinida para el experto 1"; // Reemplaza con la descripción real
  const prompt = `${expertDescription}\n:Usuario  ${userInput}\nExperto 1:`;
  
  try {
    // Llamar a la API de Gemini para obtener la respuesta
    const geminiResponse = await GeminiAPI.generateResponse(prompt); // Ajusta según el uso del SDK
    const expertResponse = geminiResponse.data; // Ajusta según la estructura real de la respuesta
    
    // Crear un nuevo documento de Mensaje
    const newMessage = new Message({
      content: expertResponse,
      sender: 'experto1', // Asumiendo que tienes una forma de identificar al remitente
      // Agrega otros campos necesarios como la marca de tiempo, etc.
    });
    
    // Guardar el nuevo mensaje en la base de datos
    const savedMessage = await newMessage.save();
    
    // Actualizar la conversación actual para incluir el nuevo mensaje
    const conversation = await Conversation.findOneAndUpdate(
      { /* criterios para encontrar la conversación actual */ },
      { $push: { messages: savedMessage._id } }, // Agregar el ID del nuevo mensaje al array de mensajes
      { new: true } // Devolver el documento actualizado
    );
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }
    
    // Devolver el nuevo mensaje como respuesta
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error al generar la respuesta:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/conversations/expert2', async (req, res) => {
  const userInput = req.body.input;
  
  if (!userInput) {
    return res.status(400).json({ message: 'Se requiere la entrada' });
  }
  
  const expertDescription = "Tu descripción predefinida para el experto 2"; // Reemplazar por la descripción real
  const prompt = `${expertDescription}\n:Usuario  ${userInput}\nExperto 2:`;
  
  try {
    const geminiResponse = await GeminiAPI.generateResponse(prompt); // Ajustar según el SDK
    const expertResponse = geminiResponse.data; // Ajustar según la estructura de respuesta
    
    const newMessage = new Message({
      content: expertResponse,
      sender: 'experto2',
    });
    
    const savedMessage = await newMessage.save();
    
    const conversation = await Conversation.findOneAndUpdate(
      { /* criterios para encontrar la conversación actual */ },
      { $push: { messages: savedMessage._id } },
      { new: true }
    );
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversación no encontrada' });
    }
    
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error al generar la respuesta:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/conversations', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({}).sort({ createdAt: -1 });
    if (!conversation) {
      return res.status(404).json({ message: 'No se encontró la conversación para eliminar' });
    }
    // Eliminar todos los mensajes asociados a la conversación
    await Message.deleteMany({ _id: { $in: conversation.messages } });
    // Eliminar la conversación
    await Conversation.deleteOne({ _id: conversation._id });
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar la conversación:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.get('/conversations/export/pdf', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({})
      .sort({ createdAt: -1 })
      .populate('messages')
      .exec();
    if (!conversation) {
      return res.status(404).json({ message: 'No se encontraron conversaciones' });
    }
    // Prepare the content for the PDF
    const docDefinition = {
      content: [
        { text: 'Historial de Conversación', style: 'header' },
        ...conversation.messages.map(message => ({
          text: `${message.sender}: ${message.content}`,
          margin: [0, 5],
        })),
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 20, 0, 20],
        },
      },
    };
    // Generate the PDF
    const pdfDoc = pdfMake.createPdf(docDefinition);
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=historial_conversacion.pdf');
    // Stream the PDF to the response
    pdfDoc.getBuffer((buffer) => {
      res.send(buffer);
    });
  } catch (error) {
    console.error('Error al exportar el PDF:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.delete('/conversations/messages/:messageId', async (req, res) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error al eliminar el mensaje:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.put('/conversations/messages/:messageId', async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body; // Expecting the new content in the request body
  if (!content) {
    return res.status(400).json({ message: 'Se requiere el nuevo contenido del mensaje' });
  }
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { $set: { content } },
      { new: true } // Return the updated document
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error al actualizar el mensaje:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

export default router;
