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
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 py-12">
          <div className="bg-white rounded-[24px] border border-outline-variant/40 ambient-shadow p-8 max-w-md w-full text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold mb-4 shadow-lg">
              ✓
            </div>
            <h2 className="text-2xl font-display font-extrabold text-primary mb-2">Complaint Registered!</h2>
            <p className="text-onSurface-variant text-sm mb-6">
              Your maintenance ticket has been logged successfully. The PG warden and owner have been notified.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6">
              <p className="text-onSurface-variant text-xs uppercase font-bold tracking-wider mb-1">Your Complaint Ticket ID</p>
              <p className="text-3xl font-display font-extrabold text-primary tracking-wider">{complaintId}</p>
              <p className="text-onSurface-variant/70 text-xs mt-1">Keep this ID to track your maintenance progress</p>
            </div>
            <a
              href={`/track?id=${complaintId}`}
              className="block w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-display font-bold text-sm shadow-md transition-all mb-3"
            >
              Track Ticket Status →
            </a>
            <button
              onClick={() => { setSubmitted(false); setStep(1); setSelectedCategory(""); setForm({ pg_id: "", room_number: "", student_name: "", student_phone: "", description: "", priority: "medium" }); }}
              className="text-xs text-primary font-bold hover:underline"
            >
              + Raise Another Complaint
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="hero-gradient text-white py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">
            Raise Maintenance Ticket
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Report AC, plumbing, cleaning or WiFi issues for immediate resolution
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 w-full flex-1">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? "bg-primary text-white shadow-md" : "bg-surface-container-high text-onSurface-variant"}`}>
                {s}
              </div>
              <span className={`text-xs font-bold ${step >= s ? "text-primary" : "text-onSurface-variant/60"}`}>
                {s === 1 ? "Issue Category" : "Location & Details"}
              </span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-primary" : "bg-outline-variant/40"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[24px] border border-outline-variant/40 ambient-shadow p-6 sm:p-8">
          {/* Step 1: Category */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-bold text-primary text-lg mb-1">Select Issue Category</h2>
              <p className="text-xs text-onSurface-variant mb-6">Choose the maintenance service you need</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const active = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md"
                          : "border-outline-variant/40 hover:border-primary/40 bg-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </span>
                      )}
                      <div className="text-3xl mb-2">{cat.icon}</div>
                      <div className="font-display font-bold text-primary text-sm">{cat.label}</div>
                      <div className="text-onSurface-variant text-xs mt-0.5 leading-tight">{cat.desc}</div>
                    </button>
                  );
                })}
              </div>

              <button
                disabled={!selectedCategory}
                onClick={() => setStep(2)}
                className="mt-8 w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-display font-bold text-sm shadow-md transition-all disabled:opacity-40"
              >
                Continue to Details →
              </button>
            </div>
          )}

          {/* Step 2: Details Form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-2xl p-3.5 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{categories.find((c) => c.id === selectedCategory)?.icon}</span>
                  <div>
                    <div className="font-bold text-primary text-sm">{categories.find((c) => c.id === selectedCategory)?.label}</div>
                    <span className="text-xs text-onSurface-variant">Category Selected</span>
                  </div>
                </div>
                <button type="button" onClick={() => setStep(1)} className="text-xs font-bold text-primary hover:underline">
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Select your PG *</label>
                <select
                  name="pg_id"
                  required
                  value={form.pg_id}
                  onChange={handleChange}
                  className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary font-bold focus:outline-none focus:border-primary"
                >
                  <option value="">-- Select Your PG --</option>
                  {pgs.map((pg) => <option key={pg.id} value={pg.id}>{pg.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Your Name *</label>
                  <input type="text" name="student_name" required value={form.student_name} onChange={handleChange} placeholder="e.g. Arjun Mehra" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Room Number *</label>
                  <input type="text" name="room_number" required value={form.room_number} onChange={handleChange} placeholder="e.g. 204" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Mobile Number *</label>
                <input type="tel" name="student_phone" required value={form.student_phone} onChange={handleChange} placeholder="+91 9988776655" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Problem Details *</label>
                <textarea name="description" required value={form.description} onChange={handleChange} rows={3} placeholder="Describe the issue clearly..." className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-2 uppercase tracking-wider">Priority Level</label>
                <div className="flex gap-3">
                  {[
                    { id: "low", label: "Low", color: "bg-emerald-50 border-emerald-300 text-emerald-800" },
                    { id: "medium", label: "Medium", color: "bg-amber-50 border-amber-300 text-amber-900" },
                    { id: "high", label: "High — Urgent", color: "bg-red-50 border-red-300 text-red-800" },
                  ].map((p) => (
                    <label key={p.id} className={`flex-1 border-2 rounded-xl py-2.5 text-center text-xs font-bold cursor-pointer transition-all ${form.priority === p.id ? p.color + " ring-1" : "border-outline-variant/40 text-onSurface-variant"}`}>
                      <input type="radio" name="priority" value={p.id} checked={form.priority === p.id} onChange={handleChange} className="hidden" />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(1)} className="flex-1 bg-surface-container hover:bg-surface-container-high text-onSurface-variant py-3.5 rounded-xl font-bold text-xs transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-container text-white py-3.5 rounded-xl font-display font-bold text-xs shadow-md transition-all disabled:opacity-50">
                  {loading ? "Submitting Ticket..." : "Submit Complaint Ticket →"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
