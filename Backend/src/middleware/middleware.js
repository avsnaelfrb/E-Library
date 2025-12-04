import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      if (!token) {
        res.status(402).json({ message: "token tidak valid" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } else {
    return res.status(401).json({ message: "akses ditolak, token tidak ada" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(404).json({ message: "akses hanya untuk admin" });
  }
};
