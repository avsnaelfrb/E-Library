// DashboardAdmin.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Barang from './Barang';
import Pengadaan from './Pengadaan';
import Peminjaman from './Peminjaman';
import Pengembalian from './Pengembalian';
import Profile from './Profile';

export default function DashboardAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = (localStorage.getItem('role') || 'ADMIN').toUpperCase();

  if (role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        role={role} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:ml-0">
        <Navbar 
          title="Dashboard Admin" 
          onMenuClick={() => setSidebarOpen(v => !v)} 
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="barang" replace />} />
            <Route path="barang/*" element={<Barang />} />
            <Route path="pengadaan" element={<Pengadaan />} />
            <Route path="peminjaman" element={<Peminjaman />} />
            <Route path="pengembalian" element={<Pengembalian />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}