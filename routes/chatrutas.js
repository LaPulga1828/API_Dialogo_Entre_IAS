import { Router } from 'express';
import chatcontroles from '../controllers/chatcontroles.js';

const router = new Router();

router.get('/', chatcontroles.obtenerHistorial);
router.post('/papa', chatcontroles.responderPapa);
router.post('/terrorista', chatcontroles.responderTerrorista);
router.delete('/', chatcontroles.limpiarHistorial);
router.get('/exportar', chatcontroles.exportarPDF);

export default router;
