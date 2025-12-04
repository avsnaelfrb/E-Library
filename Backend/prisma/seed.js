import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding...");

  await prisma.readLog.deleteMany();
  await prisma.borrow.deleteMany();
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Data lama dihapus.");

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  const admin = await prisma.user.create({
    data: {
      name: "Admin Perpus",
      email: "admin@example.com",
      nim: "00000000", 
      password: passwordHash,
      role: "ADMIN",
      photoProfile: "/defaultProfile/default.jpeg",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@example.com",
      nim: "2411102001",
      password: passwordHash,
      role: "USER",
      photoProfile: "/defaultProfile/default.jpeg",
    },
  });

  console.log("👤 User berhasil dibuat.");

  const fiksi = await prisma.genre.create({ data: { name: "Fiksi" } });
  const teknologi = await prisma.genre.create({ data: { name: "Teknologi" } });
  const sains = await prisma.genre.create({ data: { name: "Sains" } });

  console.log("📚 Genre berhasil dibuat.");

  await prisma.book.createMany({
    data: [
      {
        title: "Panduan Belajar React",
        author: "John Doe",
        description: "Buku lengkap mempelajari React JS untuk pemula.",
        type: "BOOK",
        genreId: teknologi.id,
        stock: 5,
        yearOfRelease: 2023,
        category: "PHYSICAL",
        cover: "/uploads/covers/default-book.jpeg", 
      },
      {
        title: "Sejarah Komputer",
        author: "Alan Turing",
        description: "Membahas sejarah perkembangan komputer.",
        type: "BOOK",
        genreId: teknologi.id,
        stock: 3,
        yearOfRelease: 2020,
        category: "PHYSICAL",
        cover: "/uploads/covers/default-book.jpeg",
      },
      {
        title: "Jurnal AI Modern",
        author: "OpenAI Team",
        description: "Kumpulan riset terbaru tentang AI.",
        type: "JOURNAL",
        genreId: teknologi.id,
        stock: 0, 
        yearOfRelease: 2024,
        category: "DIGITAL",
        fileUrl: "/uploads/books/dummy.pdf",
        cover: "/uploads/covers/default-journal.jpeg",
      },
      {
        title: "Harry Potter",
        author: "J.K. Rowling",
        description: "Petualangan penyihir muda.",
        type: "BOOK",
        genreId: fiksi.id,
        stock: 10,
        yearOfRelease: 2001,
        category: "PHYSICAL",
        cover: "/uploads/covers/default-book.jpeg",
      },
    ],
  });

  console.log("📖 Buku berhasil dibuat.");
  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Gagal seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });