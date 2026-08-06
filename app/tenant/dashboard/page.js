"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { getTenantComplaints, createComplaint, demoTenants } from "../../../lib/db";

export default function TenantDashboard() {
  const router = useRouter();
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
      try {
        const stored = localStorage.getItem("pg_tenant_user") || localStorage.getItem("pg_student_user");
        const defaultTenant = (demoTenants && demoTenants.length > 0) ? demoTenants[0] : {
          id: "TEN001",
          email: "arjun@tenant.com",
          phone: "+91 9988776655",
          name: "Arjun Mehra",
          room_number: "204",
          pg_id: "3",
          pg_name: "Dream Homes PG - Civil Lines",
          rent_amount: "₹8,500/month",
          rent_status: "Paid",
          rent_due_date: "05th Sep 2026",
          move_in_date: "15th Jan 2024",
          bed_type: "Single Occupancy (AC)",
          warden_name: "Ramesh Sharma",
          warden_phone: "+91 98765 11223",
          wifi_ssid: "DreamHomes_Civil_204",
          wifi_pass: "DH#Civil2026",
          mess_timing: "Breakfast: 7:30 - 9:30 AM | Dinner: 8:00 - 10:00 PM"
        };

        if (stored) {
          const parsed = JSON.parse(stored);
          const matched = (demoTenants || []).find(
            (s) => s.email?.toLowerCase() === parsed.email?.toLowerCase() || s.phone === parsed.phone
          );
          const fullData = matched ? { ...matched, ...parsed } : { ...defaultTenant, ...parsed };
          setTenant(fullData);
          loadComplaints(fullData.phone || defaultTenant.phone);
        } else {
          setTenant(defaultTenant);
          loadComplaints(defaultTenant.phone);
        }
      } catch (err) {
        console.error("Error reading tenant session:", err);
        const fallback = (demoTenants && demoTenants[0]) || {
          name: "Arjun Mehra",
          room_number: "204",
          phone: "+91 9988776655",
          pg_name: "Dream Homes PG - Civil Lines"
        };
        setTenant(fallback);
        loadComplaints(fallback.phone);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  const loadComplaints = async (phone) => {
    try {
      const list = await getTenantComplaints(phone || "+91 9988776655");
      setComplaints(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching tenant complaints:", err);
      setComplaints([]);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("pg_tenant_user");
      localStorage.removeItem("pg_student_user");
    }
    router.push("/login?role=tenant");
  };

  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    if (!tenant) return;
    setSubmittingComplaint(true);

    const ticketId = "DH" + Date.now().toString().slice(-6);

    const res = await createComplaint({
      id: ticketId,
      pg_id: tenant.pg_id || "3",
      room_number: tenant.room_number || "204",
      student_name: tenant.name || "Tenant",
      student_phone: tenant.phone || "+91 9988776655",
      category: newComplaintCategory,
      description: newComplaintDesc,
      priority: "medium"
    });

    setSubmittingComplaint(false);

    if (!res.error) {
      setComplaintSuccess("Maintenance request submitted successfully! Ticket ID: " + ticketId);
      setNewComplaintDesc("");
      setShowComplaintModal(false);
      loadComplaints(tenant.phone);
      setTimeout(() => setComplaintSuccess(""), 5000);
    } else {
      alert("Failed to submit complaint. Please try again.");
    }
  };

  const copyWifiPassword = () => {
    if (tenant?.wifi_pass && typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tenant.wifi_pass);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "resolved":
        return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">✓ Resolved</span>;
      case "assigned":
        return <span className="bg-blue-500/10 text-blue-700 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">👤 Technician Assigned</span>;
      default:
        return <span className="bg-amber-500/10 text-amber-800 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">⏳ Pending Review</span>;
    }
  };

  if (loading || !tenant) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-primary font-bold">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading Tenant Portal...</span>
        </div>
      </div>
    );
  }

  const safeComplaints = Array.isArray(complaints) ? complaints : [];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      {/* Top Banner Header */}
      <div className="hero-gradient text-white py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-display font-extrabold text-white shadow-inner">
              {tenant.name ? tenant.name.charAt(0) : "T"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold">{tenant.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                  Verified Resident
                </span>
              </div>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                {tenant.pg_name} • Room <strong className="text-secondary-container">{tenant.room_number}</strong>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/70 mt-1">
                <span>📱 {tenant.phone}</span>
                <span>✉️ {tenant.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setShowComplaintModal(true)}
              className="bg-secondary-container hover:bg-secondary text-white font-display font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🛠️</span> Raise Complaint
            </button>
            <button
              onClick={handleLogout}
              className="bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs px-4 py-2.5 rounded-xl backdrop-blur-md transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
        {complaintSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 rounded-2xl p-4 text-xs font-bold flex items-center justify-between animate-fadeIn shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>{complaintSuccess}</span>
            </div>
            <button onClick={() => setComplaintSuccess("")} className="text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-[24px] border border-outline-variant/40 ambient-shadow flex gap-2 overflow-x-auto">
          {[
            { id: "overview", label: "📊 Room & Wifi Details" },
            { id: "complaints", label: `🔧 Maintenance Complaints (${safeComplaints.length})` },
            { id: "mess", label: "🍲 Mess Menu & House Rules" },
            { id: "rent", label: "💳 Rent Receipts & Fees" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-display font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "text-onSurface-variant hover:bg-surface-container"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & WIFI */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WiFi Details Box */}
            <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift space-y-4">
              <div className="flex items-center justify-between border-b border-surface-container pb-3">
                <h3 className="font-display font-bold text-primary text-base flex items-center gap-2">
                  📶 High-Speed Room WiFi
                </h3>
                <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <div className="space-y-3 bg-surface-container/60 p-4 rounded-2xl border border-outline-variant/30">
                <div>
                  <span className="text-[10px] font-bold text-onSurface-variant uppercase tracking-wider block">Network SSID</span>
                  <span className="text-xs font-mono font-bold text-primary">{tenant.wifi_ssid || "DreamHomes_Civil_204"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-onSurface-variant uppercase tracking-wider block">WiFi Password</span>
                  <span className="text-xs font-mono font-bold text-primary">{tenant.wifi_pass || "DH#Civil2026"}</span>
                </div>
              </div>
              <button
                onClick={copyWifiPassword}
                className="w-full bg-primary hover:bg-primary-container text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                {copiedWifi ? "✓ Password Copied!" : "📋 Copy WiFi Password"}
              </button>
            </div>

            {/* Warden & Owner Hotline */}
            <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift space-y-4">
              <h3 className="font-display font-bold text-primary text-base flex items-center gap-2 border-b border-surface-container pb-3">
                📞 Warden & Emergency Helpline
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
                  <div>
                    <span className="text-[10px] font-bold text-onSurface-variant uppercase tracking-wider block">PG Warden</span>
                    <span className="text-xs font-bold text-primary">{tenant.warden_name || "Ramesh Sharma"}</span>
                  </div>
                  <a
                    href={`tel:${tenant.warden_phone || "+919876511223"}`}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    Call Warden
                  </a>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-surface-container/60 rounded-2xl border border-outline-variant/30">
                  <div>
                    <span className="text-[10px] font-bold text-onSurface-variant uppercase tracking-wider block">Owner Support</span>
                    <span className="text-xs font-bold text-primary">+91 99280 12345</span>
                  </div>
                  <a
                    href="tel:+919928012345"
                    className="bg-primary hover:bg-primary-container text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm"
                  >
                    Call Owner
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Rent Summary */}
            <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-surface-container pb-3 mb-3">
                  <h3 className="font-display font-bold text-primary text-base">💳 Monthly Rent Status</h3>
                  <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {tenant.rent_status || "Paid"}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-onSurface-variant block">Monthly Rent Amount</span>
                  <span className="text-2xl font-display font-extrabold text-primary">{tenant.rent_amount || "₹8,500/month"}</span>
                </div>
              </div>
              <div className="bg-surface-container/60 p-3 rounded-2xl text-xs text-onSurface-variant">
                <span>Next Rent Due: </span>
                <strong className="text-primary">{tenant.rent_due_date || "05th Sep 2026"}</strong>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLAINTS */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-primary text-xl">Your Maintenance Tickets</h2>
              <button
                onClick={() => setShowComplaintModal(true)}
                className="bg-primary hover:bg-primary-container text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
              >
                + Raise New Complaint
              </button>
            </div>

            {safeComplaints.length === 0 ? (
              <div className="bg-white border border-outline-variant/40 rounded-[24px] p-12 text-center ambient-shadow space-y-3">
                <div className="text-5xl">🎉</div>
                <h3 className="text-lg font-display font-bold text-primary">No Active Complaints</h3>
                <p className="text-onSurface-variant text-xs max-w-sm mx-auto">
                  Everything is working smoothly in Room {tenant.room_number}. Need maintenance? Click above to log a ticket.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safeComplaints.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-surface-container pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{c.categoryIcon || c.icon || "💡"}</span>
                        <div>
                          <span className="text-xs font-mono font-bold text-primary block">{c.id}</span>
                          <h4 className="font-display font-bold text-primary text-sm capitalize">{c.categoryLabel || c.category}</h4>
                        </div>
                      </div>
                      {getStatusBadge(c.status)}
                    </div>

                    <p className="text-onSurface-variant text-xs bg-surface-container/60 p-3 rounded-2xl border border-outline-variant/30">
                      "{c.description}"
                    </p>

                    <div className="flex items-center justify-between text-xs text-onSurface-variant pt-2">
                      <span>Room {c.room_number || tenant.room_number}</span>
                      <span>{c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : "Recent"}</span>
                    </div>

                    {c.assigned_to && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-xs text-blue-900 flex items-center justify-between">
                        <span>Technician: <strong>{c.assigned_to}</strong></span>
                        {c.assigned_to_phone && (
                          <a href={`tel:${c.assigned_to_phone}`} className="font-bold underline text-blue-700">Call</a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MESS MENU & RULES */}
        {activeTab === "mess" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow space-y-4">
              <h3 className="font-display font-bold text-primary text-lg border-b border-surface-container pb-3 flex items-center gap-2">
                🍲 Daily Mess Menu & Timings
              </h3>
              <div className="space-y-3">
                <div className="bg-surface-container/60 p-4 rounded-2xl border border-outline-variant/30">
                  <div className="flex justify-between font-bold text-secondary text-xs mb-1">
                    <span>Breakfast</span>
                    <span>7:30 AM - 9:30 AM</span>
                  </div>
                  <p className="text-onSurface-variant text-xs">Poha / Aloo Paratha, Tea, Milk, Sprouts</p>
                </div>

                <div className="bg-surface-container/60 p-4 rounded-2xl border border-outline-variant/30">
                  <div className="flex justify-between font-bold text-secondary text-xs mb-1">
                    <span>Lunch</span>
                    <span>12:30 PM - 2:30 PM</span>
                  </div>
                  <p className="text-onSurface-variant text-xs">Roti, Paneer Butter Masala / Dal Tadka, Rice, Salad, Curd</p>
                </div>

                <div className="bg-surface-container/60 p-4 rounded-2xl border border-outline-variant/30">
                  <div className="flex justify-between font-bold text-secondary text-xs mb-1">
                    <span>Dinner</span>
                    <span>8:00 PM - 10:00 PM</span>
                  </div>
                  <p className="text-onSurface-variant text-xs">Chapati, Mix Veg, Special Dessert, Kheer</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow space-y-4">
              <h3 className="font-display font-bold text-primary text-lg border-b border-surface-container pb-3 flex items-center gap-2">
                📜 Curfew & Resident Guidelines
              </h3>
              <div className="space-y-3 text-xs text-onSurface-variant">
                <div className="p-3.5 bg-surface-container/60 rounded-2xl border border-outline-variant/30 space-y-1">
                  <strong className="text-primary font-bold block text-sm">🕒 Curfew Time: 10:30 PM</strong>
                  <p>Main gates are locked at 10:30 PM. Inform warden in advance for late permissions.</p>
                </div>
                <div className="p-3.5 bg-surface-container/60 rounded-2xl border border-outline-variant/30 space-y-1">
                  <strong className="text-primary font-bold block text-sm">👥 Visitor Timings</strong>
                  <p>Guests permitted in ground floor lounge from 10:00 AM to 7:00 PM.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RENT RECEIPTS */}
        {activeTab === "rent" && (
          <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow space-y-4">
            <h3 className="font-display font-bold text-primary text-lg border-b border-surface-container pb-3">
              💳 Payment Receipts & Rent Ledger
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-surface-container text-onSurface-variant uppercase font-bold tracking-wider">
                    <th className="py-3 px-4">Billing Month</th>
                    <th className="py-3 px-4">Rent Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  <tr>
                    <td className="py-3.5 px-4 font-bold text-primary">August 2026</td>
                    <td className="py-3.5 px-4 font-bold text-primary">{tenant.rent_amount || "₹8,500"}</td>
                    <td className="py-3.5 px-4 text-onSurface-variant">UPI / GPay</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        ✓ Paid
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => alert("Downloading official rent receipt PDF...")}
                        className="bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/30 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 sm:p-8 max-w-lg w-full shadow-2xl relative animate-fadeIn space-y-4">
            <button
              onClick={() => setShowComplaintModal(false)}
              className="absolute top-5 right-5 text-onSurface-variant hover:text-primary font-bold"
            >
              ✕
            </button>

            <div>
              <h3 className="text-xl font-display font-extrabold text-primary">Raise Maintenance Ticket</h3>
              <p className="text-onSurface-variant text-xs">Room {tenant.room_number} • {tenant.pg_name}</p>
            </div>

            <form onSubmit={handleCreateComplaint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                  Issue Category
                </label>
                <select
                  value={newComplaintCategory}
                  onChange={(e) => setNewComplaintCategory(e.target.value)}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-xs text-primary font-bold focus:outline-none focus:border-primary"
                >
                  <option value="electrical">💡 Electrical (AC, Fan, Lights, Switch)</option>
                  <option value="plumbing">🚿 Plumbing (Tap, Geyser, Water pressure)</option>
                  <option value="cleaning">🧹 Room / Washroom Cleaning</option>
                  <option value="wifi">📶 WiFi / Internet Issue</option>
                  <option value="furniture">🛋️ Bed, Chair, Door Lock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newComplaintDesc}
                  onChange={(e) => setNewComplaintDesc(e.target.value)}
                  placeholder="Describe what needs repair or attention..."
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-xs text-primary focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="flex-1 bg-surface-container hover:bg-surface-container-high text-onSurface-variant font-bold py-3 rounded-xl text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingComplaint}
                  className="flex-1 bg-primary hover:bg-primary-container text-white font-display font-bold py-3 rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {submittingComplaint ? "Submitting..." : "Submit Maintenance Ticket →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
