import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {errorHandler} from './middleWare/errorMiddleware.js';
import userRoute from './routes/userRoute.js';
import actorRoute from './routes/actorRoute.js';
import ProducerRoute from './routes/producerRoute.js';
import movieRoute from './routes/movieRoute.js';



dotenv.config();
const app = express();

mongoose.set('strictQuery', false);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000","https://imdb-clone-backend-w6o0.onrender.com" ],
    credentials: true,
  })
  
);
// Routes Middleware
app.use("/api/users", userRoute);
app.use("/api/users/actor", actorRoute);
app.use("/api/users/producer", ProducerRoute);
app.use("/api/users/movie", movieRoute);

// Routes
app.get("/", (req, res) => {
	res.send("Home Page");
  });

  // Error Middleware
app.use(errorHandler);
// Connect to DB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err)); 