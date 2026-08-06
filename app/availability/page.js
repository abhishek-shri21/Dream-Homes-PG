"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPGs, createAvailabilityAlert } from "../../lib/db";

export default function AvailabilityPage() {
  const [pgs, setPgs] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", pg_id: "", room_type: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPgs() {
      const data = await getPGs();
      setPgs(data);
    }
    loadPgs();
  }, []);

  const selectedPg = pgs.find((p) => p.id === form.pg_id);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await createAvailabilityAlert({
      pg_id: form.pg_id,
      name: form.name,
      phone: form.phone,
      room_type: form.room_type,
      message: form.message
    });

    if (error) {
      alert("Failed to register availability alert: " + error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🔔</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "Georgia, serif" }}>
              Room Availability Alert
            </h1>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Is your preferred PG full? Register here and we'll personally call you the moment a room opens up.
            </p>
          </div>

          {/* Currently available - quick check */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
            <h2 className="font-bold text-gray-800 mb-4">🟢 Currently Available PGs</h2>
            <div className="space-y-2">
              {pgs.filter((p) => p.available_rooms > 0).map((pg) => (
                <div key={pg.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{pg.name}</div>
                    <div className="text-gray-400 text-xs">{pg.locality} · {pg.pg_type}</div>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    {pg.available_rooms} rooms open
                  </span>
                </div>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">You're on the list!</h2>
              <p className="text-gray-500 text-sm mb-6">
                We'll call you as soon as a room opens up in your preferred PG. No spam, just a direct call from our owner.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-purple-700 font-semibold hover:underline text-sm"
              >
                Register for another PG
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-bold text-gray-800 text-lg mb-4">Register for Availability Alert</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred PG *</label>
                  <select name="pg_id" required value={form.pg_id} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">-- Choose a PG --</option>
                    {pgs.map((pg) => (
                      <option key={pg.id} value={pg.id}>
                        {pg.name} ({pg.available_rooms > 0 ? `${pg.available_rooms} available` : "Full"})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPg && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Room Type *</label>
                    <select name="room_type" required value={form.room_type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">-- Choose room type --</option>
                      {selectedPg.room_types.map((r) => (
                        <option key={r.type} value={r.type}>{r.type} — ₹{r.rent.toLocaleString()}/mo</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Any message? (Optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={2} placeholder="E.g. I need AC room only, will join in August..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60">
                  {loading ? "Registering..." : "🔔 Notify Me When Available"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
