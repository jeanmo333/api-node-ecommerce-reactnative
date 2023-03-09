import express from "express";
import { UploadController } from "../controllers/UploadController";
const router = express.Router();
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkUploadFile } from "../middlewares/checkUploadFile";

router.get("/", new UploadController().findAll);
router.get("/:model/:id", new UploadController().showFile);

//protected routes
router.use(checkUploadFile);
router.use(authMiddleware);
router.post("/", new UploadController().createFile);
//router.put("/:model/:id", new UploadController().updateModel);
router.put("/:model/:id", new UploadController().updateModelCloudinary);
router.delete("/:id", new UploadController().remove);

export default router;
