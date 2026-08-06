"use client";
import { useState } from "react";
import { createEnquiry } from "../lib/db";

export default function EnquiryForm({ pgName = "", roomTypes = [], pgId = "" }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pg_name: pgName,
    room_type: "",
    move_in_date: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await createEnquiry({
      pg_id: pgId,
      pg_name: pgName,
      visitor_name: form.name,
      visitor_phone: form.phone,
      visitor_email: form.email,
      room_type: form.room_type,
      move_in_date: form.move_in_date,
      message: form.message
    });

    if (error) {
      alert("Failed to submit enquiry: " + error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-green-800 font-bold text-xl mb-1">Enquiry Sent!</h3>
        <p className="text-green-700 text-sm">
          We've received your enquiry. Our team will call you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {roomTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
          <select
            name="room_type"
            required
            value={form.room_type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select room type</option>
            {roomTypes.map((r) => (
              <option key={r.type} value={r.type}>
                {r.type} — ₹{r.rent.toLocaleString()}/mo
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Move-In Date *</label>
        <input
          type="date"
          name="move_in_date"
          required
          value={form.move_in_date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={3}
          placeholder="Any specific requirements..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  );
}
