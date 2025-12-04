import prisma from "../config/prismaConfig.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createBook = catchAsync(async (req, res, next) => {
  const { title, author, description, type, genreId, stock, year, category, coverPath, bookFilePath, bookFileSize } =
    req.body;
  
  if (category === 'DIGITAL' && !bookFilePath){
    return next(new AppError('Buku digital wajib menyertakan file PDF!', 400))
  }

  const finalStock = category === 'PHYSICAL' ? (stock ? parseInt(stock) : 1) : 0; 

  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      description,
      cover: coverPath,
      fileUrl: bookFilePath,
      fileSize: bookFileSize ? parseInt(bookFileSize) : null,
      type,
      yearOfRelease: year,
      genreId: genreId,
      stock: finalStock,
      category: category,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Berhasil menambahkan data",
    data: newBook,
  });
});

export const getAllBook = catchAsync(async (req, res, next) => {
  const { genreId, type, search } = req.query;

  let filters = {};

  if (genreId) {
    filters.genreId = genreId;
  }
  if (type) {
    filters.type = type;
  }
  if (search) {
    filters.OR = [
      { title: { contains: search } },
      { author: { contains: search } },
      { description: { contains: search } },
    ];
  }
  const books = await prisma.book.findMany({
    where: filters,
    include: { genre: true },
    orderBy: { createdAt: "desc" },
  });

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data semua buku",
    data: books,
  });
});

export const getBookById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) {
    return next(new AppError(`Buku dengan ${id} tidak ditemukan`, 404));
  }

  res.status(200).json({
    status: "success",
    message: `Berhasil mengambil data buku dengan id ${id}`,
    data: book,
  });
});

export const UpdateBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, type, genreId, stock, year, category, coverPath } = req.body;

  const bookExist = await prisma.book.findUnique({
    where: { id, },
  });

  if (!bookExist) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }

  const dataToUpdate = {
    title,
    author,
    description,
    type,
    genreId,
    stock : category === 'DIGITAL' ? 0 : stock,
    yearOfRelease: year,
  };

  if (coverPath) {
    dataToUpdate.cover = coverPath;
  }

  const updatedBook = await prisma.book.update({
    where: { id, },
    data: dataToUpdate,
  });

  res.status(200).json({
    status: "success",
    message: `Berhasil mengupdate buku dengan id ${id}`,
    data: updatedBook,
  });
});

export const deleteBook = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const book = await prisma.book.findUnique({
    where: { id, },
  });
  if (!book) {
    return next(new AppError(`Buku dengan id ${id}, tidak ditemukan`, 404));
  }

  const delBook = await prisma.book.delete({
    where: { id, },
  });
  res.status(200).json({
    status: "success",
    message: `Berhasil menghapus data buku dengan id ${id}`,
    data: delBook,
  });
});
