import fs from "fs";
import { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import * as dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL || "");

import Product from "../entities/Product";
import User from "../entities/User";
import { uploadFiles } from "../helpers/upload-file";
import HomeBanner from "../entities/Home-banner";

export class UploadController {
  async createFile(req: Request, res: Response) {
    try {
      //   const nameFiles = await uploadFiles(
      //     req.files,
      //     ["txt", "md", "png"],
      //     "textos"
      //   );
      const nameFiles = await uploadFiles(req.files, undefined, "imgs");

      res.json({ nameFiles });
    } catch (msg) {
      res.status(400).json({ msg });
    }
  }

  async findAll(req: Request, res: Response) {}

  async showFile(req: Request, res: Response) {
    const { id, model } = req.params;

    const validmodels = ["users", "products"];

    //validar mongoid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("id no valido");
      return res.status(400).json({ msg: e.message });
    }
    //validar modelos permitido
    if (!validmodels.includes(model)) {
      const e = new Error(
        `El modelo ${model} no es permitida, las validas son ${validmodels}`
      );
      return res.status(400).json({ msg: e.message });
    }

    //aca switch
    let colection: any;

    switch (model) {
      case "users":
        colection = await User.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Usuario no existe`,
          });
        }

        // montrar imágenes
        if (colection.image) {
          const pathImage = path.join(
            __dirname,
            "../../uploads",
            model,
            colection.image
          );
          if (fs.existsSync(pathImage)) {
            return res.sendFile(pathImage);
          }
        }

        const userFile = await uploadFiles(req.files, undefined, model);
        colection.image = userFile;
        await colection.save();
        break;

      case "products":
        colection = await Product.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Producto no existe`,
          });
        }

        // montrar imágenes
        if (colection.images) {
          colection.images.map((image: any) => {
            const pathImage = path.join(
              __dirname,
              "../../uploads",
              model,
              image[0]
            );

            if (fs.existsSync(pathImage)) {
              return res.sendFile(pathImage);
            }
          });
        }

        break;

      default:
        return res.status(500).json({ msg: "Se me olvidó validar esto" });
    }

    const pathImage = path.join(__dirname, "../../assets/no-image.jpg");
    res.sendFile(pathImage);
  }

  async updateModel(req: Request, res: Response) {
    const { id, model } = req.params;

    const validmodels = ["users", "products"];

    //validar mongoid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("id no valido");
      return res.status(400).json({ msg: e.message });
    }
    //validar modelos permitido
    if (!validmodels.includes(model)) {
      const e = new Error(
        `El modelo ${model} no es permitida, las validas son ${validmodels}`
      );
      return res.status(400).json({ msg: e.message });
    }

    //aca switch
    let colection: any;

    switch (model) {
      case "users":
        colection = await User.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Usuario no existe`,
          });
        }

        // Limpiar imágenes previas
        if (colection.image) {
          // Hay que borrar la imagen del servidor
          const pathImage = path.join(
            __dirname,
            "../../uploads",
            model,
            colection.image
          );
          if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
          }
        }

        const userFile = await uploadFiles(req.files, undefined, model);
        colection.image = userFile;
        await colection.save();
        break;

      case "products":
        colection = await Product.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Producto no existe`,
          });
        }

        // // Limpiar imágenes previas
        // if (colection.images[0]) {
        //   // Hay que borrar la imagen del servidor

        //   const pathImage = path.join(
        //     __dirname,
        //     "../../uploads",
        //     model,
        //     colection.images[0]
        //   );

        //   if (colection.images.length < 3) {
        //     if (fs.existsSync(pathImage)) {
        //       fs.unlinkSync(pathImage);
        //     }
        //   }
        // }

        const nameFiles = await uploadFiles(req.files, undefined, model);

        if (colection.images.length < 3) {
          colection.images = [...colection.images, nameFiles];
        }

        // if (colection.main_image === "") {
        //   colection.main_image = nameFiles;
        // }

        await colection.save();
        break;

      default:
        return res.status(500).json({ msg: "Se me olvidó validar esto" });
    }

    res.json(colection);
  }

  async updateModelCloudinary(req: Request, res: Response) {
    const { id, model } = req.params;

    const validmodels = ["users", "products", "home-banner"];

    //validar mongoid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("id no valido");
      return res.status(400).json({ msg: e.message });
    }
    //validar modelos permitido
    if (!validmodels.includes(model)) {
      const e = new Error(
        `El modelo ${model} no es permitida, las validas son ${validmodels}`
      );
      return res.status(400).json({ msg: e.message });
    }

    //aca switch
    let colection: any;
    const { tempFilePath } = req.files!.archive as any;

    switch (model) {
      case "users":
        colection = await User.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Usuario no existe`,
          });
        }

        // Limpiar imágenes previas cloudinary
        if (colection.image) {
          const arrayName = colection.image.split("/");
          const nameFile = arrayName[arrayName.length - 1];
          const [public_id] = nameFile.split(".");
          cloudinary.uploader.destroy(public_id);
        }

        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        colection.image = secure_url;
        await colection.save();
        break;

      case "home-banner":
        colection = await HomeBanner.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Banner no existe`,
          });
        }

        // Limpiar imágenes previas cloudinary
        if (colection.banner) {
          const arrayName = colection.banner.split("/");
          const nameFile = arrayName[arrayName.length - 1];
          const [public_id] = nameFile.split(".");
          cloudinary.uploader.destroy(public_id);
        }

        const responseBanner = await cloudinary.uploader.upload(tempFilePath);
        colection.banner = responseBanner.secure_url;
        await colection.save();
        break;

      case "products":
        colection = await Product.findById(id);
        if (!colection) {
          return res.status(400).json({
            msg: `Producto no existe`,
          });
        }

        // Limpiar imágenes previas cloudinary

        // if (colection.images.length < 3) {
        //   //let arrayName: any;
        //   colection.images.map((image: any) => {
        //     const arrayName = image[2].split("/");
        //     const nameFile = arrayName[arrayName.length - 1];
        //     const [public_id] = nameFile.split(".");
        //     cloudinary.uploader.destroy(public_id);
        //   });
        // }

        const response = await cloudinary.uploader.upload(tempFilePath);
        colection.images = [...colection.images, response.secure_url];
        // if (colection.images.length < 3) {
        //   colection.images = [...colection.images, response.secure_url];
        // }

        await colection.save();

        break;

      default:
        return res.status(500).json({ msg: "Se me olvidó validar esto" });
    }

    res.json(colection);
  }

  async remove(req: Request, res: Response) {}
}
