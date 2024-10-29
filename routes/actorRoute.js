import express from 'express';
import { createActor, deleteActor, getactor, getActors, updateActor } from '../controllers/actorController.js';
import protect from '../middleWare/authMiddleware.js';
const router = express.Router();


// Import controllers

router.post('/addactor',protect, createActor);
router.get('/getactor',protect,getActors);
router.get('/getactor/:id',protect,getactor);
router.delete('/deleteactor/:id',protect,deleteActor);
router.patch('/updateactor/:id',protect,updateActor);


export default router 