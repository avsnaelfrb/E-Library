# TODO: Implement Digital Book Support

- [x] Update src/config/multerConfig.js: Make filename dynamic based on fieldname ("book-" for bookFile, "profile-" for photoProfile, "cover-" for cover), change limits.fieldSize to limits.fileSize.
- [x] Update src/middleware/checkFile.js: Rename export to handleFilePaths, fix req.files['coverBook'] to req.files['cover'].
- [x] Update src/controllers/bookController.js: Add category: category to the data object in prisma.book.create.
- [x] Update src/routes/bookRoute.js: Change import from handleFilePath to handleFilePaths, update middleware call.
- [x] Verify changes by reading updated files.
- [ ] Test the application for file uploads.
