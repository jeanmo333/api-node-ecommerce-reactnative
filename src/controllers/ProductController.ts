import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import mongoose from "mongoose";

import * as dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");

import Product from "../entities/Product";
import { IProduct } from "../interfaces/product";

export class ProductController {
  async create(req: Request, res: Response) {
    const {
      title = "",
      description = "",
      price = "",
      discount = "",
      images = [],
      tags = [],
    } = req.body;

    //const { tempFilePath } = req.files!.archive as any;

    const titleToSave = title.toLowerCase().trim();

    if ([title, description, price].includes("")) {
      const e = new Error("Hay Campo vacio");
      return res.status(400).json({ msg: e.message });
    }

    const productExist = await Product.findOne({ title: titleToSave });
    if (productExist) {
      const e = new Error("Producto ya existe");
      return res.status(400).json({ msg: e.message });
    }
    const newProduct = new Product({
      title: titleToSave,
      description,
      price,
      discount,
      images,
      tags,
    });
    newProduct.user = req.user;

    // const response = await cloudinary.uploader.upload(tempFilePath);
    // newProduct.images = [...newProduct.images, response.secure_url] as any;
    // if (colection.images.length < 3) {
    //   colection.images = [...colection.images, response.secure_url];
    // }
    try {
      await newProduct.save();
      return res.status(201).json({ newProduct, msg: "Agregado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  //********************************************************************** */

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const products = await Product.find({
        take: Number(limit),
        skip: Number(offset),
      });

      return res.json(products);
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { term } = req.params;
    let product: null | IProduct | string;

    if (mongoose.Types.ObjectId.isValid(term)) {
      if (!mongoose.Types.ObjectId.isValid(term)) {
        const e = new Error("Producto no valido");
        return res.status(400).json({ msg: e.message });
      }

      product = await Product.findById({ _id: term });
    } else {
      product = await Product.findOne({ title: term.toLowerCase() });
    }

    if (!product) {
      const e = new Error("Producto no existe");
      return res.status(400).json({ msg: e.message });
    }

    return res.json(product);
  }

  //********************************************************************** */

  async update(req: Request, res: Response) {
    const { title, description, price, discount, images, tags } = req.body;
    const { id } = req.params;

    //const titleToSave = title.toLowerCase().trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("producto no valida");
      return res.status(400).json({ msg: e.message });
    }

    const product = await Product.findById(id);
    if (!product) {
      const e = new Error("Producto no Existe");
      return res.status(400).json({ msg: e.message });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.images = images || product.images;
    product.tags = [...product.tags, tags] || product.tags;
    try {
      const productUpdate = await product.save();
      return res.json({ productUpdate, msg: "Editado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Producto no valida");
      return res.status(400).json({ msg: e.message });
    }

    const product = await Product.findById(id);

    if (!product) {
      const e = new Error("Producto no existe");
      return res.status(400).json({ msg: e.message });
    }

    try {
      await product.deleteOne();
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }
}
