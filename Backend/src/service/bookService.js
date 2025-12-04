import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";

export const createBookLogic = async (title, author, description, type, genreId, stock, year, category, coverPath, bookFilePath, bookFileSize) => {
    if (category === 'DIGITAL' && !bookFilePath) {
        throw new AppError('Buku digital harus menyertakan file PDF', 400)
    }

    const finalStock = category === 'PHYSICAL' ? (stock ? parseInt(stock) : 1) : 0

    return await prisma.book.create({
        data: {
            title,
            description,
            author,
            fileUrl: bookFilePath,
            cover: coverPath,
            type,
            fileSize: bookFileSize ? parseInt(bookFileSize) : null,
            genreId,
            yearOfRelease: year,
            category,
            stock: finalStock,
        }
    })
}

export const getAllBookLogic = async (genreId, type, search) => {
    let filters = {};

    if (genreId) {
        filters.genreId = genreId
    }

    if (type) {
        filters.type = type
    }

    if (search) {
        filters.OR = [
            { title: { contains: search } },
            { author: { contains: search } },
            { description: { contains: search } },
        ]
    }

    return await prisma.book.findMany({
        where: filters,
        include: { genre: true },
        orderBy: { createdAt: "desc" }
    })
}

export const getBookById = async (id) => {
    const book = await prisma.book.findUnique({
        where: { id }
    })

    if (!book) {
        throw new AppError(`Buku dengan id ${id} tidak ditemukan`, 404)
    }
}

export const updateBookLogic = async(id, title, author, description, type, genreId, stock, year, category, coverPath) => {
    const bookExist = await prisma.book.findUnique({
        where: {id}
    })
    if (!bookExist) {
        throw new AppError(`Buku tidak dengan id ${id} tidak ditemukan`, 404);   
    }

    const dataToUpdate = {
        title,
        author,
        description,
        type,
        genreId,
        stock : category === 'DIGITAL' ? 0 : stock,
        yearOfRelease: year,
    }

    if (coverPath) {
        dataToUpdate.cover = coverPath
    }

    return await prisma.book.update({
        where: { id },
        data: dataToUpdate
    })   
}

export const deleteBookLogic = async (id) => {
    const book = await prisma.book.findUnique({
        where: {id}
    })

    if (!book) {
        throw new AppError(`Buku dengan id ${id} tidak dapat ditemukan`, 404)
    }

    return await prisma.book.delete({
        where: {id}
    })
}