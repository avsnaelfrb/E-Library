import AppError from "../utils/appError.js";

export const handleFilePaths = (req, res, next) => {
  req.body.coverPath = null;
  req.body.bookFilePath = null;
  req.body.photoProfilePath = null;
  req.body.bookFileSize = null;

  const formatPath = (file) => {
    let folder = 'covers'
    if (file.fieldname === 'bookFile') {
      folder = 'books'
    }
    if (file.fieldname === 'photoProfile') {
      folder = 'profiles'
    }

    return `/uploads/${folder}/${file.filename}`
  }

  if (req.files) {
    if (req.files['cover']?.[0]) {
      req.body.coverPath = `/uploads/covers/${req.files['cover'][0].filename}`;
    }

    if (req.files['bookFile']?.[0]) {
      req.body.bookFilePath = `/uploads/books/${req.files['bookFile'][0].filename}`;
      req.body.bookFileSize = req.files['bookFile'][0].size;
    }
    
    if (req.files['photoProfile']?.[0]) {
      req.body.photoProfilePath = `/uploads/profiles/${req.files['photoProfile'][0].filename}`;
    }
  }

  if (req.file) {
    const path = formatPath(req.file)

    if (req.file.fieldname === 'cover') req.body.coverPath = path;
    if (req.file.fieldname === 'bookFile') {
       req.body.bookFilePath = path;
       req.body.bookFileSize = req.file.size;
    }
    if (req.file.fieldname === 'photoProfile') req.body.photoProfilePath = path;
  }

  next();
};
