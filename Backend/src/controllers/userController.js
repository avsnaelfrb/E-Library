import catchAsync from "../utils/catchAsync.js";
import * as userService from "../service/userService.js"

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, nim } = req.body;

  const result = await userService.registerLogic(name, email, password, nim)

  res.status(201).json({
    status: "success",
    message: "Berhasil registrasi user baru",
    data: result,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const token = await userService.loginLogic(email, password);

  res.status(200).json({
    status: "success",
    message: "berhasil login",
    token,
  });
});

export const editPhotoProfile = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { photoProfilePath } = req.body

  const newProfile = await userService.editPhotoProfile(id, photoProfilePath)

  res.status(200).json({
    status: "success",
    message: "Berhasil mengupload foto profile",
    data: newProfile,
  });
});
