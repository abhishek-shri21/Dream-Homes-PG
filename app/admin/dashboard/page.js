"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getAdminDashboardData,
  updateComplaintStatus as dbUpdateComplaintStatus,
  updateEnquiryStatus as dbUpdateEnquiryStatus
} from "../../../lib/db";

const statusColors = { pending: "status-pending", assigned: "status-assigned", resolved: "status-resolved" };
const statusLabels = { pending: "Pending", assigned: "Assigned", resolved: "Resolved" };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [pgs, setPgs] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [propertyFilter, setPropertyFilter] = useState("all");

  useEffect(() => {
    async function loadData() {
      const data = await getAdminDashboardData();
      setPgs(data.pgs);
      setComplaints(data.complaints);
      setEnquiries(data.enquiries);
      setAlerts(data.alerts);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalAvailable = pgs.reduce((sum, p) => sum + p.available_rooms, 0);
  const pendingComplaints = complaints.filter((c) => c.status !== "resolved").length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const updateComplaintStatus = async (id, status) => {
    const { success } = await dbUpdateComplaintStatus(id, status);
    if (success) {
      setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    } else {
      alert("Failed to update complaint status");
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    const { success } = await dbUpdateEnquiryStatus(id, status);
    if (success) {
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    } else {
      alert("Failed to update enquiry status");
    }
  };

  // Filter complaints & enquiries by PG property if selected
  const filteredComplaints = complaints.filter((c) =>
    propertyFilter === "all" ? true : (c.pg_id === propertyFilter || (c.pg && c.pg.includes(propertyFilter)))
  );

  const filteredEnquiries = enquiries.filter((e) =>
    propertyFilter === "all" ? true : (e.pg_id === propertyFilter || (e.pg && e.pg.includes(propertyFilter)))
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "complaints", label: `Complaints (${pendingComplaints})`, icon: "🔧" },
    { id: "enquiries", label: `Enquiries (${newEnquiries})`, icon: "📋" },
    { id: "alerts", label: "Room Alerts", icon: "🔔" },
    { id: "pgs", label: "Manage PGs", icon: "🏠" },
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Header */}
      <div className="bg-white shadow-sm border-b border-outline-variant/40 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <span className="text-white font-display font-extrabold text-xl">D</span>
          </div>
          <div>
            <div className="font-display font-bold text-primary text-base leading-none">Dream Homes PG</div>
            <div className="text-onSurface-variant text-xs mt-0.5 font-semibold">Owner & Property Manager Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-xs text-primary font-bold hover:underline hidden sm:inline">
            Public Website →
          </Link>
          <Link href="/login?role=owner" className="bg-surface-container hover:bg-surface-container-high text-onSurface-variant px-4 py-2 rounded-xl text-xs font-bold transition-all border border-outline-variant/40">
            Logout
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs & Property Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3 rounded-[24px] border border-outline-variant/40 ambient-shadow">
          <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === t.id
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-onSurface-variant hover:bg-surface-container"
                }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          {/* Property Filter Dropdown */}
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs font-bold text-onSurface-variant whitespace-nowrap">Filter PG:</span>
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="bg-surface border border-outline-variant/60 text-xs font-bold text-primary rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All 6 Properties</option>
              {pgs.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-onSurface-variant text-xs font-bold">Loading dashboard metrics...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB: BENTO METRICS GRID */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-onSurface-variant uppercase tracking-wider">Total PG Properties</span>
                      <span className="text-2xl">🏠</span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-primary">{pgs.length}</div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">Across Jodhpur</div>
                  </div>

                  <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-onSurface-variant uppercase tracking-wider">Available Rooms</span>
                      <span className="text-2xl">🛏️</span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-primary">{totalAvailable}</div>
                    <div className="text-xs text-onSurface-variant font-semibold mt-1">Ready for immediate check-in</div>
                  </div>

                  <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-onSurface-variant uppercase tracking-wider">Active Complaints</span>
                      <span className="text-2xl">🔧</span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-secondary">{pendingComplaints}</div>
                    <div className="text-xs text-secondary font-bold mt-1">Requires warden resolution</div>
                  </div>

                  <div className="bg-white border border-outline-variant/40 rounded-[24px] p-6 ambient-shadow hover-lift">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-onSurface-variant uppercase tracking-wider">New Visitor Leads</span>
                      <span className="text-2xl">📋</span>
                    </div>
                    <div className="text-3xl font-display font-extrabold text-primary">{newEnquiries}</div>
                    <div className="text-xs text-emerald-600 font-bold mt-1">Pending enquiry calls</div>
                  </div>
                </div>

                {/* Quick Action PG List Snapshot */}
                <div className="bg-white rounded-[24px] border border-outline-variant/40 p-6 ambient-shadow space-y-4">
                  <h3 className="font-display font-bold text-primary text-lg">Property Occupancy Snapshot</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pgs.map((pg) => (
                      <div key={pg.id} className="bg-surface-container/60 border border-outline-variant/30 rounded-2xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-display font-bold text-primary text-sm">{pg.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pg.pg_type === "boys" ? "badge-boys" : pg.pg_type === "girls" ? "badge-girls" : "badge-coliving"}`}>
                              {pg.pg_type.toUpperCase()}
                            </span>
                          </div>
                          <span className="text-xs text-onSurface-variant">{pg.locality} • {pg.curfew_time} Curfew</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 mt-2 border-t border-outline-variant/30 text-xs">
                          <span className="text-onSurface-variant">Available Beds:</span>
                          <span className="font-bold text-emerald-700">{pg.available_rooms} / {pg.total_rooms}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* COMPLAINTS TAB */}
            {activeTab === "complaints" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-primary text-xl">Tenant Maintenance Tickets</h2>
                  <span className="text-xs text-onSurface-variant">
                    Showing {filteredComplaints.length} tickets
                  </span>
                </div>

                {filteredComplaints.map((c) => (
                  <div key={c.id} className="bg-white rounded-[24px] border border-outline-variant/40 p-6 ambient-shadow space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{c.categoryIcon || c.icon || "💡"}</span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-primary text-sm">{c.id}</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${c.priority === "high" ? "bg-red-100 text-red-700" : c.priority === "medium" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{c.priority}</span>
                          </div>
                          <div className="text-primary font-bold text-sm mt-1">{c.student_name || c.student} · Room {c.room_number || c.room} · {c.pg_name || c.pg}</div>
                          <div className="text-onSurface-variant text-xs mt-0.5">"{c.description}"</div>
                          {c.assigned_to && <div className="text-emerald-700 font-bold text-xs mt-1">Assigned Technician: {c.assigned_to}</div>}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <a href={`tel:${c.student_phone || c.phone}`} className="text-xs font-bold bg-surface-container hover:bg-surface-container-high text-primary px-3 py-1.5 rounded-xl border border-outline-variant/40">
                          📞 {c.student_phone || c.phone}
                        </a>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-onSurface-variant font-bold">Status:</span>
                          <select
                            value={c.status}
                            onChange={(e) => updateComplaintStatus(c.id, e.target.value)}
                            className="text-xs font-bold border border-outline-variant/60 rounded-xl px-3 py-1.5 bg-surface text-primary focus:outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ENQUIRIES TAB */}
            {activeTab === "enquiries" && (
              <div className="space-y-4">
                <h2 className="font-display font-bold text-primary text-xl">Visitor Leads & Booking Enquiries</h2>
                {filteredEnquiries.map((e) => (
                  <div key={e.id} className="bg-white rounded-[24px] border border-outline-variant/40 p-6 ambient-shadow flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <div className="font-display font-bold text-primary text-base">{e.visitor_name || e.name}</div>
                      <div className="text-onSurface-variant text-xs mt-0.5">{e.pg_name || e.pg} • {e.room_type} Room</div>
                      <div className="text-onSurface-variant/70 text-xs mt-1">Move-in Date: {e.move_in_date || e.move_in}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={`tel:${e.visitor_phone || e.phone}`} className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm">
                        📞 Call Lead
                      </a>
                      <select
                        value={e.status}
                        onChange={(eTarget) => updateEnquiryStatus(e.id, eTarget.target.value)}
                        className="text-xs font-bold border border-outline-variant/60 rounded-xl px-3 py-2 bg-surface text-primary"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ROOM ALERTS TAB */}
            {activeTab === "alerts" && (
              <div className="bg-white rounded-[24px] border border-outline-variant/40 p-6 ambient-shadow space-y-4">
                <h2 className="font-display font-bold text-primary text-xl">WhatsApp & Phone Room Alerts Log</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-surface-container text-onSurface-variant uppercase font-bold tracking-wider">
                        <th className="py-3 px-4">Visitor Name</th>
                        <th className="py-3 px-4">Phone</th>
                        <th className="py-3 px-4">Requested PG</th>
                        <th className="py-3 px-4">Room Type</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      {alerts.map((al) => (
                        <tr key={al.id}>
                          <td className="py-3.5 px-4 font-bold text-primary">{al.name}</td>
                          <td className="py-3.5 px-4 text-onSurface-variant">{al.phone}</td>
                          <td className="py-3.5 px-4 font-bold text-primary">{al.pg || al.pg_name}</td>
                          <td className="py-3.5 px-4 text-onSurface-variant">{al.room_type} Room</td>
                          <td className="py-3.5 px-4 text-right">
                            <a href={`tel:${al.phone}`} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all text-xs">
                              Call Back
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MANAGE PGS TAB */}
            {activeTab === "pgs" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pgs.map((pg) => (
                  <div key={pg.id} className="bg-white rounded-[24px] border border-outline-variant/40 overflow-hidden ambient-shadow flex flex-col justify-between">
                    <div className="h-44 relative">
                      <img src={pg.cover_image_url} alt={pg.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                        {pg.pg_type.toUpperCase()} PG
                      </div>
                    </div>
                    <div className="p-5 space-y-3">
                      <h3 className="font-display font-bold text-primary text-base">{pg.name}</h3>
                      <p className="text-onSurface-variant text-xs">{pg.address}</p>
                      <div className="flex justify-between items-center text-xs pt-2 border-t border-surface-container">
                        <span className="text-onSurface-variant">Available Rooms:</span>
                        <span className="font-bold text-emerald-700">{pg.available_rooms} / {pg.total_rooms}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
