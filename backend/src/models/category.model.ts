import mongoose, { Document, Schema } from "mongoose";
import { Status } from "../constant/enum";

interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    image: {
      type: String || null,
      default: null,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.ACTIVE,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<ICategory>("category", categorySchema);

export default Category;
