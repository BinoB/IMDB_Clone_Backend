import express from 'express';
import { createProducer, deleteProducer, getproducer, getProducers, updateProducer } from '../controllers/producerController.js';
import protect from '../middleWare/authMiddleware.js';
const router = express.Router();


// Import controllers

router.post('/addproducer',protect, createProducer);
router.get('/getproducer',protect,getProducers);
router.get('/getproducer/:id',protect,getproducer);
router.delete('/deleteproducer/:id',protect,deleteProducer);
router.patch('/updateproducer/:id',protect,updateProducer);


export default router 