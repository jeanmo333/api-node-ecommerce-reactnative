import { Request, Response } from "express";
import mongoose from "mongoose";
import { IBanner } from "../interfaces/banner";
import Product from "../entities/Product";
import HomeBanner from "../entities/Home-banner";

export class HomeBannerController {
  async create(req: Request, res: Response) {
    const { banner, product, position } = req.body as IBanner;

    const productExist = await Product.findOne({ _id: product });
    if (!productExist) {
      const e = new Error("Producto no existe");
      return res.status(400).json({ msg: e.message });
    }
    const newHomeBanner = new HomeBanner({
      banner,
      product,
      position,
    });

    try {
      await newHomeBanner.save();
      return res.status(201).json({ newHomeBanner, msg: "Agregado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async findAll(req: Request, res: Response) {
    const { limit = 10, offset = 0 } = req.query;
    try {
      const banner = await HomeBanner.find({
        take: Number(limit),
        skip: Number(offset),
      }).populate("product");

      return res.json(banner);
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async findOne(req: Request, res: Response) {}

  async update(req: Request, res: Response) {
    const { banner, position, product } = req.body as IBanner;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Direccion no valida");
      return res.status(400).json({ msg: e.message });
    }

    const bannerObj = await HomeBanner.findById(id)
      .where("user")
      .equals(req.user);
    if (!bannerObj) {
      const e = new Error("Banner no Existe");
      return res.status(400).json({ msg: e.message });
    }

    bannerObj.banner = banner || bannerObj.banner;
    bannerObj.product = product || bannerObj.product;
    bannerObj.position = position || bannerObj.position;
    try {
      const bannerUpdate = await bannerObj.save();
      return res.json({ bannerUpdate, msg: "Editado con exito" });
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
  }
}
