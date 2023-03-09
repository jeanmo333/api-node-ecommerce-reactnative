import { Request, Response } from "express";
import mongoose from "mongoose";
import Favorite from "../entities/Favorite";
import Product from "../entities/Product";
import { IProduct } from "../interfaces/product";

export class FavoriteController {
  async create(req: Request, res: Response) {
    const { product = "" } = req.body;

    const productExist = await Product.findOne({ _id: product });
    if (!productExist) {
      const e = new Error("producto no existe");
      return res.status(400).json({ msg: e.message });
    }

    productExist.isFavorite = true;
    productExist.user = req.user;
    try {
      await productExist.save();
      return res.status(201).json({ productExist, msg: "Agregado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const products = await Product.find({
        isFavorite: true,
        take: Number(limit),
        skip: Number(offset),
      })
        .populate("user")
        .where("user")
        .equals(req.user);

      return res.json(products);
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async findOne(req: Request, res: Response) {}

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const productExist = await Product.findOne({ id });
    if (!productExist) {
      const e = new Error("producto no existe");
      return res.status(400).json({ msg: e.message });
    }

    productExist.isFavorite = true;
    productExist.user = req.user;
    try {
      await productExist.save();
      return res.status(201).json({ productExist, msg: "editado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Favotito no valida");
      return res.status(400).json({ msg: e.message });
    }

    const product = await Product.findById(id);
    if (!product) {
      const e = new Error("Producto no existe");
      return res.status(400).json({ msg: e.message });
    }

    product.isFavorite = false;
    product.user = null;
    try {
      await product.save();
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async isFavorite(req: Request, res: Response) {
    const { term } = req.params;
    let product: null | IProduct | string;

    if (mongoose.Types.ObjectId.isValid(term)) {
      if (!mongoose.Types.ObjectId.isValid(term)) {
        const e = new Error("producto no valido");
        return res.status(400).json({ msg: e.message });
      }

      product = await Product.findById({
        _id: term,
        isFavorite: true,
      })
        .where("user")
        .equals(req.user);
    } else {
      product = await Product.findOne({
        title: term.toLowerCase(),
        isFavorite: true,
      })
        .where("user")
        .equals(req.user);
    }

    if (!product) {
      const e = new Error("Producto no existe");
      return res.status(400).json({ msg: e.message });
    }

    if (!product.isFavorite) {
      return res.status(200).json([]);
    }

    return res.json(product);
  }
}
