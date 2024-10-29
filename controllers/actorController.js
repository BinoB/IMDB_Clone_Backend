import asyncHandler from "express-async-handler";
import Actor from "../models/actorModel.js";
import { fileSizeFormatter } from "../utils/fileUpload.js";
import cloudinary from "cloudinary";
cloudinary.v2;


//Create Actor

export const createActor = asyncHandler(async(req,res)=>{
	const {name, gender, dob, bio} = req.body;

	//validation

	if(!name || !gender || !dob || !bio){
		return res.status(400).json({message: 'All fields are required'})
	}

	//Handle image upload
	let fileData = {};
	if(req.file){
		let uploadedFile;
		try {
			uploadedFile = await cloudinary.uploader.upload(req.file.path, {
				folder: "Actors",
				resource_type: "image",
			  });
		} catch (error) {
			res.status(500).json({message:"Error uploading"});
		}
		fileData = {
			fileName: req.file.originalname,
			filePath: uploadedFile.secure_url,
			fileType: req.file.mimetype,
			fileSize: fileSizeFormatter(req.file.size, 2),
		  };
	}

	//Create new actor
	const actor = await Actor.create({
		user: req.user.id,
		name,
		gender,
		dob,
		bio,
		
		image: fileData,
	  });
	
	  res.status(201).json(actor);
})


export // Get all Products
const getActors = asyncHandler(async (req, res) => {
  const actors = await Actor.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(actors);
});

 // Get single Actor
 export const getactor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  // if Actor doesnt exist
  if (!actor) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match Actor to its user
  if (actor.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(actor);
});

// Delete Actor
export const deleteActor = asyncHandler(async (req, res) => {
	const actor = await Actor.findById(req.params.id);

	// If actor doesn't exist
	if (!actor) {
	  res.status(404);
	  throw new Error("Actor not found");
	}

	// Match Actor to its user
	if (actor.user.toString() !== req.user.id) {
	  res.status(401);
	  throw new Error("User not authorized");
	}

	// Delete actor
	await Actor.findByIdAndDelete(req.params.id);
	res.status(200).json({ message: "Actor deleted." });
});


// Update Actor
export const updateActor = asyncHandler(async (req, res) => {
	const { name, gender, dob, bio } = req.body;
	const { id } = req.params;

	const actor = await Actor.findById(id);

	// If actor doesn't exist
	if (!actor) {
		res.status(404);
		throw new Error("Actor not found");
	}

	// Match actor to its user
	if (actor.user.toString() !== req.user.id) {
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
				folder: "Actors",
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

	// Update Actor
	const updatedActor = await Actor.findByIdAndUpdate(
		id,
		{
			name,
			gender,
			dob,
			bio,
			image: Object.keys(fileData).length === 0 ? actor.image : fileData,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json(updatedActor);
});