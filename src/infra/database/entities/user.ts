import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 4 },
  },
  {
    timestamps: true,
  }
);

export const UserEntity = model("user", UserSchema);
