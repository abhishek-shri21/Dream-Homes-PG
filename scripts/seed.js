const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from .env.local...');
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
          value = value.substring(1, value.length - 1);
        }
        if (value.length > 0 && value.charAt(0) === "'" && value.charAt(value.length - 1) === "'") {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value.trim();
      }
    });
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url') {
  console.error('Error: Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyPgs = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    slug: "dream-homes-pg-shastri-nagar",
    name: "Dream Homes PG - Shastri Nagar",
    pg_type: "boys",
    address: "12, Shastri Nagar, Near City Mall",
    city: "Jodhpur",
    locality: "Shastri Nagar",
    description: "Premium boys PG with modern amenities, 24/7 security, and home-cooked meals. Ideal for students and working professionals.",
    total_rooms: 20,
    available_rooms: 5,
    food_included: true,
    food_type: "veg",
    electricity_included: true,
    notice_period_days: 30,
    curfew_time: "10:30 PM",
    cover_image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
    ],
    amenities: ["WiFi", "AC", "Laundry", "CCTV", "Power Backup", "RO Water", "Study Table"],
    room_types: [
      { type: "Single", rent: 8000, deposit: 16000, ac: true, attached_bathroom: true, available: 2 },
      { type: "Double", rent: 5500, deposit: 11000, ac: true, attached_bathroom: false, available: 2 },
      { type: "Triple", rent: 4000, deposit: 8000, ac: false, attached_bathroom: false, available: 1 },
    ]
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    slug: "dream-homes-pg-residency-road",
    name: "Dream Homes PG - Residency Road",
    pg_type: "girls",
    address: "45, Residency Road, Opp. St. Mary's School",
    city: "Jodhpur",
    locality: "Residency Road",
    description: "Safe and secure girls PG with homely environment. 24/7 warden, CCTV surveillance, and healthy meals.",
    total_rooms: 15,
    available_rooms: 3,
    food_included: true,
    food_type: "both",
    electricity_included: false,
    notice_period_days: 30,
    curfew_time: "9:30 PM",
    cover_image_url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
    ],
    amenities: ["WiFi", "AC", "CCTV", "Power Backup", "Geyser", "Fridge", "Study Table", "Housekeeping"],
    room_types: [
      { type: "Single", rent: 9000, deposit: 18000, ac: true, attached_bathroom: true, available: 1 },
      { type: "Double", rent: 6000, deposit: 12000, ac: true, attached_bathroom: true, available: 2 },
    ]
  },
  {
    id: "30000000-0000-0000-0000-000000000003",
    slug: "dream-homes-pg-civil-lines",
    name: "Dream Homes PG - Civil Lines",
    pg_type: "co-living",
    address: "78, Civil Lines, Near High Court",
    city: "Jodhpur",
    locality: "Civil Lines",
    description: "Modern co-living space with high-speed internet, gym access, and a vibrant community. Perfect for working professionals.",
    total_rooms: 25,
    available_rooms: 8,
    food_included: false,
    food_type: "none",
    electricity_included: true,
    notice_period_days: 15,
    curfew_time: "No Curfew",
    cover_image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
    amenities: ["WiFi", "AC", "Gym", "Parking", "CCTV", "Power Backup", "Laundry", "RO Water"],
    room_types: [
      { type: "Single", rent: 10000, deposit: 20000, ac: true, attached_bathroom: true, available: 4 },
      { type: "Double", rent: 7000, deposit: 14000, ac: true, attached_bathroom: true, available: 4 },
    ]
  },
  {
    id: "40000000-0000-0000-0000-000000000004",
    slug: "dream-homes-pg-ratanada",
    name: "Dream Homes PG - Ratanada",
    pg_type: "boys",
    address: "23, Ratanada Colony, Near Polo Ground",
    city: "Jodhpur",
    locality: "Ratanada",
    description: "Budget-friendly boys PG near AIIMS and medical college. Clean rooms, reliable WiFi, and home-cooked vegetarian meals.",
    total_rooms: 18,
    available_rooms: 6,
    food_included: true,
    food_type: "veg",
    electricity_included: false,
    notice_period_days: 30,
    curfew_time: "11:00 PM",
    cover_image_url: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80",
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    ],
    amenities: ["WiFi", "RO Water", "CCTV", "Study Table", "Power Backup"],
    room_types: [
      { type: "Double", rent: 4500, deposit: 9000, ac: false, attached_bathroom: false, available: 3 },
      { type: "Triple", rent: 3500, deposit: 7000, ac: false, attached_bathroom: false, available: 3 },
    ]
  },
  {
    id: "50000000-0000-0000-0000-000000000005",
    slug: "dream-homes-pg-paota",
    name: "Dream Homes PG - Paota",
    pg_type: "girls",
    address: "56, Paota Colony, B Road",
    city: "Jodhpur",
    locality: "Paota",
    description: "Well-maintained girls PG with strict security protocols. Walking distance from MBM Engineering College and Umaid Hospital.",
    total_rooms: 12,
    available_rooms: 2,
    food_included: true,
    food_type: "veg",
    electricity_included: true,
    notice_period_days: 30,
    curfew_time: "9:00 PM",
    cover_image_url: "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1560185008-b033106af5c3?w=800&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80",
    ],
    amenities: ["WiFi", "AC", "Geyser", "CCTV", "Housekeeping", "Study Table", "Fridge"],
    room_types: [
      { type: "Single", rent: 7500, deposit: 15000, ac: true, attached_bathroom: true, available: 1 },
      { type: "Double", rent: 5000, deposit: 10000, ac: false, attached_bathroom: false, available: 1 },
    ]
  },
  {
    id: "60000000-0000-0000-0000-000000000006",
    slug: "dream-homes-pg-sardarpura",
    name: "Dream Homes PG - Sardarpura",
    pg_type: "co-living",
    address: "90, Sardarpura, Sector 7",
    city: "Jodhpur",
    locality: "Sardarpura",
    description: "Premium co-living near IIT Jodhpur. High-speed fiber internet, fully furnished rooms, and 24/7 maintenance support.",
    total_rooms: 30,
    available_rooms: 10,
    food_included: false,
    food_type: "none",
    electricity_included: true,
    notice_period_days: 15,
    curfew_time: "No Curfew",
    cover_image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    ],
    amenities: ["WiFi", "AC", "Gym", "Parking", "CCTV", "Power Backup", "Laundry", "TV", "Housekeeping"],
    room_types: [
      { type: "Single", rent: 12000, deposit: 24000, ac: true, attached_bathroom: true, available: 5 },
      { type: "Double", rent: 8000, deposit: 16000, ac: true, attached_bathroom: true, available: 5 },
    ]
  }
];

async function seed() {
  console.log('Starting seed process...');

  try {
    // 1. Get or create Owner
    console.log('Seeding owner...');
    const ownerData = {
      name: 'Ramesh Sharma',
      phone: '+91 98765 43210',
      email: 'owner@dreamhomespg.com',
      business_name: 'Dream Homes PG'
    };

    let { data: owners, error: ownerErr } = await supabase
      .from('owners')
      .select('id')
      .eq('email', ownerData.email);

    if (ownerErr) throw ownerErr;

    let ownerId;
    if (owners && owners.length > 0) {
      ownerId = owners[0].id;
      console.log('Owner already exists with ID:', ownerId);
    } else {
      const { data: newOwner, error: createOwnerErr } = await supabase
        .from('owners')
        .insert([ownerData])
        .select();

      if (createOwnerErr) throw createOwnerErr;
      ownerId = newOwner[0].id;
      console.log('Created owner with ID:', ownerId);
    }

    // 2. Seed Amenities list
    console.log('Seeding amenities master list...');
    const allUniqueAmenities = [...new Set(dummyPgs.flatMap((pg) => pg.amenities))];
    const amenitiesToInsert = allUniqueAmenities.map((name) => ({ name }));

    const { data: insertedAmenities, error: amenErr } = await supabase
      .from('amenities')
      .upsert(amenitiesToInsert, { onConflict: 'name' })
      .select();

    if (amenErr) throw amenErr;
    console.log(`Seeded ${insertedAmenities.length} unique amenities.`);

    // Build map of amenity name -> id
    const amenityMap = {};
    insertedAmenities.forEach((a) => {
      amenityMap[a.name] = a.id;
    });

    // 3. Seed PGs, Room Types, Images, and PG-Amenity links
    console.log('Seeding PGs and related tables...');
    for (const pg of dummyPgs) {
      console.log(`Processing PG: "${pg.name}"...`);

      // Check if PG exists by slug
      let { data: existingPgs, error: pgCheckErr } = await supabase
        .from('pgs')
        .select('id')
        .eq('slug', pg.slug);

      if (pgCheckErr) throw pgCheckErr;

      let pgId;
      const pgRecord = {
        id: pg.id,
        owner_id: ownerId,
        name: pg.name,
        slug: pg.slug,
        pg_type: pg.pg_type,
        description: pg.description,
        address: pg.address,
        city: pg.city,
        locality: pg.locality,
        total_rooms: pg.total_rooms,
        available_rooms: pg.available_rooms,
        food_included: pg.food_included,
        food_type: pg.food_type,
        electricity_included: pg.electricity_included,
        notice_period_days: pg.notice_period_days,
        curfew_time: pg.curfew_time,
        cover_image_url: pg.cover_image_url,
        is_active: true
      };

      if (existingPgs && existingPgs.length > 0) {
        pgId = existingPgs[0].id;
        console.log(`PG "${pg.name}" already exists, updating...`);
        const { error: pgUpdateErr } = await supabase
          .from('pgs')
          .update(pgRecord)
          .eq('id', pgId);

        if (pgUpdateErr) throw pgUpdateErr;
      } else {
        const { data: newPg, error: pgCreateErr } = await supabase
          .from('pgs')
          .insert([pgRecord])
          .select();

        if (pgCreateErr) throw pgCreateErr;
        pgId = newPg[0].id;
        console.log(`Created PG "${pg.name}" with ID: ${pgId}`);
      }

      // Clear existing child relations to avoid duplicates during re-runs
      await supabase.from('room_types').delete().eq('pg_id', pgId);
      await supabase.from('pg_images').delete().eq('pg_id', pgId);
      await supabase.from('pg_amenities').delete().eq('pg_id', pgId);

      // Insert Room Types
      const roomTypesData = pg.room_types.map((rt) => ({
        pg_id: pgId,
        type: rt.type,
        rent_per_month: rt.rent,
        security_deposit: rt.deposit,
        total_units: 10, // dummy default
        available_units: rt.available,
        ac: rt.ac,
        attached_bathroom: rt.attached_bathroom,
        furniture_included: true
      }));

      const { error: rtErr } = await supabase
        .from('room_types')
        .insert(roomTypesData);

      if (rtErr) throw rtErr;
      console.log(`  - Seeded room types`);

      // Insert Images
      const imagesData = pg.images.map((url, index) => ({
        pg_id: pgId,
        image_url: url,
        caption: `${pg.name} Image ${index + 1}`,
        display_order: index
      }));

      const { error: imgErr } = await supabase
        .from('pg_images')
        .insert(imagesData);

      if (imgErr) throw imgErr;
      console.log(`  - Seeded gallery images`);

      // Link Amenities
      const pgAmenitiesData = pg.amenities.map((name) => ({
        pg_id: pgId,
        amenity_id: amenityMap[name]
      })).filter((pa) => pa.amenity_id !== undefined);

      if (pgAmenitiesData.length > 0) {
        const { error: pgAmenErr } = await supabase
          .from('pg_amenities')
          .insert(pgAmenitiesData);

        if (pgAmenErr) throw pgAmenErr;
        console.log(`  - Seeded linked amenities`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
}

seed();
