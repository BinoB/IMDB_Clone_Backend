import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const producerSchema = new Schema({
  name: { type: String, required: true },
  gender: { type: String,  required: true },
  dob: { type: Date, required: true }, // Date of Birth
  bio: { type: String,required: true }, // Short biography
  image: {
	type: Object,
	default: {},
  },
  user: {
	// Reference to the User who added the movie
	type: mongoose.Schema.Types.ObjectId,
	ref: "User",
	required: true,
  },
}, { timestamps: true });

export default model('Producer', producerSchema);

