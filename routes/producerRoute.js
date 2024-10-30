import express from 'express';
import { createProducer, deleteProducer, getProducer, getProducers, updateProducer } from '../controllers/producerController.js';
import protect from '../middleWare/authMiddleware.js';
import { upload } from '../utils/fileUpload.js';
const router = express.Router();


// Import controllers

router.post('/',protect, protect,upload.single("image"),createProducer);
router.get('/',protect,getProducers);
router.get('/:id',protect,getProducer);
router.delete('/:id',protect,deleteProducer);
router.patch('/:id',protect,protect,upload.single("image"),updateProducer);


export default router 