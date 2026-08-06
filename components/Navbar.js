"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 ambient-shadow-nav border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-extrabold text-lg">D</span>
            </div>
            <div>
              <span className="text-primary font-display font-bold text-lg leading-none tracking-tight">
                Dream Homes
              </span>
              <span className="block text-secondary font-bold text-[10px] tracking-widest uppercase mt-0.5">
                PG Jodhpur
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary hover:bg-purple-50/60 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all"
            >
              Home
            </Link>
            <Link
              href="/pgs"
              className="text-gray-700 hover:text-primary hover:bg-purple-50/60 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all"
            >
              All PGs
            </Link>
            <Link
              href="/complaints"
              className="text-gray-700 hover:text-primary hover:bg-purple-50/60 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all"
            >
              Raise Complaint
            </Link>
            <Link
              href="/track"
              className="text-gray-700 hover:text-primary hover:bg-purple-50/60 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all"
            >
              Track Complaint
            </Link>
            <Link
              href="/availability"
              className="text-gray-700 hover:text-primary hover:bg-purple-50/60 font-semibold text-sm px-3.5 py-2 rounded-xl transition-all"
            >
              Room Alerts
            </Link>
            <Link
              href="/login?role=tenant"
              className="ml-1 bg-purple-100 hover:bg-purple-200 text-purple-800 px-3.5 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1"
            >
              <span>🏠</span> Tenant Login
            </Link>
            <Link
              href="/login?role=owner"
              className="bg-primary hover:bg-primary-container text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1"
            >
              <span>🏢</span> Owner Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 pt-2 border-t border-gray-100 animate-fadeIn">
            <Link href="/" className="block px-3 py-2 text-gray-700 font-semibold hover:bg-purple-50 rounded-xl">
              Home
            </Link>
            <Link href="/pgs" className="block px-3 py-2 text-gray-700 font-semibold hover:bg-purple-50 rounded-xl">
              All PGs
            </Link>
            <Link href="/complaints" className="block px-3 py-2 text-gray-700 font-semibold hover:bg-purple-50 rounded-xl">
              Raise Complaint
            </Link>
            <Link href="/track" className="block px-3 py-2 text-gray-700 font-semibold hover:bg-purple-50 rounded-xl">
              Track Complaint
            </Link>
            <Link href="/availability" className="block px-3 py-2 text-gray-700 font-semibold hover:bg-purple-50 rounded-xl">
              Room Alerts
            </Link>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/login?role=tenant" className="px-3 py-2.5 bg-purple-100 text-purple-800 font-bold rounded-xl text-center text-xs">
                🏠 Tenant Login
              </Link>
              <Link href="/login?role=owner" className="px-3 py-2.5 bg-primary text-white font-bold rounded-xl text-center text-xs shadow-sm">
                🏢 Owner Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
