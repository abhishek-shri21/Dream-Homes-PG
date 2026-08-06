import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import EnquiryForm from "../../../components/EnquiryForm";
import RoomTypesSection from "../../../components/RoomTypesSection";
import { ownerInfo } from "../../../data/dummyPgs";
import { getPGs, getPGBySlug } from "../../../lib/db";
import Link from "next/link";

export async function generateStaticParams() {
  const pgs = await getPGs();
  return pgs.map((pg) => ({ slug: pg.slug }));
}

export default async function PgDetailPage({ params }) {
  const pg = await getPGBySlug(params.slug);

  if (!pg) {
    return (
      <>
        <Navbar />
        <div className="text-center py-32 text-gray-400">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">PG Not Found</h2>
          <Link href="/pgs" className="text-purple-700 hover:underline">Browse all PGs</Link>
        </div>
        <Footer />
      </>
    );
  }

  const badgeClass = pg.pg_type === "boys" ? "badge-boys" : pg.pg_type === "girls" ? "badge-girls" : "badge-coliving";
  const badgeLabel = pg.pg_type === "boys" ? "Boys" : pg.pg_type === "girls" ? "Girls" : "Co-Living";

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4">
          <Link href="/" className="hover:text-purple-700">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/pgs" className="hover:text-purple-700">All PGs</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">{pg.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-64 md:h-80">
              <img src={pg.images[0]} alt={pg.name} className="col-span-2 w-full h-full object-cover" />
              <div className="grid grid-rows-2 gap-2">
                {pg.images.slice(1, 3).map((img, i) => (
                  <img key={i} src={img} alt={`${pg.name} ${i + 2}`} className="w-full h-full object-cover" />
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeClass}`}>{badgeLabel}</span>
                {pg.available_rooms > 0
                  ? <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">{pg.available_rooms} Rooms Available</span>
                  : <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-semibold">Currently Full</span>
                }
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1" style={{ fontFamily: "Georgia, serif" }}>{pg.name}</h1>
              <p className="text-gray-500 flex items-center gap-1">
                <span>📍</span> {pg.address}, {pg.city}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-yellow-400">★</span>
                <span className="font-semibold">{pg.rating}</span>
                <span className="text-gray-400 text-sm">({pg.reviews} reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h2 className="font-bold text-gray-800 mb-2">About this PG</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{pg.description}</p>
            </div>

            {/* Room Types & Interactive Payment Section */}
            <RoomTypesSection roomTypes={pg.room_types} pgName={pg.name} />

            {/* Amenities */}
            <div>
              <h2 className="font-bold text-gray-800 text-lg mb-3">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pg.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 bg-purple-50 rounded-lg px-3 py-2 text-sm text-purple-700 font-medium">
                    <span className="text-green-500">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-800 mb-3">🏠 House Rules & Policies</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Curfew:</span> <span className="font-medium text-gray-800">{pg.curfew_time}</span></div>
                <div><span className="text-gray-500">Notice Period:</span> <span className="font-medium text-gray-800">{pg.notice_period_days} days</span></div>
                <div><span className="text-gray-500">Food:</span> <span className="font-medium text-gray-800">{pg.food_included ? `Included (${pg.food_type})` : "Not included"}</span></div>
                <div><span className="text-gray-500">Electricity:</span> <span className="font-medium text-gray-800">{pg.electricity_included ? "Included" : "Charged separately"}</span></div>
              </div>
            </div>

            {/* Nearby Landmarks */}
            <div>
              <h2 className="font-bold text-gray-800 text-lg mb-3">📍 Nearby Landmarks</h2>
              <div className="flex flex-wrap gap-2">
                {pg.landmarks.map((l) => (
                  <span key={l} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm">{l}</span>
                ))}
              </div>
            </div>

            {/* Complaint CTA */}
            <div className="bg-purple-700 text-white rounded-2xl p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Already a tenant here?</h3>
                <p className="text-white/80 text-sm">Raise a maintenance complaint instantly.</p>
              </div>
              <Link href="/complaints" className="bg-yellow-400 text-purple-900 px-5 py-2 rounded-xl font-bold hover:bg-yellow-300 transition-colors text-sm whitespace-nowrap">
                Raise Complaint
              </Link>
            </div>
          </div>

          {/* Right / Sidebar */}
          <div className="space-y-4">
            {/* Enquiry Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md sticky top-20">
              <h2 className="font-bold text-gray-800 text-lg mb-1">Book a Visit</h2>
              <p className="text-gray-400 text-sm mb-4">Fill this form and we'll call you within 24 hours.</p>
              <EnquiryForm pgName={pg.name} roomTypes={pg.room_types} pgId={pg.id} />

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <a
                  href={`tel:${ownerInfo.phone}`}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm w-full"
                >
                  📞 Call {ownerInfo.phone}
                </a>
                <a
                  href={`https://wa.me/${ownerInfo.whatsapp}?text=Hi, I'm interested in ${pg.name}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg font-semibold hover:bg-green-600 transition-colors text-sm w-full"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
