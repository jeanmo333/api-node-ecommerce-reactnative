import mongoose from "mongoose";
import { IBanner } from "../interfaces/banner";

const homeBanerSchema = new mongoose.Schema<IBanner>(
  {
    banner: { type: String },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    position: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const HomeBanner = mongoose.model("Home-banner", homeBanerSchema);

export default HomeBanner;
