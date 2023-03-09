import express from "express";
import { AddressController } from "../controllers/AddressController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

//protected routes
router.use(authMiddleware);
router.post("/", new AddressController().create);
router.get("/", new AddressController().findAll);
router.get("/:term", new AddressController().findOne);
router.put("/:id", new AddressController().update);
router.delete("/:id", new AddressController().remove);

export default router;
