import express from "express";
import { OrderController } from "../controllers/OrderController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

//protected routes
router.use(authMiddleware);
router.get("/", new OrderController().findAll);
router.get("/:term", new OrderController().findOne);
router.post("/", new OrderController().create);
router.put("/:id", new OrderController().update);
router.delete("/:id", new OrderController().remove);

export default router;
