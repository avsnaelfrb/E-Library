import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Peminjaman() {
  const [requestedBorrows, setRequestedBorrows] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("requested");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/borrow", {
        params: { limit: 100 },
      });

      const allBorrows = res.data?.data || [];
      
      
      setRequestedBorrows(allBorrows.filter(b => b.status === "REQUESTED"));
      setActiveBorrows(allBorrows.filter(b => b.status === "BORROWED"));
    } catch (err) {
      console.error("Failed to load borrows", err);
      const msg = err.response?.data?.message || err.message || "Gagal memuat data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);


  const handleConfirmBorrow = async (borrowId) => {
    if (!window.confirm("Konfirmasi peminjaman buku ini?")) return;

    try {
      await api.post(`/borrow/confirm/${borrowId}`);
      alert("Peminjaman berhasil dikonfirmasi!");
      await load();
    } catch (err) {
      console.error("Failed to confirm borrow", err);
      const msg = err.response?.data?.message || err.message || "Gagal konfirmasi peminjaman";
      alert(msg);
    }
  };

  const handleReturn = async (borrowId) => {
    if (!window.confirm("Konfirmasi buku ini sudah dikembalikan?")) return;

    try {
      await api.post(`/borrow/return/${borrowId}`);
      alert("Pengembalian berhasil!");
      await load();
    } catch (err) {
      console.error("Failed to return book", err);
      const msg = err.response?.data?.message || err.message || "Gagal memproses pengembalian";
      alert(msg);
    }
  };

  return (
    <div className="content-fixed">
      <div className="page-container">
        <h2 className="text-2xl font-bold mb-6">Daftar Peminjaman</h2>

        {/* ⭐ NEW: Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab("requested")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "requested"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Menunggu Konfirmasi ({requestedBorrows.length})
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "active"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sedang Dipinjam ({activeBorrows.length})
          </button>
        </div>

        {loading && <p className="text-gray-500">Memuat data...</p>}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {activeTab === "requested" && !loading && (
          <div>
            {requestedBorrows.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Tidak ada peminjaman yang menunggu konfirmasi
              </p>
            ) : (
              <div className="space-y-3">
                {requestedBorrows.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-4 rounded-lg border border-yellow-200 shadow-sm flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                          MENUNGGU KONFIRMASI
                        </span>
                      </div>
                      <div className="font-semibold text-lg mb-1">
                        {r.book?.title || "Judul tidak tersedia"}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Peminjam: {r.user?.name || "-"}</div>
                        {r.user?.nim && <div>NIM: {r.user.nim}</div>}
                        <div>
                          Tanggal request:{" "}
                          {r.borrowDate ? new Date(r.borrowDate).toLocaleString("id-ID") : "-"}
                        </div>
                        {r.dueDate && (
                          <div>
                            Tenggat pinjam (jika dikonfirmasi):{" "}
                            {new Date(r.dueDate).toLocaleDateString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConfirmBorrow(r.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      Konfirmasi Peminjaman
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active Borrows Tab */}
        {activeTab === "active" && !loading && (
          <div>
            {activeBorrows.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Tidak ada peminjaman aktif</p>
            ) : (
              <div className="space-y-3">
                {activeBorrows.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          DIPINJAM
                        </span>
                      </div>
                      <div className="font-semibold text-lg mb-1">
                        {r.book?.title || "Judul tidak tersedia"}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Peminjam: {r.user?.name || "-"}</div>
                        {r.user?.nim && <div>NIM: {r.user.nim}</div>}
                        <div>
                          Tanggal pinjam:{" "}
                          {r.borrowDate ? new Date(r.borrowDate).toLocaleString("id-ID") : "-"}
                        </div>
                        {r.dueDate && (
                          <div>
                            Tenggat Pinjam: {new Date(r.dueDate).toLocaleDateString("id-ID")}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleReturn(r.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      Konfirmasi Pengembalian
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}