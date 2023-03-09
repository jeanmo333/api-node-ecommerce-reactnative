import mongoose from "mongoose";
import { IAddress } from "../interfaces/address";

const addressSchema = new mongoose.Schema<IAddress>(
  {
    title: {
      type: String,
      required: true,
    },
    name_lastname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
