import multer from "multer"
import path from "path"

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        if (file.fieldname === 'bookFile') {
            cb(null, "public/uploads/books")
        } else if (file.fieldname === 'photoProfile') {
            cb(null, "public/uploads/profiles")
        } else {
            cb(null, "public/uploads/covers")
        }
    },
    filename : (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        let prefix = "file-";
        if (file.fieldname === 'bookFile') prefix = "book-";
        else if (file.fieldname === 'photoProfile') prefix = "profile-";
        else if (file.fieldname === 'cover') prefix = "cover-";
        cb(null, prefix + unique + ext)
    }
})

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "bookFile") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("File buku harus berformat PDF!"), false);
    }
  } 
  else if (file.fieldname === "cover" || file.fieldname === "photoProfile") {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("File harus berupa gambar (JPG/PNG)!"), false);
    }
  } 
  else {
    cb(new Error("Field tidak dikenali!"), false);
  }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 10,
    }
});

export default upload;