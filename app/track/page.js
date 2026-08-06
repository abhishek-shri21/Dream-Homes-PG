"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getComplaintById } from "../../lib/db";

const statusSteps = ["pending", "assigned", "resolved"];
const statusLabels = { pending: "Pending", assigned: "Assigned", resolved: "Resolved" };
const statusColors = {
  pending: "status-pending",
  assigned: "status-assigned",
  resolved: "status-resolved",
};

export default function TrackPage() {
  const [complaintId, setComplaintId] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlId = params.get("id");
    if (urlId) {
      setComplaintId(urlId);
      const fetchInitial = async () => {
        setLoading(true);
        const { data } = await getComplaintById(urlId);
        if (data) {
          setResult(data);
          setNotFound(false);
        } else {
          setResult(null);
          setNotFound(true);
        }
        setSearched(true);
        setLoading(false);
      };
      fetchInitial();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!complaintId) return;
    setLoading(true);
    const { data } = await getComplaintById(complaintId);
    if (data) {
      setResult(data);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
    setSearched(true);
    setLoading(false);
  };

  const currentStep = result ? statusSteps.indexOf(result.status) : -1;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Track Your Complaint
            </h1>
            <p className="text-gray-500 text-sm">Enter your complaint ID to see the current status.</p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-8">
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter Complaint ID (e.g. DH123456)"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-800 transition-colors text-sm disabled:opacity-60"
            >
              {loading ? "Searching..." : "Track"}
            </button>
          </form>

          {/* Demo hint */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-sm text-blue-700">
            💡 Try demo IDs: <strong>DH123456</strong> or <strong>DH789012</strong>
          </div>

          {/* Not found */}
          {searched && notFound && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h2 className="font-bold text-gray-800 text-lg mb-1">Complaint Not Found</h2>
              <p className="text-gray-500 text-sm">Double-check your complaint ID and try again.</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold text-purple-700 mb-0.5">{result.id}</div>
                  <div className="text-gray-500 text-sm">{result.pg_name} · Room {result.room_number}</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusColors[result.status]}`}>
                  {statusLabels[result.status]}
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-2">
                  {statusSteps.map((s, i) => (
                    <div key={s} className="flex-1 text-center">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center text-sm font-bold mb-1 ${i <= currentStep ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-400"}`}>
                        {i < currentStep ? "✓" : i + 1}
                      </div>
                      <div className={`text-xs ${i <= currentStep ? "text-purple-700 font-medium" : "text-gray-400"}`}>
                        {statusLabels[s]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative h-1.5 bg-gray-200 rounded-full mt-2">
                  <div
                    className="absolute left-0 top-0 h-full bg-purple-700 rounded-full transition-all"
                    style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-gray-400 text-xs mb-1">Issue Type</div>
                  <div className="font-semibold text-gray-800">{result.categoryIcon} {result.categoryLabel}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-gray-400 text-xs mb-1">Priority</div>
                  <div className={`font-semibold capitalize ${result.priority === "high" ? "text-red-600" : result.priority === "medium" ? "text-yellow-600" : "text-green-600"}`}>
                    {result.priority}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-gray-400 text-xs mb-1">Problem Description</div>
                <p className="text-gray-700 text-sm">{result.description}</p>
              </div>

              {result.assigned_to && (
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-purple-500 text-xs mb-0.5">Assigned to</div>
                    <div className="font-semibold text-gray-800">{result.assigned_to}</div>
                  </div>
                  <a
                    href={`tel:${result.assigned_to_phone}`}
                    className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-800 transition-colors"
                  >
                    📞 Call
                  </a>
                </div>
              )}

              <div className="text-gray-400 text-xs">
                Raised on: {new Date(result.created_at).toLocaleString("en-IN")} ·
                Last updated: {new Date(result.updated_at).toLocaleString("en-IN")}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
