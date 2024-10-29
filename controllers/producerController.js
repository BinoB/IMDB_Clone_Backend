import asyncHandler from "express-async-handler";
import Producer from "../models/producerModel.js";
import { fileSizeFormatter } from "../utils/fileUpload.js";
import cloudinary from "cloudinary";
cloudinary.v2;

//Create Producer
export const createProducer = asyncHandler(async (req, res) => {
  const { name, gender, dob, bio } = req.body;

  //validation

  if (!name || !gender || !dob || !bio) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Handle image upload
  let fileData = {};
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Producers",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500).json({ message: "Error uploading" });
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  //Create new Producer
  const producer = await Producer.create({
    user: req.user.id,
    name,
    gender,
    dob,
    bio,

    image: fileData,
  });

  res.status(201).json(producer);
});

 // Get all Products
 export const getProducers = asyncHandler(async (req, res) => {
  const producers = await Producer.find({ user: req.user.id }).sort(
    "-createdAt"
  );
  res.status(200).json(producers);
});

// Get single producer
export const getproducer = asyncHandler(async (req, res) => {
  const producer = await Producer.findById(req.params.id);
  // if Producer doesnt exist
  if (!producer) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match Producer to its user
  if (producer.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  res.status(200).json(producer);
});

// Delete Producer
export const deleteProducer = asyncHandler(async (req, res) => {
  const producer = await Producer.findById(req.params.id);

  // If producer doesn't exist
  if (!producer) {
    res.status(404);
    throw new Error("Producer not found");
  }

  // Match Producer to its user
  if (producer.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  // Delete producer
  await Producer.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Producer deleted." });
});

// Update producer
export const updateProducer = asyncHandler(async (req, res) => {
  const { name, gender, dob, bio } = req.body;
  const { id } = req.params;

  const producer = await Producer.findById(id);

  // If producer doesn't exist
  if (!producer) {
    res.status(404);
    throw new Error("Producer not found");
  }

  // Match producer to its user
  if (producer.user.toString() !== req.user.id) {
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
        folder: "Producers",
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

  // Update Producer
  const updatedProducer = await Producer.findByIdAndUpdate(
    id,
    {
      name,
      gender,
      dob,
      bio,
      image: Object.keys(fileData).length === 0 ? producer.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProducer);
});
