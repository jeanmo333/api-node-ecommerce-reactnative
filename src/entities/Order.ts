import mongoose from "mongoose";
import { IOrder } from "../interfaces/order";
import { IProduct } from "../interfaces/product";

const orderSchema = new mongoose.Schema<IOrder>(
  {
    totalPayment: {
      type: Number,
      required: true,
    },
    addressShipping: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    idPayment: {
      type: String,
      required: true,
    },
    products: [],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
