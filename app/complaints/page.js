"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPGs, createComplaint } from "../../lib/db";

const categories = [
  { id: "electrical", icon: "💡", label: "Electrical", desc: "AC, fan, light, switch, socket" },
  { id: "plumbing", icon: "🚿", label: "Plumbing", desc: "Water shortage, tap, geyser, drain" },
  { id: "cleaning", icon: "🧹", label: "Cleaning", desc: "Room, washroom, common area" },
  { id: "wifi", icon: "📶", label: "WiFi / Internet", desc: "Slow, not working, disconnecting" },
  { id: "furniture", icon: "🛋️", label: "Furniture", desc: "Bed, table, chair, wardrobe damage" },
  { id: "other", icon: "🔧", label: "Other", desc: "Any other issue not listed above" },
];

export default function ComplaintsPage() {
  const [pgs, setPgs] = useState([]);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [form, setForm] = useState({
    pg_id: "",
    room_number: "",
    student_name: "",
    student_phone: "",
    description: "",
    priority: "medium",
  });
  const [submitted, setSubmitted] = useState(false);
  const [complaintId, setComplaintId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPgs() {
      const data = await getPGs();
      setPgs(data);
    }
    loadPgs();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = "DH" + Date.now().toString().slice(-6);

    const { error } = await createComplaint({
      id,
      pg_id: form.pg_id,
      room_number: form.room_number,
      student_name: form.student_name,
      student_phone: form.student_phone,
      category: selectedCategory,
      description: form.description,
      priority: form.priority
    });

    if (error) {
      alert("Failed to submit complaint: " + error.message);
    } else {
      setComplaintId(id);
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Registered!</h2>
            <p className="text-gray-500 mb-4 text-sm">
              Your complaint has been received. The owner will assign someone to fix it shortly.
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <p className="text-gray-500 text-sm mb-1">Your Complaint ID</p>
              <p className="text-2xl font-bold text-purple-700 tracking-widest">{complaintId}</p>
              <p className="text-gray-400 text-xs mt-1">Save this to track your complaint status</p>
            </div>
            <a
              href={`/track?id=${complaintId}`}
              className="block w-full bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition-colors mb-3"
            >
              Track My Complaint
            </a>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setSelectedCategory(""); setForm({ pg_id: "", room_number: "", student_name: "", student_phone: "", description: "", priority: "medium" }); }}
              className="text-gray-400 text-sm hover:underline"
            >
              Raise another complaint
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Raise a Complaint
            </h1>
            <p className="text-gray-500 text-sm">Report your issue and we'll get it resolved ASAP.</p>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-500"}`}>
                  {s}
                </div>
                <span className={`text-sm ${step >= s ? "text-purple-700 font-medium" : "text-gray-400"}`}>
                  {s === 1 ? "Select Issue" : "Your Details"}
                </span>
                {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-purple-700" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Step 1: Category */}
            {step === 1 && (
              <div>
                <h2 className="font-bold text-gray-800 text-lg mb-4">What kind of issue are you facing?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedCategory === cat.id
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="font-semibold text-gray-800 text-sm">{cat.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{cat.desc}</div>
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedCategory}
                  onClick={() => setStep(2)}
                  className="mt-6 w-full bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition-colors disabled:opacity-50"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-3 bg-purple-50 rounded-xl p-3 mb-4">
                  <span className="text-2xl">{categories.find((c) => c.id === selectedCategory)?.icon}</span>
                  <div>
                    <div className="font-semibold text-purple-800">{categories.find((c) => c.id === selectedCategory)?.label}</div>
                    <button type="button" onClick={() => setStep(1)} className="text-purple-500 text-xs hover:underline">Change category</button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select your PG *</label>
                  <select
                    name="pg_id"
                    required
                    value={form.pg_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">-- Choose PG --</option>
                    {pgs.map((pg) => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input type="text" name="student_name" required value={form.student_name} onChange={handleChange} placeholder="Full name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                    <input type="text" name="room_number" required value={form.room_number} onChange={handleChange} placeholder="e.g. 204" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" name="student_phone" required value={form.student_phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Describe the problem *</label>
                  <textarea name="description" required value={form.description} onChange={handleChange} rows={3} placeholder="E.g. AC in room 204 is not cooling properly since 2 days..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <div className="flex gap-3">
                    {[
                      { id: "low", label: "Low", color: "bg-green-50 border-green-300 text-green-700" },
                      { id: "medium", label: "Medium", color: "bg-yellow-50 border-yellow-300 text-yellow-700" },
                      { id: "high", label: "High — Urgent", color: "bg-red-50 border-red-300 text-red-700" },
                    ].map((p) => (
                      <label key={p.id} className={`flex-1 border-2 rounded-lg py-2 text-center text-xs font-semibold cursor-pointer transition-all ${form.priority === p.id ? p.color + " border-2" : "border-gray-200 text-gray-500"}`}>
                        <input type="radio" name="priority" value={p.id} checked={form.priority === p.id} onChange={handleChange} className="hidden" />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-2 flex-1 bg-purple-700 text-white py-3 rounded-xl font-semibold hover:bg-purple-800 transition-colors disabled:opacity-60">
                    {loading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
