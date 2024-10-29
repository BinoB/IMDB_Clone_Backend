import express from 'express';
import { createMovie, deleteMovie, getmovie, getMovies, updateMovie } from '../controllers/movieController.js';
import protect from '../middleWare/authMiddleware.js';
const router = express.Router();


// Import controllers

router.post('/addmovie',protect, createMovie);
router.get('/getmovie',protect,getMovies);
router.get('/getmovie/:id',protect,getmovie);
router.delete('/deletemovie/:id',protect,deleteMovie);
router.patch('/updatemovie/:id',protect,updateMovie);


export default router 