import express from "express";
import { HomeBannerController } from "../controllers/HomeBannerController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";

router.get("/", new HomeBannerController().findAll);
router.get("/:term", new HomeBannerController().findOne);

//protected routes
router.use(authMiddleware);
router.post("/", new HomeBannerController().create);
router.put("/:id", new HomeBannerController().update);
router.delete("/:id", new HomeBannerController().remove);

export default router;
