import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [readHistory, setReadHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const getBackendOrigin = () => {
    const base = api?.defaults?.baseURL || '';
    if (!base) return 'http://localhost:5000';
    return base.replace(/\/api\/?$/, '');
  };

  const getProfilePicture = (photoProfile) => {
    if (!photoProfile) return null;
    const backendOrigin = getBackendOrigin();
    
    // If it's already a full URL
    if (/^https?:\/\//.test(photoProfile)) return photoProfile;
    
    // If it starts with /, prepend backend origin
    if (photoProfile.startsWith('/')) return `${backendOrigin}${photoProfile}`;
    
    // Otherwise, add / and prepend
    return `${backendOrigin}/${photoProfile}`;
  };

  useEffect(() => {
    const loadProfileAndHistory = async () => {
      setLoading(true);
  
      try {
        const userData = JSON.parse(localStorage.getItem("currentUser"));
        if (userData) {
          setProfile(userData);

          const [borrowRes, readRes] = await Promise.all([
            api.get("/borrow/userBorrow"),   
            api.get("/readlog/userLog"),   
          ]);
  
          setBorrowHistory(borrowRes.data?.data || []);
          setReadHistory(readRes.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to load profile/history:", err);
      } finally {
        setLoading(false);
      }
    };
  
    loadProfileAndHistory();
  }, []);  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Format file harus JPG, PNG, atau WEBP');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setUploadSuccess('');

    const formData = new FormData();
    formData.append('photoProfile', file);

    const res = await api.put(`/user/photo-profile/${profile.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      const updatedUser = res.data.data;
      
      // Update profile state
      setProfile(prev => ({
        ...prev,
        photoProfile: updatedUser.photoProfile
      }));

      // Update localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      currentUser.photoProfile = updatedUser.photoProfile;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));

      setUploadSuccess('Foto profil berhasil diubah!');
      setTimeout(() => setUploadSuccess(''), 3000);
    }

    setUploading(false);
  };

  const triggerFileInput = () => {
    document.getElementById('photoProfileInput').click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 lg:py-20">
        <div className="animate-spin rounded-full h-10 w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !uploading) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-3 lg:p-4 rounded text-sm lg:text-base">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  const isAdmin = profile?.role === 'ADMIN';

  return (
    <div className="content-fixed">
      <div className="page-container">
        <div className="max-w-full lg:max-w-3xl mx-auto">
          {/* Success Message */}
          {uploadSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 lg:p-4 rounded mb-4 text-sm lg:text-base">
              <p className="text-green-700">{uploadSuccess}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 lg:p-4 rounded mb-4 text-sm lg:text-base">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Profil</h2>
            
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              {/* Profile Picture with Upload */}
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="relative group">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex-shrink-0">
                    {profile?.photoProfile ? (
                      <img
                        src={getProfilePicture(profile.photoProfile)}
                        alt={profile?.name || 'Profile'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239CA3AF"%3E%3Cpath d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/%3E%3C/svg%3E';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 lg:w-20 lg:h-20" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Upload overlay - shows on hover */}
                  {!uploading && (
                    <div 
                      onClick={triggerFileInput}
                      className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}

                  {/* Loading spinner */}
                  {uploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  id="photoProfileInput"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploading}
                />

                {/* Upload button for mobile */}
                <button
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="sm:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Mengupload...' : 'Ubah Foto'}
                </button>

                {/* Upload info */}
                <p className="text-xs text-gray-500 text-center sm:text-left max-w-[150px]">
                  Klik foto untuk mengubah. Max 5MB (JPG, PNG, WEBP)
                </p>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-24">Nama:</span>
                  <span className="text-gray-800 text-sm lg:text-base">{profile?.name || '-'}</span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-24">Email:</span>
                  <span className="text-gray-800 text-sm lg:text-base break-all">{profile?.email || '-'}</span>
                </div>

                {/* NIM - Only for USER */}
                {!isAdmin && profile?.nim && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-24">NIM:</span>
                    <span className="text-gray-800 text-sm lg:text-base">{profile.nim}</span>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-gray-600 font-medium text-sm lg:text-base sm:w-24">Role:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs lg:text-sm font-medium w-fit ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {profile?.role || 'USER'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* History Card - Only for USER */}
          {/* History Card - Only for USER */}
{!isAdmin && (
  <div className="space-y-6">
    {/* Riwayat Peminjaman */}
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">
        Riwayat Peminjaman
      </h2>

      {borrowHistory.length === 0 ? (
        <div className="py-8 lg:py-12 text-center">
          <svg
            className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-3 lg:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-sm lg:text-base">
            Belum ada riwayat peminjaman
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {borrowHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-sm lg:text-base text-gray-900">
                {item.book?.title || "Judul tidak tersedia"}
              </p>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">
                Status:{" "}
                <span className="font-medium">{item.status}</span>
              </p>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Tgl pinjam:{" "}
                {item.borrowDate
                  ? new Date(item.borrowDate).toLocaleDateString()
                  : "-"}
                {item.returnDate && (
                  <>
                    {" "}
                    • Dikembalikan:{" "}
                    {new Date(item.returnDate).toLocaleDateString()}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Riwayat Membaca */}
    <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg lg:text-xl font-bold text-gray-800 mb-3 lg:mb-4">
        Riwayat Membaca
      </h2>

      {readHistory.length === 0 ? (
        <p className="text-gray-500 text-sm lg:text-base">
          Belum ada riwayat membaca. Riwayat akan tercatat ketika admin
          mengkonfirmasi pengembalian buku yang Anda pinjam.
        </p>
      ) : (
        <div className="space-y-3">
          {readHistory.map((log) => (
            <div
              key={log.id}
              className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-semibold text-sm lg:text-base text-gray-900">
                {log.book?.title || "Judul tidak tersedia"}
              </p>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">
                {log.book?.author || "-"}{" "}
                {log.book?.type && <>• {log.book.type}</>}
              </p>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">
                Dibaca pada: {new Date(log.readAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}