import mongoose from "mongoose";
import { IProduct } from "../interfaces/product";

const productSchema = new mongoose.Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    images: [{ type: String }],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ title: "text", tags: "text" });
const Product = mongoose.model("Product", productSchema);

export default Product;
