import express from 'express';
import { createActor, deleteActor, getactor, getActors, updateActor } from '../controllers/actorController.js';
import protect from '../middleWare/authMiddleware.js';
import { upload } from '../utils/fileUpload.js';
const router = express.Router();


// Import controllers

router.post('/',protect,upload.single("image"), createActor);
router.get('/',protect,getActors);
router.get('/:id',protect,getactor);
router.delete('/:id',protect,deleteActor);
router.patch('/:id',protect,upload.single("image"), updateActor);


export default router 