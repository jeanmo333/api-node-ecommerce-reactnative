import express from "express";
import { ProductController } from "../controllers/ProductController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

router.get("/", new ProductController().findAll);
router.get("/:term", new ProductController().findOne);

//protected routes
router.use(authMiddleware);
router.post("/", new ProductController().create);
router.put("/:id", new ProductController().update);
router.delete("/:id", new ProductController().remove);

export default router;
