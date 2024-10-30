import dotenv from 'dotenv';
import Producer from "../models/producerModel.js";
import asyncHandler from "express-async-handler";
import { fileSizeFormatter } from "../utils/fileUpload.js";
import cloudinary from "cloudinary";

dotenv.config();

// Cloudinary configuration with error handling for missing env variables
if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.error("Missing Cloudinary configuration in .env file.");
  process.exit(1); // Exits the app if config is incomplete
}

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Create Producer
export const createProducer = asyncHandler(async (req, res) => {
  const { name, gender, dob, bio } = req.body;

  // Validate required fields
  if (!name || !gender || !dob || !bio) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Handle image upload with error logging
  let fileData = {};
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Producers",
        resource_type: "image",
      });
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
  }

  // Create new Producer
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

// Get all Producers
export const getProducers = asyncHandler(async (req, res) => {
  const producers = await Producer.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(producers);
});

// Get single Producer with authorization check
export const getProducer = asyncHandler(async (req, res) => {
  const producer = await Producer.findById(req.params.id);
  if (!producer) {
    return res.status(404).json({ message: "Producer not found" });
  }
  if (producer.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "User not authorized" });
  }
  res.status(200).json(producer);
});

// Delete Producer with authorization check
export const deleteProducer = asyncHandler(async (req, res) => {
  const producer = await Producer.findById(req.params.id);
  if (!producer) {
    return res.status(404).json({ message: "Producer not found" });
  }
  if (producer.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "User not authorized" });
  }

  await Producer.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Producer deleted" });
});

// Update Producer with image handling
export const updateProducer = asyncHandler(async (req, res) => {
  const { name, gender, dob, bio } = req.body;
  const { id } = req.params;
  const producer = await Producer.findById(id);

  if (!producer) {
    return res.status(404).json({ message: "Producer not found" });
  }
  if (producer.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "User not authorized" });
  }

  let fileData = producer.image || {}; // Retain existing image if not updated
  if (req.file) {
    try {
      const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Producers",
        resource_type: "image",
      });
      fileData = {
        fileName: req.file.originalname,
        filePath: uploadedFile.secure_url,
        fileType: req.file.mimetype,
        fileSize: fileSizeFormatter(req.file.size, 2),
      };
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return res.status(500).json({ message: "Image upload failed", error: error.message });
    }
  }

  // Update Producer data
  const updatedProducer = await Producer.findByIdAndUpdate(
    id,
    { name, gender, dob, bio, image: fileData },
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedProducer);
});
