import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

import appConfig from "../config/appConfig.js";

export const borrowBook = catchAsync(async (req, res, next) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    return next(new AppError("Buku tidak ditemukan", 404));
  }

  if (book.category === 'DIGITAL') {
    return next(new AppError('Buku digital tidak perlu dipinjam, silahkan langsung baca', 400))
  }

  if (book.stock <= 0) {
    return next(new AppError("Stock buku habis", 400));
  }

  const existingBorrow = await prisma.borrow.findFirst({
    where: {
      userId: userId,
      bookId: bookId,
      status: "BORROWED"
    }
  });

  if (existingBorrow) {
    return next(new AppError('Anda sedang meminjam buku ini. Harap kembalikan terlebih dahulu', 400))
  }

  const activeBorrowCount = await prisma.borrow.count({
    where: {
      userId: userId,
      status: "BORROWED"
    }
  })

  if (activeBorrowCount >= 3) {
    return next(new AppError('Anda telah mencapai batas peminjaman (maksimal 3 buku)', 400))
  }

  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + appConfig.BORROW_DURATION_DAYS);

  const result = await prisma.$transaction(async (tx) => {
    await tx.book.update({
      where: { id: bookId },
      data: { stock: {decrement: 1} },
    });

    const newBorrow = await tx.borrow.create({
      data: {
        userId,
        bookId,
        borrowDate: now,
        dueDate: dueDate,
        status: "BORROWED"
      }
    })

    return newBorrow;
  })

  res.status(201).json({
    status: "success",
    message: "berhasil meminjam buku",
    data: result,
  });
});

export const requestReturn = catchAsync(async (req, res, next) => {
  const { borrowId } = req.params
  const userId = req.user.id

  const borrow = await prisma.borrow.findUnique({
    where: { id: borrowId }
  })

  if (!borrow) {
    return next(new AppError('Data peminjaman tidak ditemukan', 404))
  }

  if (borrow.userId !== userId) {
    return next(new AppError("Anda tidak memiliki akses ke peminjaman ini", 403));
  }

  if (borrow.status !== 'BORROWED') {
    return next(new AppError('Buku tidak dipinjam', 400))
  }

  const updateStatus = await prisma.borrow.update({
    where: { id: borrowId },
    data: { status: 'REQUESTED' }
  })

  res.status(200).json({
    status: "success",
    message: "Berhasil melakukan request pengembalian buku",
    data: updateStatus
  });
});

export const confirmReturn = catchAsync(async (req, res, next) => {
  const { borrowId } = req.params

  const borrow = await prisma.borrow.findUnique({
    where: { id: borrowId }
  })

  if (!borrow) {
    return next(new AppError('Data pinjaman tidak ditemukan', 404))
  }

  if (borrow.status === 'RETURNED') {
    return next(new AppError('Buku sudah dikembalikan sebelumnya', 400))
  }

  const returnDate = new Date();
  const isOverDue = returnDate > new Date(borrow.dueDate);

  let overDueMessage = "";
  if (isOverDue) {
    const diffTime = Math.abs(returnDate - new Date(borrow.dueDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    overDueMessage = `(Terlambat ${diffDays} hari!)`
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedBorrow = await tx.borrow.update({
      where: { id: borrowId },
      data: {
        status: "RETURNED",
        returnDate: returnDate,
      }
    })

    await tx.book.update({
      where: { id: borrow.bookId },
      data: {
        stock: { increment: 1 }
      }
    })

    return updatedBorrow
  })

  res.status(200).json({
    status: "success",
    message: `Buku berhasil dikembalikan ${overDueMessage}.`,
    data: result,
  });
}); 

export const getAllBorrow = catchAsync(async (req, res) => {
  // Get pagination query params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalCount = await prisma.borrow.count();

  const borrows = await prisma.borrow.findMany({
    include: {
      user: { select: { name: true, email: true } },
      book: { select: { title: true } },
    },
    orderBy: { borrowDate: "desc" },
    skip,
    take: limit,
  });

  res.status(200).json({
    status: "success",
    message: "berhasil mengambil data pinjaman buku",
    meta: {
      total: totalCount,
      page,
      limit,
      pages: Math.ceil(totalCount / limit),
    },
    data: borrows,
  });
});
