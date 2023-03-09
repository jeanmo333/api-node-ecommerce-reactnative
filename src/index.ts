import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRoutes from "./routes/userRoutes";
import conectarDB from "./config/db";
import addressRoutes from "./routes/addressRoutes";
import productRoutes from "./routes/productRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import favoriteRoutes from "./routes/favoriteRoutes";
import orderRoutes from "./routes/orderRoutes";
import homeBannerRoutes from "./routes/homeBannerRoutes";
import seachRoutes from "./routes/seachRoutes";

const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

// const dominiosPermitidos = [process.env.FRONTEND_URL];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (dominiosPermitidos.indexOf(origin) !== -1) {
//       // El Origen del Request esta permitido
//       callback(null, true);
//     } else {
//       callback(new Error("No permitido por CORS"));
//     }
//   },
// };

app.use(cors());

//carga de archivo
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/products", productRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/home-banner", homeBannerRoutes);
app.use("/api/search", seachRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
