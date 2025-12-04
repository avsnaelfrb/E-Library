import prisma from "../config/prismaConfig.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createGenre = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const existGenre = await prisma.genre.findUnique({
    where: { name },
  });

  if (existGenre) {
    return next(new AppError("Genre sudah ada", 400));
  }

  const newGenre = await prisma.genre.create({
    data: { name },
  });

  res.status(201).json({
    status: "success",
    message: "Genre berhasil ditambahkan",
    data: newGenre,
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const getAll = await prisma.genre.findMany({
    include: { books: true },
    orderBy: { name: "asc" },
  });

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil semua genre",
    data: getAll,
  });
});

export const getById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const genreId = await prisma.genre.findUnique({
    where: { id },
    include: { books: true },
  });

  if (!genreId) {
    return next(
      new AppError(`Tidak dapat menemukan genre dengan id ${id}`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Berhasil mengambil data genre",
    data: genreId,
  });
});

export const updateGenre = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const genreExist = await prisma.genre.findUnique({
    where: { id },
  });

  if (!genreExist) {
    return next(new AppError("Genre tidak ditemukan", 404));
  }

  if (name && name !== genreExist.name) {
    const nameTaken = await prisma.genre.findUnique({ where: { name } });
    if (nameTaken) {
      return next(new AppError("Nama genre sudah digunakan"));
    }
  }

  const updatedGenre = await prisma.genre.update({
    where: { id },
    data: { name },
  });

  res.status(200).json({
    status: "success",
    message: "Berhasil mengupdate genre",
    data: updatedGenre,
  });
});

export const deleteGenre = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const checkGenre = await prisma.genre.findUnique({
    where: { id },
  });

  if (!checkGenre) {
    return next(new AppError("Genre tidak ditemukan", 404));
  }

  const delGenre = await prisma.genre.delete({
    where: { id, },
  });

  res.status(200).json({
    status: "success",
    message: "Berhasil menghapus genre",
    data: delGenre,
  });
});
