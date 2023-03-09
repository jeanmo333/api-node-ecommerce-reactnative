import express from "express";
import { SearchController } from "../controllers/SearchController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

//protected routes
//router.use(authMiddleware);
router.get("/:model/:query", new SearchController().searchModel);
router.get("/:query", new SearchController().searchProducts);

export default router;
