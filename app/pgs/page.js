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

  // Update filter state if URL params change
  useEffect(() => {
    const locParam = searchParams.get("locality") || "";
    const typeParam = searchParams.get("type") || "";
    const budgetParam = searchParams.get("budget") || "";
    if (locParam) setLocality(locParam);
    if (typeParam) setPgType(typeParam);
    if (budgetParam) setBudget(budgetParam);
  }, [searchParams]);

  // List of all localities
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-gray-100 flex flex-wrap gap-3 items-center">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Locality Filter:</label>
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="border border-purple-200 bg-purple-50/50 rounded-lg px-4 py-2 text-sm font-semibold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="">All Jodhpur</option>
            {allLocalities.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">PG Type:</label>
          <select
            value={pgType}
            onChange={(e) => setPgType(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="co-living">Co-Living</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Max Budget:</label>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option value="">Any Budget</option>
            <option value="4000">Under ₹4,000</option>
            <option value="6000">Under ₹6,000</option>
            <option value="9000">Under ₹9,000</option>
            <option value="12000">Under ₹12,000</option>
          </select>
        </div>

        {(pgType || locality || budget) && (
          <button
            onClick={() => {
              setPgType("");
              setLocality("");
              setBudget("");
            }}
            className="text-red-500 text-sm font-medium hover:underline self-end pb-2"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-gray-500 text-sm font-semibold self-end pb-2">
          Showing {filtered.length} of {pgs.length} PG{filtered.length !== 1 ? "s" : ""}
          {locality ? ` in ${locality}` : " in All Jodhpur"}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm h-[400px] flex flex-col"
            >
              <div className="bg-gray-200 h-48 w-full" />
              <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-10 bg-gray-200 rounded-xl w-full mt-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="text-5xl mb-3">🏠</div>
          <p className="text-lg font-bold text-gray-700">No PGs match your selected filters.</p>
          <p className="text-sm text-gray-500 mt-1">Try selecting "All Jodhpur" to view all available PGs.</p>
          <button
            onClick={() => {
              setPgType("");
              setLocality("");
              setBudget("");
            }}
            className="mt-4 bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-purple-800 transition-colors"
          >
            Show All Jodhpur PGs
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
    <>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="hero-gradient text-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ fontFamily: "Georgia, serif" }}
            >
              All PG Properties
            </h1>
            <p className="text-white/80">Find your perfect PG across Jodhpur</p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading PGs...</div>}>
          <PgsListContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
