// DashboardUser.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Katalog from './Katalog';
import Profile from './Profile';

export default function DashboardUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = (localStorage.getItem('role') || 'USER').toUpperCase();

  if (role !== 'USER') {
    return <Navigate to="/dashboard/barang" replace />;
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
          title="Dashboard User" 
          onMenuClick={() => setSidebarOpen(v => !v)} 
        />
        
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="katalog" replace />} />
            <Route path="katalog/*" element={<Katalog />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}