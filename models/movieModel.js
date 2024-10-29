import mongoose from "mongoose";

const { Schema, model } = mongoose;

const movieSchema = new Schema(
  {
    name: { type: String, required: true },
    yearOfRelease: { type: Number, required: true },
    plot: { type: String, required: true },
    poster: { type: String }, // URL to poster image
    image: {
      type: Object,
      default: {},
      },

    actors: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Actor", required: true },
    ],
    producer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producer",
      required: true,
    },
    user: {
      // Reference to the User who added the movie
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Movie", movieSchema);
