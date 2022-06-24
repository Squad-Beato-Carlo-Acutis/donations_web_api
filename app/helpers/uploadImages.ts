import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
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