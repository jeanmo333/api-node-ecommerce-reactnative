import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../entities/Product";
const { ObjectId } = require("mongoose").Types;

const validmodels = ["users", "products"];

const searchProducts = async (query = "", res: Response) => {
  const isMongoID = ObjectId.isValid(query); // TRUE

  if (isMongoID) {
    if (!isMongoID) {
      const e = new Error("Termino no valido");
      return res.status(400).json({ msg: e.message });
    }
    const product = await Product.findById(query);
    return res.json({
      results: product ? [product] : [],
      // results: usuario ? [usuario] : [],
    });
  } else {
    const regex = new RegExp(query, "i");
    const products = await Product.find({
      title: regex,
    }).populate("title");

    res.json({
      results: products,
    });
    // return   res.json({
    //   results: [],
    // });
  }
};

export class SearchController {
  async searchModel(req: Request, res: Response) {
    const { query, model } = req.params;

    if (!validmodels.includes(model)) {
      return res.status(400).json({
        msg: `Los modelos permitidos son: ${validmodels}`,
      });
    }

    //aca switch
    //let colection: any;

    switch (model) {
      case "products":
        searchProducts(query, res);
        break;

      case "users":
        break;

      default:
        return res.status(500).json({ msg: "Se me olvidó validar esto" });
    }

    // res.json({ msg: "search model" });
  }

  async searchProducts(req: Request, res: Response) {
    let { query = "" } = req.params;

    query = query.toString().toLowerCase();
    // if (query.length === 0) {
    //   const e = new Error("Debe mandar el query de busqueda");
    //   return res.status(400).json({ msg: e.message });
    // }

    const products = await Product.find({
      $text: { $search: query },
    });

    return res.status(200).json(products);
  }
}
