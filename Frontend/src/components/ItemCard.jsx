import React, { useState } from "react";
import api from "../utils/api";

export default function ItemCard({ item, onBorrowSuccess }) {
  const rawCover = item.coverUrl || item.cover;

  const API_RAW = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
  const API_BASE = API_RAW.replace(/\/api\/?$/i, "") || 'http://localhost:5000'

  const cover =
    rawCover && rawCover.startsWith("http")
      ? rawCover
      : rawCover
      ? `${API_BASE}${rawCover}`
      : null;

  const isPhysical = item.category === "PHYSICAL";
  const isDigital = item.category === "DIGITAL";
  const isAvailable = isPhysical ? item.stock > 0 : true;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleBorrow = async () => {
    if (!isPhysical || !isAvailable || loading) return;

    try {
      setLoading(true);
      setErrorMsg("");

      // POST /api/borrow/:bookId
      const res = await api.post(`/borrow/${item.id}`);
      console.log("borrow result:", res.data);

      // optional: let parent refetch data
      if (onBorrowSuccess) onBorrowSuccess(res.data.data);

      alert("Berhasil meminjam buku!");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Gagal meminjam buku";
      setErrorMsg(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRead = () => {
    if (!isDigital || !item.fileUrl) return;

    const url = item.fileUrl.startsWith("http")
      ? item.fileUrl
      : `${API_BASE}${item.fileUrl}`; // e.g. /uploads/books/xxx.pdf

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex gap-3 lg:gap-4 p-3 lg:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Book Cover */}
      <div className="w-16 h-24 sm:w-20 sm:h-28 lg:w-24 lg:h-32 flex-shrink-0 rounded overflow-hidden bg-gray-100">
        {cover ? (
          <img
            src={cover}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", cover);
              e.currentTarget.onerror = null;
              e.currentTarget.src = `${API_BASE}/uploads/placeholder-book.png`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg mb-1 line-clamp-2">
            {item.title}
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mb-1">
            {item.author}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 mb-2">
            {item.description || "-"}
          </div>

          {/* Badges: category + stock */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-xs mb-2">
            {/* Category */}
            <span
              className={`px-2 py-1 rounded-full border ${
                isPhysical
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}
            >
              {isPhysical ? "Fisik" : "Digital"}
            </span>

            {/* Stock (only makes sense for physical) */}
            {isPhysical && (
              <span
                className={`px-2 py-1 rounded-full border ${
                  isAvailable
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {isAvailable ? `Tersedia (${item.stock})` : "Habis"}
              </span>
            )}
          </div>
        </div>

        {/* Actions: borrow or read */}
        <div className="flex gap-2 mt-2">
          {isPhysical && (
            <button
              type="button"
              onClick={handleBorrow}
              disabled={!isAvailable || loading}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border transition
                ${
                  !isAvailable || loading
                    ? "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
                    : "bg-green-600 text-white border-green-600 hover:bg-green-700"
                }`}
            >
              {loading ? "Memproses..." : "Pinjam"}
            </button>
          )}

          {isDigital && (
            <button
              type="button"
              onClick={handleRead}
              disabled={!item.fileUrl}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium border transition
                ${
                  item.fileUrl
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed"
                }`}
            >
              Baca
            </button>
          )}
        </div>

        {errorMsg && (
          <p className="text-[10px] sm:text-xs text-red-500 mt-1">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}






