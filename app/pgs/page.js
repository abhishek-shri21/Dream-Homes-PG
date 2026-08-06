"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PgCard from "../../components/PgCard";
import { getPGs } from "../../lib/db";

function PgsListContent() {
  const searchParams = useSearchParams();
  const initialLocality = searchParams.get("locality") || "";
  const initialType = searchParams.get("type") || "";
  const initialBudget = searchParams.get("budget") || "";

  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pgType, setPgType] = useState(initialType);
  const [locality, setLocality] = useState(initialLocality);
  const [budget, setBudget] = useState(initialBudget);

  useEffect(() => {
    async function loadData() {
      const data = await getPGs();
      setPgs(data);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const locParam = searchParams.get("locality") || "";
    const typeParam = searchParams.get("type") || "";
    const budgetParam = searchParams.get("budget") || "";
    if (locParam) setLocality(locParam);
    if (typeParam) setPgType(typeParam);
    if (budgetParam) setBudget(budgetParam);
  }, [searchParams]);

  const allLocalities = [
    "Shastri Nagar",
    "Residency Road",
    "Civil Lines",
    "Ratanada",
    "Paota",
    "Sardarpura"
  ];

  const filtered = pgs.filter((pg) => {
    const minRent =
      pg.room_types && pg.room_types.length > 0
        ? Math.min(...pg.room_types.map((r) => r.rent))
        : 0;

    const matchesLocality =
      !locality ||
      locality.toLowerCase() === "all" ||
      pg.locality.toLowerCase() === locality.toLowerCase();

    const matchesType = !pgType || pg.pg_type === pgType;
    const matchesBudget = !budget || minRent <= parseInt(budget);

    return matchesLocality && matchesType && matchesBudget;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Filter Control Bar */}
      <div className="bg-white rounded-[24px] p-6 mb-8 ambient-shadow border border-outline-variant/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <h2 className="text-lg font-display font-bold text-primary">Filter PG Listings</h2>
          </div>
          {(pgType || locality || budget) && (
            <button
              onClick={() => {
                setPgType("");
                setLocality("");
                setBudget("");
              }}
              className="text-xs font-bold text-error hover:underline bg-error/10 border border-error/20 px-3 py-1.5 rounded-full transition-all"
            >
              ✕ Reset All Filters
            </button>
          )}
        </div>

        {/* Gender Type Chips */}
        <div>
          <span className="text-xs font-bold text-onSurface-variant block mb-2 uppercase tracking-wider">
            Gender Preference
          </span>
          <div className="flex flex-wrap gap-2">
            {[
              { id: "", label: "All Gender Types" },
              { id: "boys", label: "👦 Boys PG" },
              { id: "girls", label: "👧 Girls PG" },
              { id: "co-living", label: "🏢 Co-Living" }
            ].map((t) => {
              const active = pgType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setPgType(t.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-primary text-white shadow-md shadow-primary/20 border-2 border-primary"
                      : "bg-surface-container/60 hover:bg-surface-container text-onSurface-variant border border-outline-variant/40"
                  }`}
                >
                  {active && <span>✓</span>}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Locality Chips */}
        <div>
          <span className="text-xs font-bold text-onSurface-variant block mb-2 uppercase tracking-wider">
            Locality in Jodhpur
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocality("")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                !locality
                  ? "bg-primary text-white border-2 border-primary"
                  : "bg-surface-container/60 hover:bg-surface-container text-onSurface-variant border border-outline-variant/40"
              }`}
            >
              {!locality && <span>✓</span>} All Jodhpur
            </button>
            {allLocalities.map((loc) => {
              const active = locality.toLowerCase() === loc.toLowerCase();
              return (
                <button
                  key={loc}
                  onClick={() => setLocality(loc)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                    active
                      ? "bg-primary text-white border-2 border-primary shadow-sm"
                      : "bg-surface-container/60 hover:bg-surface-container text-onSurface-variant border border-outline-variant/40"
                  }`}
                >
                  {active && <span>✓</span>} {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Select & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-onSurface-variant uppercase tracking-wider">
              Max Monthly Budget:
            </span>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-surface-container/60 border border-outline-variant/60 rounded-xl px-4 py-2 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Any Budget</option>
              <option value="4000">Under ₹4,000 / mo</option>
              <option value="6000">Under ₹6,000 / mo</option>
              <option value="9000">Under ₹9,000 / mo</option>
              <option value="12000">Under ₹12,000 / mo</option>
            </select>
          </div>

          <span className="text-xs font-bold text-onSurface-variant">
            Showing <span className="text-primary font-extrabold">{filtered.length}</span> of {pgs.length} Properties
          </span>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-[24px] border border-outline-variant/30 overflow-hidden shadow-sm h-[400px] flex flex-col animate-pulse"
            >
              <div className="bg-surface-container-high h-52 w-full" />
              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="h-4 bg-surface-container-high rounded w-1/4" />
                <div className="h-6 bg-surface-container-high rounded w-3/4" />
                <div className="h-4 bg-surface-container-high rounded w-1/2" />
                <div className="h-10 bg-surface-container-high rounded-xl w-full mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[24px] border border-outline-variant/30 ambient-shadow max-w-lg mx-auto p-8">
          <div className="text-5xl mb-3">🏠</div>
          <h3 className="text-xl font-display font-bold text-primary mb-1">No Matching PGs Found</h3>
          <p className="text-sm text-onSurface-variant mb-6">
            We couldn't find any PG matching your exact filters. Try broadening your budget or location selection.
          </p>
          <button
            onClick={() => {
              setPgType("");
              setLocality("");
              setBudget("");
            }}
            className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Reset Filters & View All PGs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pg) => (
            <PgCard key={pg.id} pg={pg} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PgsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <div className="hero-gradient text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-2">
            Explore PG Accommodations
          </h1>
          <p className="text-white/80 text-base">
            Verified Boys, Girls & Co-living PGs across Jodhpur
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-onSurface-variant font-bold">Loading listings...</div>}>
        <PgsListContent />
      </Suspense>

      <Footer />
    </div>
  );
}
