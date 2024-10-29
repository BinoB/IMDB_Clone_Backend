import asyncHandler from "express-async-handler";
import Movie from "../models/movieModel.js"; // Assuming this is your movie model
import { fileSizeFormatter } from "../utils/fileUpload.js";
import cloudinary from "cloudinary";

// Create Movie
export const createMovie = asyncHandler(async (req, res) => {
  const { name, yearOfRelease,poster, plot, producer, actors } = req.body;

  // Validation
  if (!name || !yearOfRelease || !plot || !producer || !actors || !poster) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle Image upload for poster
  let fileData = {};
  if (req.file) {
    // Save image to Cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Movie",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Movie
  const movie = await Movie.create({
    user: req.user.id,
    name,
    yearOfRelease,
    plot,
    poster,// Changed to poster image
    producer,
    actors,
    image: fileData // Assuming this is an array of movie IDs
  });

  res.status(201).json(movie);
});

export // Get all Movies
const getMovies = asyncHandler(async (req, res) => {
  const movies = await Movie.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(movies);
});

 // Get single Movie
 export const getmovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  // if Movie doesnt exist
  if (!movie) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match Movie to its user
  if (movie.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(movie);
});

// Delete Movie
export const deleteMovie = asyncHandler(async (req, res) => {
	const movie = await Movie.findById(req.params.id);

	// If movie doesn't exist
	if (!movie) {
	  res.status(404);
	  throw new Error("Movie not found");
	}

	// Match Movie to its user
	if (movie.user.toString() !== req.user.id) {
	  res.status(401);
	  throw new Error("User not authorized");
	}

	// Delete movie
	await Movie.findByIdAndDelete(req.params.id);
	res.status(200).json({ message: "Movie deleted." });
});


// Update Movie
export const updateMovie = asyncHandler(async (req, res) => {
	const { name, yearOfRelease, plot, producer, actors,poster  } = req.body;
	const { id } = req.params;

	const movie = await Movie.findById(id);

	// If movie doesn't exist
	if (!movie) {
		res.status(404);
		throw new Error("Movie not found");
	}

	// Match movie to its user
	if (movie.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error("User not authorized");
	}

	// Handle image upload
	let fileData = {};
	if (req.file) {
		// Save image to Cloudinary
		let uploadedFile;
		try {
			uploadedFile = await cloudinary.uploader.upload(req.file.path, {
				folder: "Movies",
				resource_type: "image",
			});
		} catch (error) {
			res.status(500);
			throw new Error("Image could not be uploaded");
		}

		fileData = {
			fileName: req.file.originalname,
			filePath: uploadedFile.secure_url,
			fileType: req.file.mimetype,
			fileSize: fileSizeFormatter(req.file.size, 2),
		};
	}

	// Update Movie
	const updatedMovie = await Movie.findByIdAndUpdate(
		id,
		{
			name, yearOfRelease, plot, producer, actors, poster ,
			image: Object.keys(fileData).length === 0 ? movie.image : fileData,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json(updatedMovie);
});