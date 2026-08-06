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

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "complaints", label: `Complaints (${pendingComplaints})`, icon: "🔧" },
    { id: "enquiries", label: `Enquiries (${newEnquiries})`, icon: "📋" },
    { id: "alerts", label: "Room Alerts", icon: "🔔" },
    { id: "pgs", label: "Manage PGs", icon: "🏠" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">Dream Homes PG</div>
            <div className="text-gray-400 text-xs">Owner Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="text-purple-700 text-sm hover:underline">View Site →</Link>
          <Link href="/admin/login" className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200">Logout</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-gray-200 w-fit flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? "bg-purple-700 text-white" : "text-gray-600 hover:bg-gray-100"}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
            <p className="text-gray-500 text-sm font-medium">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total PGs", value: pgs.length, icon: "🏠", color: "purple" },
                { label: "Available Rooms", value: totalAvailable, icon: "🚪", color: "green" },
                { label: "Open Complaints", value: pendingComplaints, icon: "🔧", color: "red" },
                { label: "New Enquiries", value: newEnquiries, icon: "📋", color: "orange" },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-bold text-gray-800">{s.value}</div>
                  <div className="text-gray-400 text-sm">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Complaints */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">Recent Complaints</h2>
                <button onClick={() => setActiveTab("complaints")} className="text-purple-700 text-sm hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {complaints.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{c.icon}</span>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{c.student} · Room {c.room}</div>
                        <div className="text-gray-400 text-xs">{c.pg} · {c.category}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                      {statusLabels[c.status]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Complaints */}
        {activeTab === "complaints" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-xl">All Complaints</h2>
            {complaints.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{c.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-800">{c.id}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[c.status]}`}>{statusLabels[c.status]}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.priority === "high" ? "bg-red-100 text-red-600" : c.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>{c.priority}</span>
                      </div>
                      <div className="text-gray-600 text-sm mt-0.5">{c.student} · Room {c.room} · {c.pg}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{c.category} · {c.created_at}</div>
                      {c.assigned_to && <div className="text-purple-600 text-xs mt-0.5">Assigned to: {c.assigned_to}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <a href={`tel:${c.phone}`} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200">📞 {c.phone}</a>
                    <select
                      value={c.status}
                      onChange={(e) => updateComplaintStatus(c.id, e.target.value)}
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enquiries */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-xl">Enquiries Received</h2>
            {enquiries.map((e) => (
              <div key={e.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-semibold text-gray-800">{e.name}</div>
                  <div className="text-gray-500 text-sm">{e.pg} · {e.room_type} Room</div>
                  <div className="text-gray-400 text-xs mt-0.5">Move-in: {e.move_in}</div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`tel:${e.phone}`} className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors">📞 Call</a>
                  <select
                    value={e.status}
                    onChange={(ev) => updateEnquiryStatus(e.id, ev.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts */}
        {activeTab === "alerts" && (
          <div className="space-y-4">
            <h2 className="font-bold text-gray-800 text-xl">Room Availability Alert Registrations</h2>
            <p className="text-gray-500 text-sm">These people want to be called when a room opens up.</p>
            {alerts.map((a) => (
              <div key={a.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-800">{a.name}</div>
                  <div className="text-gray-500 text-sm">{a.pg} · {a.room_type} Room</div>
                  <div className="text-gray-400 text-xs mt-0.5">Registered on {a.date}</div>
                </div>
                <a href={`tel:${a.phone}`} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">📞 {a.phone}</a>
              </div>
            ))}
          </div>
        )}

        {/* Manage PGs */}
        {activeTab === "pgs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-xl">Your PG Properties</h2>
              <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors">+ Add New PG</button>
            </div>
            {pgs.map((pg) => (
              <div key={pg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                <img src={pg.cover_image_url} alt={pg.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800">{pg.name}</div>
                  <div className="text-gray-400 text-sm">{pg.locality} · {pg.pg_type}</div>
                  <div className="text-xs mt-1">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${pg.available_rooms > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                      {pg.available_rooms > 0 ? `${pg.available_rooms} rooms available` : "Fully occupied"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/pgs/${pg.slug}`} target="_blank" className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200">View</Link>
                  <button className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200">Edit</button>
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
