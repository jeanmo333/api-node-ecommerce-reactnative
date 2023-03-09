import path from "path";
import { v4 as uuidv4 } from "uuid";

export const uploadFiles = (
  files: any,
  validExtentions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { archive } = files;
    const cutName = archive.name.split(".");
    const extention = cutName[cutName.length - 1];

    // Validar la extension
    if (!validExtentions.includes(extention)) {
      return reject(
        `La extensión ${extention} no es permitida, las validas son: ${validExtentions}`
      );
    }

    const nameTemp = uuidv4() + "." + extention;
    const uploadPath = path.join(__dirname, "../../uploads", folder, nameTemp);

    archive.mv(uploadPath, (err: any) => {
      if (err) {
        reject(err);
      }
      resolve(nameTemp);
    });
  });
};

// const { archive } = req.files as any;
// const cutName = archive.name.split(".");
// const extention = cutName[cutName.length - 1];

// const validExtentions = ["png", "jpg", "jpeg", "gif"];

// // Validar la extension
// if (!validExtentions.includes(extention)) {
//   return res.status(400).json({
//     msg: `La extensión ${extention} no es permitida, las validas son: ${validExtentions}`,
//   });
// }

// const nameTemp = uuidv4() + "." + extention;
// const uploadPath = path.join(__dirname, "../../uploads", nameTemp);
// archive.mv(uploadPath, (err: any) => {
//   if (err) {
//     return res.status(500).json({ err });
//   }

//   res.json({ msg: "File uploaded to " + uploadPath });
// });
