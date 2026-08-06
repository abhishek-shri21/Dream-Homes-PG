import Link from "next/link";

export default function PgCard({ pg }) {
  const minRent = Math.min(...pg.room_types.map((r) => r.rent));
  const badgeClass =
    pg.pg_type === "boys"
      ? "badge-boys"
      : pg.pg_type === "girls"
      ? "badge-girls"
      : "badge-coliving";
  const badgeLabel =
    pg.pg_type === "boys" ? "Boys" : pg.pg_type === "girls" ? "Girls" : "Co-Living";

  return (
    <div className="bg-white rounded-[24px] overflow-hidden ambient-shadow hover-lift border border-gray-100/80 flex flex-col justify-between h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden group">
        <img
          src={pg.cover_image_url}
          alt={pg.name}
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
        {pg.available_rooms > 0 && (
          <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
            {pg.available_rooms} Available
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display font-bold text-gray-900 text-lg leading-tight mb-1">{pg.name}</h3>
          <p className="text-gray-500 text-xs font-medium flex items-center gap-1 mb-2">
            <span>📍</span> {pg.locality}, {pg.city}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-yellow-400">★</span>
            <span className="font-bold text-xs text-gray-800">{pg.rating}</span>
            <span className="text-gray-400 text-xs">({pg.reviews} reviews)</span>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {pg.amenities.slice(0, 4).map((a) => (
              <span key={a} className="bg-primary/5 text-primary text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-primary/10">
                {a}
              </span>
            ))}
            {pg.amenities.length > 4 && (
              <span className="bg-gray-100 text-gray-500 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{pg.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-gray-400 text-[11px] block">Starting from</span>
            <p className="text-primary font-display font-extrabold text-xl leading-tight">
              ₹{minRent.toLocaleString()}
              <span className="text-gray-400 text-xs font-normal">/mo</span>
            </p>
          </div>
          <Link
            href={`/pgs/${pg.slug}`}
            className="bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-primary/30"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
