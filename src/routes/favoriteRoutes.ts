import express from "express";
import { FavoriteController } from "../controllers/FavoriteController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

//protected routes
router.use(authMiddleware);
router.get("/", new FavoriteController().findAll);
router.get("/:term", new FavoriteController().findOne);
router.get("/product/:term", new FavoriteController().isFavorite);
router.post("/", new FavoriteController().create);
router.put("/:id", new FavoriteController().update);
router.delete("/:id", new FavoriteController().remove);

export default router;
