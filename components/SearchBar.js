"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ localities }) {
  const router = useRouter();
  const [selectedLocality, setSelectedLocality] = useState("");
  const [selectedPgType, setSelectedPgType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedLocality) params.set("locality", selectedLocality);
    if (selectedPgType) params.set("type", selectedPgType);
    if (selectedBudget) params.set("budget", selectedBudget);

    const queryString = params.toString();
    router.push(`/pgs${queryString ? `?${queryString}` : ""}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
      <select
        value={selectedLocality}
        onChange={(e) => setSelectedLocality(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
      >
        <option value="">All Jodhpur</option>
        {localities.map((locality, i) => (
          <option key={i} value={locality}>
            {locality}
          </option>
        ))}
      </select>

      <select
        value={selectedPgType}
        onChange={(e) => setSelectedPgType(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
      >
        <option value="">PG Type</option>
        <option value="boys">Boys</option>
        <option value="girls">Girls</option>
        <option value="co-living">Co-Living</option>
      </select>

      <select
        value={selectedBudget}
        onChange={(e) => setSelectedBudget(e.target.value)}
        className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
      >
        <option value="">Budget</option>
        <option value="5000">Under ₹5,000</option>
        <option value="8000">Under ₹8,000</option>
        <option value="12000">Under ₹12,000</option>
      </select>

      <button
        type="submit"
        className="bg-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-purple-800 transition-colors text-sm whitespace-nowrap"
      >
        Search PGs
      </button>
    </form>
  );
}
