import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(`~${process.env.ENV_IMAGE_DIRECTORY}`)){
      //Efetua a criação do diretório
        fs.mkdirSync(`~${process.env.ENV_IMAGE_DIRECTORY}`);
    }
    cb(null, `~${process.env.ENV_IMAGE_DIRECTORY}`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.fieldname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (["image/jpeg", "image/jpg", "image/png"].includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(null, false);
};

export const customMulter = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: fileFilter,
});