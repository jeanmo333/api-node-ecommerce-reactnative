import { Request, Response } from "express";
import mongoose from "mongoose";
import Address from "../entities/Address";
import { IAddress } from "../interfaces/address";

export class AddressController {
  async create(req: Request, res: Response) {
    const {
      title = "",
      name_lastname = "",
      address = "",
      postal_code = "",
      city = "",
      state = "",
      country = "",
      phone = "",
    } = req.body;

    const titleToSave = title.toLowerCase().trim();

    if (
      [
        title,
        name_lastname,
        address,
        postal_code,
        city,
        state,
        country,
        phone,
      ].includes("")
    ) {
      const e = new Error("Hay Campo vacio");
      return res.status(400).json({ msg: e.message });
    }

    const addressExist = await Address.findOne({ title: titleToSave })
      .where("user")
      .equals(req.user);
    if (addressExist) {
      const e = new Error("Direccion ya existe");
      return res.status(400).json({ msg: e.message });
    }
    const newAddress = new Address({
      title: titleToSave,
      name_lastname,
      address,
      postal_code,
      city,
      state,
      country,
      phone,
    });
    newAddress.user = req.user;
    try {
      await newAddress.save();
      return res.status(201).json({ newAddress, msg: "Agregado con exito" });
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
      const addresses = await Address.find({
        take: Number(limit),
        skip: Number(offset),
      })
        .populate("user")
        .where("user")
        .equals(req.user);

      return res.json(addresses);
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  //********************************************************************** */

  async findOne(req: Request, res: Response) {
    const { term } = req.params;
    let address: null | IAddress | string;

    if (mongoose.Types.ObjectId.isValid(term)) {
      if (!mongoose.Types.ObjectId.isValid(term)) {
        const e = new Error("Dirrecion no valida");
        return res.status(400).json({ msg: e.message });
      }

      address = await Address.findById({ _id: term })
        .where("user")
        .equals(req.user);
    } else {
      address = await Address.findOne({ title: term.toLowerCase() })
        .where("user")
        .equals(req.user);
    }

    if (!address) {
      const e = new Error("Dirreccion no existe");
      return res.status(400).json({ msg: e.message });
    }

    return res.json(address);
  }

  //********************************************************************** */

  async update(req: Request, res: Response) {
    const {
      title,
      name_lastname,
      address,
      postal_code,
      city,
      state,
      country,
      phone,
    } = req.body;
    const { id } = req.params;

    const titleToSave = title.toLowerCase().trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Direccion no valida");
      return res.status(400).json({ msg: e.message });
    }

    const addressObj = await Address.findById(id)
      .where("user")
      .equals(req.user);
    if (!addressObj) {
      const e = new Error("Direccion no Existe");
      return res.status(400).json({ msg: e.message });
    }

    addressObj.title = titleToSave || addressObj.title;
    addressObj.name_lastname = name_lastname || addressObj.name_lastname;
    addressObj.address = address || addressObj.address;
    addressObj.postal_code = postal_code || addressObj.postal_code;
    addressObj.city = city || addressObj.city;
    addressObj.state = state || addressObj.state;
    addressObj.country = country || addressObj.country;
    addressObj.phone = phone || addressObj.phone;
    try {
      const addressUpdate = await addressObj.save();
      return res.json({ addressUpdate, msg: "Editado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const e = new Error("Dirrecion no valida");
      return res.status(400).json({ msg: e.message });
    }

    const address = await Address.findById(id).where("user").equals(req.user);

    if (!address) {
      const e = new Error("Dirrecion no existe");
      return res.status(400).json({ msg: e.message });
    }

    try {
      await address.deleteOne();
      return res.json({ message: "Eliminado con exito" });
    } catch (error) {
      console.log(error);
      const e = new Error("revisar log servidor");
      return res.status(400).json({ msg: e.message });
    }
  }
}
