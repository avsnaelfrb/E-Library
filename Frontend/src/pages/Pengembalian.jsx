import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Pengembalian() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      // GET /api/borrow?status=RETURNED
      const res = await api.get("/borrow", {
        params: { status: "RETURNED", limit: 50 },
      });

      setReturns(res.data?.data || []);
    } catch (err) {
      console.error("Failed to load returns", err);
      const msg =
        err.response?.data?.message || err.message || "Gagal memuat data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Riwayat Pengembalian</h2>

      {loading && <p className="text-gray-500">Memuat data...</p>}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      {!loading && returns.length === 0 && !error && (
        <p className="text-gray-500">Belum ada buku yang dikembalikan</p>
      )}

      {!loading && returns.length > 0 && (
        <div className="space-y-3">
          {returns.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-medium">
                  {r.book?.title || "Judul tidak tersedia"}
                </div>
                <div className="text-sm text-gray-500">
                  Oleh: {r.user?.name || "-"}{" "}
                  {r.user?.nim && <>• NIM: {r.user.nim}</>} <br />
                  Dikembalikan pada:{" "}
                  {r.returnDate
                    ? new Date(r.returnDate).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
