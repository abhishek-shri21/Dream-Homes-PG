import Link from "next/link";

export default function PgCard({ pg }) {
  if (!pg) return null;

  const roomTypes = Array.isArray(pg.room_types) ? pg.room_types : [];
  const minRent =
    roomTypes.length > 0
      ? Math.min(...roomTypes.map((r) => r.rent || 0))
      : 4500;

  const amenities = Array.isArray(pg.amenities) ? pg.amenities : [];
  const pgType = pg.pg_type || "boys";

  const badgeClass =
    pgType === "boys"
      ? "badge-boys"
      : pgType === "girls"
      ? "badge-girls"
      : "badge-coliving";

  const badgeLabel =
    pgType === "boys" ? "Boys" : pgType === "girls" ? "Girls" : "Co-Living";

  const coverImage = pg.cover_image_url || (Array.isArray(pg.images) && pg.images[0]) || "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white rounded-[24px] overflow-hidden ambient-shadow hover-lift border border-outline-variant/40 flex flex-col justify-between h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden group bg-surface-container">
        <img
          src={coverImage}
          alt={pg.name || "PG Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${badgeClass}`}>
          {badgeLabel}
        </span>
        {pg.available_rooms === 0 && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
            Full
          </span>
        )}
        {(pg.available_rooms || 0) > 0 && (
          <span className="absolute top-3 right-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
            {pg.available_rooms} Available
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display font-bold text-primary text-lg leading-tight mb-1">{pg.name || "Dream Homes PG"}</h3>
          <p className="text-onSurface-variant text-xs font-medium flex items-center gap-1 mb-2">
            <span>📍</span> {pg.locality || "Jodhpur"}, {pg.city || "Jodhpur"}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-amber-400">★</span>
            <span className="font-bold text-xs text-primary">{pg.rating || 4.5}</span>
            <span className="text-onSurface-variant/70 text-xs">({pg.reviews || 12} reviews)</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {amenities.slice(0, 4).map((a) => (
              <span key={a} className="bg-primary/5 text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-primary/10">
                {a}
              </span>
            ))}
            {amenities.length > 4 && (
              <span className="bg-surface-container text-onSurface-variant text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-surface-container">
          <div>
            <span className="text-onSurface-variant/70 text-[11px] block font-semibold">Starting from</span>
            <p className="text-primary font-display font-extrabold text-xl leading-tight">
              ₹{minRent.toLocaleString()}
              <span className="text-onSurface-variant/70 text-xs font-normal">/mo</span>
            </p>
          </div>
          <Link
            href={`/pgs/${pg.slug || "dream-homes-pg-shastri-nagar"}`}
            className="bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
