import AppError from "../utils/appError.js";
import prisma from "../config/prismaConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerLogic = async (name, email, password, nim) => {
    const existUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existUser) {
        throw new AppError('Email sudah terdaftar, silahkan daftar dengan Email lain', 400)
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const defaultProfile = `/defaultProfile/default.jpeg`

    return await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            nim,
            role: 'USER',
            photoProfile: defaultProfile
        },
    });
}

export const loginLogic = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email }
    })

    const comparePassword = await bcrypt.compare(password, user.password)
    if (!user || !comparePassword) {
        throw new AppError('Email atau password salah, silahkan coba lagi', 401)
    }

    const payload = { id: user.id, role: user.role }
    const secret = process.env.JWT_SECRET
    const token = jwt.sign(payload, secret, { expiresIn: "1d" })

    return token
}

export const editPhotoProfile = async (id, photoProfilePath) => {
    const userExist = await prisma.user.findUnique({
        where: { id }
    })
    if (!userExist) {
        throw new AppError('User tidak ditemukan', 404)
    }

    if (!photoProfilePath) {
        throw new AppError('Tidak ada file yang diupload', 400)
    }

    const updateData = {
        updatedAt: new Date()
    }
    if (photoProfilePath) {
        updateData.photoProfile = photoProfilePath
    }

    return await prisma.user.update({
        where: { id },
        data: updateData
    })
}