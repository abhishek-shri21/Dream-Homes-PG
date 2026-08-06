"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getPGs, createAvailabilityAlert } from "../../lib/db";

export default function AvailabilityPage() {
  const [pgs, setPgs] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", pg_id: "", room_type: "", message: "" });
  const [whatsappOptIn, setWhatsappOptIn] = useState(true);
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
      message: form.message + (whatsappOptIn ? " [WhatsApp Opt-in: Yes]" : "")
    });

    if (error) {
      alert("Failed to register availability alert: " + error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="hero-gradient text-white py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mx-auto text-3xl mb-3 shadow-inner backdrop-blur-md">
            🔔
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-2">
            Room Availability Subscription
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto">
            Preferred PG full? Subscribe for instant WhatsApp & Call notifications the moment a room opens up.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 w-full flex-1 space-y-8">
        {/* Currently Available Quick Summary */}
        <div className="bg-white rounded-[24px] border border-outline-variant/40 ambient-shadow p-6">
          <h2 className="font-display font-bold text-primary text-base mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Currently Available Rooms Across Jodhpur
          </h2>
          <div className="space-y-2">
            {pgs.filter((p) => p.available_rooms > 0).map((pg) => (
              <div key={pg.id} className="flex items-center justify-between py-2.5 border-b border-surface-container last:border-0">
                <div>
                  <span className="font-display font-bold text-primary text-sm block">{pg.name}</span>
                  <span className="text-onSurface-variant text-xs">{pg.locality} • {pg.pg_type.toUpperCase()} PG</span>
                </div>
                <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full">
                  {pg.available_rooms} rooms open
                </span>
              </div>
            ))}
          </div>
        </div>

        {submitted ? (
          <div className="bg-white rounded-[24px] border border-outline-variant/40 ambient-shadow p-8 text-center space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-lg">
              ✓
            </div>
            <h2 className="text-2xl font-display font-extrabold text-primary">You're on the Alert List!</h2>
            <p className="text-onSurface-variant text-sm max-w-md mx-auto">
              We've saved your preference. Our PG warden will notify you via WhatsApp or phone call as soon as a room opens up.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="bg-primary hover:bg-primary-container text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Subscribe for Another PG
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] border border-outline-variant/40 ambient-shadow p-6 sm:p-8">
            <h2 className="font-display font-bold text-primary text-lg mb-1">Set Up Availability Alert</h2>
            <p className="text-xs text-onSurface-variant mb-6">Fill your details to get instant availability alerts</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Your Name *</label>
                  <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="e.g. Vikram Singh" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Mobile Number *</label>
                  <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 9988001122" className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Preferred PG Property *</label>
                <select name="pg_id" required value={form.pg_id} onChange={handleChange} className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary font-bold focus:outline-none focus:border-primary">
                  <option value="">-- Choose PG --</option>
                  {pgs.map((pg) => (
                    <option key={pg.id} value={pg.id}>
                      {pg.name} ({pg.available_rooms > 0 ? `${pg.available_rooms} rooms available` : "Currently Full"})
                    </option>
                  ))}
                </select>
              </div>

              {selectedPg && (
                <div>
                  <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Preferred Room Occupancy *</label>
                  <select name="room_type" required value={form.room_type} onChange={handleChange} className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary font-bold focus:outline-none focus:border-primary">
                    <option value="">-- Select Room Type --</option>
                    {selectedPg.room_types.map((r) => (
                      <option key={r.type} value={r.type}>{r.type} Sharing — ₹{r.rent.toLocaleString()}/mo</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">Additional Preferences (Optional)</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={2} placeholder="E.g. Need AC room only, moving in early next month..." className="w-full bg-surface border border-outline-variant/60 rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-primary resize-none" />
              </div>

              {/* WhatsApp Opt-in Pre-checked */}
              <label className="flex items-center gap-3 p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={whatsappOptIn}
                  onChange={(e) => setWhatsappOptIn(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded"
                />
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <span>💬</span> Get instant room availability updates on WhatsApp
                </span>
              </label>

              <button type="submit" disabled={loading} className="w-full bg-secondary-container hover:bg-secondary text-white py-3.5 rounded-xl font-display font-bold text-sm shadow-md transition-all disabled:opacity-50">
                {loading ? "Submitting..." : "🔔 Notify Me When Available →"}
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
