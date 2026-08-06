import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PgCard from "../components/PgCard";
import SearchBar from "../components/SearchBar";
import { ownerInfo } from "../data/dummyPgs";
import { getPGs } from "../lib/db";

export default async function HomePage() {
  const pgs = await getPGs();
  const featuredPgs = pgs.slice(0, 3);
  const localities = [...new Set(pgs.map((p) => p.locality))];

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full tracking-widest uppercase mb-4 inline-block">
              Jodhpur's Most Trusted PG Network
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Your Home <br />
              <span className="text-yellow-300">Away From Home</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              6 premium PGs across Jodhpur. Safe, affordable, fully furnished — with online complaint tracking so your issues get fixed fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                href="/pgs"
                className="bg-yellow-400 text-purple-900 px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
              >
                Explore PGs
              </Link>
              <a
                href={`https://wa.me/${ownerInfo.whatsapp}`}
                target="_blank"
                className="bg-white/20 border border-white/40 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { label: "PG Properties", value: "6" },
              { label: "Happy Tenants", value: "150+" },
              { label: "Cities Covered", value: "1" },
              { label: "Years of Trust", value: "5+" },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 rounded-2xl p-5 text-center backdrop-blur-sm border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">{s.value}</div>
                <div className="text-white/70 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEARCH BAR ── */}
      <section className="bg-white shadow-lg -mt-6 relative z-10 max-w-4xl mx-auto rounded-2xl px-6 py-5 mb-4 border border-gray-100">
        <SearchBar localities={localities} />
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3" style={{ fontFamily: "Georgia, serif" }}>
            Why Choose Dream Homes PG?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We go beyond just providing a room — we make sure your stay is comfortable, safe, and hassle-free.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-purple-50 rounded-2xl p-6 border border-purple-100">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="text-xl font-bold text-purple-800 mb-2">Complaint Tracking System</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              AC not working? Water shortage? Light issue? Raise a complaint online in seconds. Track its status in real time — no more waiting or calling.
            </p>
            <Link href="/complaints" className="mt-4 inline-block text-purple-700 font-semibold text-sm hover:underline">
              Raise a complaint →
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-xl font-bold text-orange-700 mb-2">Room Availability Alerts</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your preferred PG is full right now? Drop your number and we'll notify you the moment a room opens up. Never miss your spot.
            </p>
            <Link href="/availability" className="mt-4 inline-block text-orange-600 font-semibold text-sm hover:underline">
              Get notified →
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">Easy Online Enquiry</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Fill a quick form to enquire about any PG. Our team calls you back within 24 hours to schedule a visit or confirm your booking.
            </p>
            <Link href="/pgs" className="mt-4 inline-block text-green-700 font-semibold text-sm hover:underline">
              Browse PGs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PGs ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "Georgia, serif" }}>Featured PGs</h2>
              <p className="text-gray-500 text-sm mt-1">Handpicked for comfort and value</p>
            </div>
            <Link href="/pgs" className="text-purple-700 font-semibold hover:underline text-sm">
              View all 6 PGs →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPgs.map((pg) => <PgCard key={pg.id} pg={pg} />)}
          </div>
        </div>
      </section>

      {/* ── COMPLAINT SECTION PREVIEW ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
              Already a Tenant? <br />Raise Issues Instantly.
            </h2>
            <p className="text-white/80 text-base mb-6">
              No more calling the owner 5 times. Submit your AC, water, cleaning, or electrical complaint here — and track when it gets fixed.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/complaints"
                className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors text-center"
              >
                🔧 Raise Complaint
              </Link>
              <Link
                href="/track"
                className="bg-white/20 border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors text-center"
              >
                📍 Track My Complaint
              </Link>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {[
              { icon: "❄️", label: "AC & Cooling" },
              { icon: "💡", label: "Electrical" },
              { icon: "🚿", label: "Water Issues" },
              { icon: "🧹", label: "Cleaning" },
              { icon: "📶", label: "WiFi Problems" },
              { icon: "🛋️", label: "Furniture" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3 flex items-center gap-2 text-sm font-medium">
                <span className="text-2xl">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10" style={{ fontFamily: "Georgia, serif" }}>
            What Our Tenants Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Arjun Mehra", pg: "Civil Lines", rating: 5, text: "The complaint system is a game changer. My AC was fixed the same day I raised the ticket. Never experienced this in any other PG." },
              { name: "Priya Sharma", pg: "Residency Road", rating: 5, text: "Very safe environment, warden is always available. Food is home-like and the hostel is kept very clean. Highly recommended for girls!" },
              { name: "Rahul Verma", pg: "Sardarpura", rating: 4, text: "Great WiFi speed and modern rooms. The online enquiry process was super easy. Booked my room without even visiting first." },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-800">{t.name}</div>
                  <div className="text-gray-400 text-xs">Tenant at {t.pg} PG</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Ready to Find Your PG?
        </h2>
        <p className="text-gray-500 mb-6">Browse all our properties or call us directly.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/pgs" className="bg-purple-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-800 transition-colors">
            Browse All PGs
          </Link>
          <a href={`tel:${ownerInfo.phone}`} className="border border-purple-700 text-purple-700 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors">
            📞 Call {ownerInfo.phone}
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
