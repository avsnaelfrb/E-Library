import prisma from "../config/prismaConfig.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, nim } = req.body;

  const existUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existUser) {
    return next(new AppError("Email sudah terdaftar", 400));
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const defaultProfile = `/defaultProfile/default.jpeg`

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      nim,
      role: "USER",
      photoProfile: defaultProfile
    },
  });

  res.status(201).json({
    status: "success",
    message: "Berhasil registrasi user baru",
    data: newUser,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Email atau password salah", 401));
  }

  const payload = { id: user.id, role: user.role };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });

  res.status(200).json({
    status: "success",
    message: "berhasil login",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nim: user.nim
    },
    token,
  });
});

export const editPhotoProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photoProfilePath } = req.body

  const userExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!userExist) {
    return next(new AppError("User tidak ditemukan", 404));
  }

  if (!photoProfilePath) {
    return next(new AppError('Tidak ada file yang di upload', 400))
  }
  
  const updateData = {
    updatedAt: new Date(),
  };
  
  if (photoProfilePath) {
    updateData.photoProfile = photoProfilePath
  }

  const newProfile = await prisma.user.update({
    where: { id },
    data: updateData
  });

  res.status(200).json({
    status: "success",
    message: "Berhasil mengupload foto profile",
    data: newProfile,
  });
});
