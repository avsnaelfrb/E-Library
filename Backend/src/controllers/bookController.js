import prisma from "../config/prismaConfig.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import * as bookService from "../service/bookService.js"

export const createBook = catchAsync(async (req, res, next) => {
  const { title, author, description, type, genreId, stock, year, category, coverPath, bookFilePath, bookFileSize } =
    req.body;
  
  const newBook = await bookService.createBookLogic(title, author, description, type, genreId, stock, year, category, coverPath, bookFilePath, bookFileSize)

  res.status(201).json({
    status: "success",
    message: "Berhasil menambahkan data",
    data: newBook,
  });
});

export const getAllBook = catchAsync(async (req, res, next) => {
  const { genreId, type, search } = req.query;

  const books = await bookService.getAllBookLogic(genreId, type, search)

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data semua buku",
    data: books,
  });
});

export const getBookById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const book = await bookService.getBookById(id)

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
