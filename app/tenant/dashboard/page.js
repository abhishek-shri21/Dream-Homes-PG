"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getTenantComplaints, createComplaint, demoTenants } from "../../../lib/db";

export default function TenantDashboard() {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  // New Complaint Modal
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [newComplaintCategory, setNewComplaintCategory] = useState("electrical");
  const [newComplaintDesc, setNewComplaintDesc] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);
  const [complaintSuccess, setComplaintSuccess] = useState("");
  const [copiedWifi, setCopiedWifi] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pg_tenant_user") || localStorage.getItem("pg_student_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const fullData = demoTenants.find(s => s.email === parsed.email || s.phone === parsed.phone) || {
            ...demoTenants[0],
            ...parsed
          };
          setTenant(fullData);
          loadComplaints(fullData.phone);
        } catch (e) {
          setTenant(demoTenants[0]);
          loadComplaints(demoTenants[0].phone);
        }
      } else {
        setTenant(demoTenants[0]);
        loadComplaints(demoTenants[0].phone);
      }
      setLoading(false);
    }
  }, []);

  const loadComplaints = async (phone) => {
    const list = await getTenantComplaints(phone || "+91 9988776655");
    setComplaints(list);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pg_tenant_user");
      localStorage.removeItem("pg_student_user");
    }
    window.location.href = "/login?role=tenant";
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!newComplaintDesc.trim()) return;

    setSubmittingComplaint(true);
    const newComp = {
      pg_id: tenant?.pg_id || "3",
      room_number: tenant?.room_number || "204",
      student_name: tenant?.name || "Tenant",
      student_phone: tenant?.phone || "+91 9988776655",
      category: newComplaintCategory,
      description: newComplaintDesc,
      priority: "medium"
    };

    const res = await createComplaint(newComp);
    setSubmittingComplaint(false);

    if (!res.error) {
      setComplaintSuccess("Complaint submitted successfully! Warden & Owner notified.");
      setNewComplaintDesc("");
      setShowComplaintModal(false);
      loadComplaints(tenant?.phone);
      setTimeout(() => setComplaintSuccess(""), 4000);
    } else {
      alert("Failed to create complaint. Please try again.");
    }
  };

  const copyWifiPassword = () => {
    if (tenant?.wifi_pass && navigator.clipboard) {
      navigator.clipboard.writeText(tenant.wifi_pass);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  if (loading || !tenant) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading Tenant Portal...</span>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">✓ Resolved</span>;
      case "assigned":
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">👤 Technician Assigned</span>;
      default:
        return <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">⏳ Pending Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                D
              </div>
              <span className="font-bold text-white hidden sm:inline text-lg">Dream Homes PG</span>
            </Link>
            <span className="text-slate-600">|</span>
            <span className="bg-purple-950 border border-purple-800/60 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
              🏠 Tenant Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:inline"
            >
              Public Site →
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-800 hover:bg-red-950/60 hover:text-red-300 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {complaintSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-2xl p-4 text-sm mb-6 flex items-center justify-between animate-fadeIn shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <span>{complaintSuccess}</span>
            </div>
            <button onClick={() => setComplaintSuccess("")} className="text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Tenant Profile Banner */}
        <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-1 flex-shrink-0 shadow-xl">
                <div className="w-full h-full bg-slate-900 rounded-[12px] flex items-center justify-center text-2xl font-black text-white">
                  {tenant.name ? tenant.name.charAt(0) : "T"}
                </div>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{tenant.name}</h1>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    Active Resident Tenant
                  </span>
                </div>
                <p className="text-purple-300 font-medium text-sm sm:text-base">
                  {tenant.pg_name} • Room <span className="font-bold text-white">{tenant.room_number}</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                  <span>📱 {tenant.phone}</span>
                  <span>✉️ {tenant.email}</span>
                  <span>📅 Move-in: {tenant.move_in_date || "Jan 2024"}</span>
                </div>
              </div>
            </div>

            {/* Quick Rent Status Pill */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl flex flex-row md:flex-col justify-between items-center md:items-end gap-2 flex-shrink-0">
              <div className="text-left md:text-right">
                <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">August Rent Status</span>
                <span className="text-lg font-bold text-emerald-400">{tenant.rent_status || "Paid"} ({tenant.rent_amount})</span>
              </div>
              <span className="text-xs text-slate-400">Next due: {tenant.rent_due_date || "05th Sep 2026"}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-800 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            📊 Stay & Room Details
          </button>
          <button
            onClick={() => setActiveTab("complaints")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "complaints"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            🔧 Complaints & Help ({complaints.length})
          </button>
          <button
            onClick={() => setActiveTab("mess")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "mess"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            🍲 Mess Schedule & Rules
          </button>
          <button
            onClick={() => setActiveTab("rent")}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === "rent"
                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/30"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            💳 Rent Receipts & Fees
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WiFi Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  📶 High-Speed WiFi
                </h3>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Connected
                </span>
              </div>
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 mb-4">
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-semibold">Network Name (SSID)</span>
                  <span className="text-sm font-mono font-bold text-purple-300">{tenant.wifi_ssid || "DreamHomes_Civil_204"}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-semibold">Password</span>
                  <span className="text-sm font-mono font-bold text-white">{tenant.wifi_pass || "DH#Civil2026"}</span>
                </div>
              </div>
              <button
                onClick={copyWifiPassword}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2"
              >
                {copiedWifi ? "✓ Copied Password!" : "📋 Copy WiFi Password"}
              </button>
            </div>

            {/* Warden & Emergency Contact */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                📞 Warden & Assistance
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">PG Warden</span>
                    <span className="text-sm font-bold text-white">{tenant.warden_name || "Ramesh Sharma"}</span>
                  </div>
                  <a
                    href={`tel:${tenant.warden_phone || "+919876511223"}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    Call Warden
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-xs text-slate-400 block">Owner Hotline</span>
                    <span className="text-sm font-bold text-white">+91 99280 12345</span>
                  </div>
                  <a
                    href="tel:+919928012345"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    Call Owner
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Complaint Box */}
            <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-800/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-white text-lg mb-2 flex items-center gap-2">
                  🛠️ Need Something Fixed?
                </h3>
                <p className="text-slate-300 text-sm mb-4">
                  Facing issues with AC, plumbing, cleaning, or WiFi? File a complaint instantly to get fast resolution.
                </p>
              </div>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/40 transition-all flex items-center justify-center gap-2 text-sm"
              >
                + Raise New Complaint
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">My Maintenance Complaints</h2>
                <p className="text-slate-400 text-xs">Track real-time status of your maintenance requests</p>
              </div>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-purple-900/40 self-start sm:self-auto"
              >
                + Raise New Complaint
              </button>
            </div>

            {complaints.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-lg font-bold text-white">No Open Complaints</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                  Everything looks good in your room! If something needs attention, click the button above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-900 border border-slate-800 hover:border-purple-800/60 rounded-3xl p-6 shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{c.categoryIcon || "💡"}</span>
                        <div>
                          <span className="text-xs font-mono text-purple-400 font-bold block">{c.id}</span>
                          <h4 className="font-bold text-white text-base capitalize">{c.categoryLabel || c.category}</h4>
                        </div>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>

                    <p className="text-slate-300 text-sm bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 mb-4">
                      "{c.description}"
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                      <span>Room {c.room_number}</span>
                      <span>{c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : "Recent"}</span>
                    </div>

                    {c.assigned_to && (
                      <div className="mt-3 bg-blue-950/40 border border-blue-800/40 p-2.5 rounded-xl text-xs text-blue-300 flex items-center justify-between">
                        <span>Assigned Technician: <strong>{c.assigned_to}</strong></span>
                        {c.assigned_to_phone && (
                          <a href={`tel:${c.assigned_to_phone}`} className="underline font-bold">Call</a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MESS & RULES */}
        {activeTab === "mess" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                🍲 Daily Mess Menu & Timings
              </h3>
              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-bold text-amber-400 text-sm mb-1">
                    <span>Breakfast</span>
                    <span>7:30 AM - 9:30 AM</span>
                  </div>
                  <p className="text-slate-300 text-xs">Poha / Aloo Paratha, Tea, Milk, Sprouts</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-bold text-amber-400 text-sm mb-1">
                    <span>Lunch</span>
                    <span>12:30 PM - 2:30 PM</span>
                  </div>
                  <p className="text-slate-300 text-xs">Roti, Paneer Butter Masala / Dal Tadka, Rice, Salad, Curd</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-bold text-amber-400 text-sm mb-1">
                    <span>Evening Snacks</span>
                    <span>5:00 PM - 6:00 PM</span>
                  </div>
                  <p className="text-slate-300 text-xs">Samosa / Pakoda & Hot Masala Tea</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex justify-between font-bold text-amber-400 text-sm mb-1">
                    <span>Dinner</span>
                    <span>8:00 PM - 10:00 PM</span>
                  </div>
                  <p className="text-slate-300 text-xs">Chapati, Mix Veg, Seasonal Special, Kheer / Gulab Jamun</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
                📜 PG House Rules & Curfew
              </h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-base">🕒</span>
                  <div>
                    <strong>Curfew Time: 10:30 PM</strong>
                    <p className="text-xs text-slate-400">Main gate locks at 10:30 PM sharp. Prior warden approval needed for late entries.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-base">👥</span>
                  <div>
                    <strong>Visitors Policy</strong>
                    <p className="text-xs text-slate-400">Visitors allowed in common lobby from 10:00 AM to 7:00 PM only.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-base">⚡</span>
                  <div>
                    <strong>Power & AC Usage</strong>
                    <p className="text-xs text-slate-400">Turn off AC and lights when leaving room to ensure power efficiency.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: RENT RECEIPTS */}
        {activeTab === "rent" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              💳 Payment Receipts & Rent Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Month</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-4 px-4 font-bold text-white">August 2026</td>
                    <td className="py-4 px-4 text-slate-200">{tenant.rent_amount || "₹8,500"}</td>
                    <td className="py-4 px-4 text-slate-400">UPI / GPay</td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                        ✓ Paid
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => alert("Downloading official rent receipt PDF...")}
                        className="text-xs text-purple-400 hover:text-purple-300 font-bold bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-lg"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-white">July 2026</td>
                    <td className="py-4 px-4 text-slate-200">{tenant.rent_amount || "₹8,500"}</td>
                    <td className="py-4 px-4 text-slate-400">Net Banking</td>
                    <td className="py-4 px-4">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-bold">
                        ✓ Paid
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => alert("Downloading official rent receipt PDF...")}
                        className="text-xs text-purple-400 hover:text-purple-300 font-bold bg-purple-950/60 border border-purple-800/40 px-3 py-1.5 rounded-lg"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* CREATE COMPLAINT MODAL */}
      {showComplaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowComplaintModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Raise Maintenance Request</h3>
            <p className="text-slate-400 text-xs mb-6">Room {tenant.room_number} • {tenant.pg_name}</p>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={newComplaintCategory}
                  onChange={(e) => setNewComplaintCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="electrical">💡 Electrical (AC, Fan, Lights, Switch)</option>
                  <option value="plumbing">🚿 Plumbing (Tap, Geyser, Water pressure)</option>
                  <option value="cleaning">🧹 Room / Washroom Cleaning</option>
                  <option value="wifi">📶 WiFi / Internet Issue</option>
                  <option value="furniture">🛋️ Bed, Chair, Door Lock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Issue Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComplaintDesc}
                  onChange={(e) => setNewComplaintDesc(e.target.value)}
                  placeholder="Describe what needs repair or attention..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComplaint}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-purple-900/40"
                >
                  {submittingComplaint ? "Submitting..." : "Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
