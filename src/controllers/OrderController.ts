import { Request, Response } from "express";
import mongoose from "mongoose";
const stripe = require("stripe")(process.env.STRAPI_SECRET_KEY);
import Order from "../entities/Order";
import { IOrder } from "../interfaces/order";
import { IProduct } from "../interfaces/product";

function calcPrice(price: number, discount: number, quantity: number) {
  if (!discount) return price * quantity;

  const discountAmount = (price * discount) / 100;

  const priceTemp = price - discountAmount;
  return priceTemp * quantity;
}

let totalPayment = 0;
export class OrderController {
  async create(req: Request, res: Response) {
    const { tokenStripe, products, idUser, addressShipping } = req.body;

    products.forEach((product: IProduct) => {
      const priceProduct = calcPrice(
        product.price,
        product.discount,
        product.quantity!
      );
      totalPayment += priceProduct;
    });

    const charge = await stripe.charges.create({
      amount: totalPayment.toFixed(0),
      currency: "clp",
      source: tokenStripe,
      description: `ID Usuario: ${idUser}`,
    });

    const data = {
      user: idUser,
      totalPayment,
      products,
      idPayment: charge.id,
      addressShipping,
    };

    const newOrder = new Order(data);

    try {
      await newOrder.save();
      return res.status(201).json({ newOrder, msg: "Agregado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
    // }
  }

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;

    try {
      const orders = await Order.find({
        take: Number(limit),
        skip: Number(offset),
      })
        .populate("user products addressShipping")
        .where("user")
        .equals(req.user);

      return res.json(orders);
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async findOne(req: Request, res: Response) {}

  async update(req: Request, res: Response) {}

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Favotito no valida");
      return res.status(400).json({ msg: e.message });
    }
  }
}
