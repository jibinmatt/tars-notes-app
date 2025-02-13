import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: false },
  text: { type: String, required: false },
  audio: { type: String, required: false },
  transcript: { type: String, required: false },
  images: [{ type: String }],
  isFavorite: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notes: [noteSchema] // Array of notes for each user
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
