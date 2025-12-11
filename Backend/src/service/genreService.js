import prisma from "../config/prismaConfig.js";
import AppError from "../utils/appError.js";

export const createGenreLogic = async (name) => {
    const existGenre = await prisma.genre.findUnique({
        where: {name},
    })

    if (existGenre) {
        throw new AppError("Genre sudah ada", 400);
    }

    return await prisma.genre.create({
        data: {name},
    })
}

export const getAllGenreLogic = async () => {
    return await prisma.genre.findMany({
        include: { books: true },
        orderBy: { name: "asc" },
    })
}

export const getByIdLogic = async (id) => {
    const genreId = await prisma.genre.findUnique({
        where: { id },
        include: { books: true }
    });

    if (!genreId) {
        throw new AppError(`Tidak dapat menemukan genre dengan id ${id}`)
    }
    
    return genreId
}