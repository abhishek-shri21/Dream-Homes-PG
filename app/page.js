import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PgCard from "../components/PgCard";
import SearchBar from "../components/SearchBar";
import { ownerInfo } from "../data/dummyPgs";
import { getPGs } from "../lib/db";

export default async function HomePage() {
  const pgs = await getPGs();
  const featuredPgs = pgs.slice(0, 4);
  const localities = [...new Set(pgs.map((p) => p.locality))];

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />

      {/* ── BENTO HERO SECTION ── */}
      <section className="hero-gradient text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Hero Heading (Col 7) */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 backdrop-blur-md px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span>
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  Jodhpur's Premier Student & Professional Co-Living
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-[1.15] text-white tracking-tight">
                Your Home <br />
                <span className="text-secondary-container">Away From Home</span>
              </h1>

              <p className="text-white/85 text-base sm:text-lg font-body max-w-xl mx-auto lg:mx-0">
                Explore fully-furnished Boys, Girls, and Co-living PGs across Jodhpur's top locations with 24/7 security, homely mess meals & instant online complaint resolution.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                <Link
                  href="/pgs"
                  className="bg-secondary-container hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-display font-bold text-base shadow-lg shadow-secondary-container/30 transition-all hover:scale-[1.02]"
                >
                  Explore All PGs →
                </Link>
                <a
                  href={`https://wa.me/${ownerInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/15 border border-white/30 hover:bg-white/25 text-white px-7 py-3.5 rounded-xl font-display font-bold text-base backdrop-blur-md transition-all flex items-center gap-2"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right Bento Grid Stats (Col 5) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[24px] text-center hover-lift">
                <span className="text-3xl font-display font-extrabold text-secondary-container block mb-1">6+</span>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">PG Properties</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[24px] text-center hover-lift">
                <span className="text-3xl font-display font-extrabold text-secondary-container block mb-1">200+</span>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Happy Residents</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[24px] text-center hover-lift">
                <span className="text-3xl font-display font-extrabold text-secondary-container block mb-1">100%</span>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Homely Mess Meals</span>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-[24px] text-center hover-lift">
                <span className="text-3xl font-display font-extrabold text-secondary-container block mb-1">4.8★</span>
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">Resident Rating</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SEARCH BAR SECTION ── */}
      <section className="-mt-8 max-w-5xl mx-auto px-4 w-full relative z-20">
        <div className="bg-white rounded-[24px] p-4 sm:p-6 shadow-ambient border border-outline-variant/40">
          <SearchBar localities={localities} />
        </div>
      </section>

      {/* ── QUICK EXPLORE CHIPS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-primary mb-2">
            Popular PG Categories
          </h2>
          <p className="text-onSurface-variant text-sm max-w-md mx-auto">
            Choose based on gender preference, location, or budget style
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/pgs?type=boys"
            className="bg-white hover:bg-primary/5 text-primary border border-outline-variant/60 hover:border-primary font-semibold px-5 py-3 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>👦</span> Boys PGs in Jodhpur
          </Link>
          <Link
            href="/pgs?type=girls"
            className="bg-white hover:bg-pink-50 text-pink-700 border border-pink-200 hover:border-pink-500 font-semibold px-5 py-3 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>👧</span> Girls PGs with 24/7 Warden
          </Link>
          <Link
            href="/pgs?type=co-living"
            className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 hover:border-emerald-500 font-semibold px-5 py-3 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>🏢</span> Premium Co-Living PGs
          </Link>
          <Link
            href="/pgs?locality=Shastri+Nagar"
            className="bg-white hover:bg-primary/5 text-onSurface-variant hover:text-primary border border-outline-variant/60 font-semibold px-5 py-3 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>📍</span> Shastri Nagar
          </Link>
          <Link
            href="/pgs?locality=Civil+Lines"
            className="bg-white hover:bg-primary/5 text-onSurface-variant hover:text-primary border border-outline-variant/60 font-semibold px-5 py-3 rounded-full text-sm transition-all shadow-sm flex items-center gap-2"
          >
            <span>📍</span> Civil Lines
          </Link>
        </div>
      </section>

      {/* ── FEATURED PG LISTINGS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">
              Top Accommodation Picks
            </span>
            <h2 className="text-3xl font-display font-extrabold text-primary">
              Featured PG Properties
            </h2>
          </div>
          <Link
            href="/pgs"
            className="text-primary font-bold text-sm hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View All 6 Properties →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPgs.map((pg) => (
            <PgCard key={pg.id} pg={pg} />
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE DREAM HOMES PG BENTO ── */}
      <section className="bg-white border-y border-outline-variant/30 py-16 my-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-secondary font-bold text-xs uppercase tracking-widest block mb-1">
              The Dream Homes Advantage
            </span>
            <h2 className="text-3xl font-display font-extrabold text-primary">
              Why Tenants Love Staying With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface-container/60 border border-outline-variant/40 p-6 rounded-[24px] hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                🍲
              </div>
              <h3 className="font-display font-bold text-lg text-primary mb-2">Homely 3-Time Meals</h3>
              <p className="text-onSurface-variant text-sm leading-relaxed">
                Freshly cooked veg and non-veg options served daily with 24/7 RO purified drinking water.
              </p>
            </div>

            <div className="bg-surface-container/60 border border-outline-variant/40 p-6 rounded-[24px] hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                ⚡
              </div>
              <h3 className="font-display font-bold text-lg text-primary mb-2">Online Complaint Tracking</h3>
              <p className="text-onSurface-variant text-sm leading-relaxed">
                Facing an AC or WiFi issue? Raise a ticket from your tenant portal and track resolution live.
              </p>
            </div>

            <div className="bg-surface-container/60 border border-outline-variant/40 p-6 rounded-[24px] hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mb-4">
                🔒
              </div>
              <h3 className="font-display font-bold text-lg text-primary mb-2">24/7 Security & Wardens</h3>
              <p className="text-onSurface-variant text-sm leading-relaxed">
                CCTV surveillance, biometric entry, and resident wardens ensure maximum safety and comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
