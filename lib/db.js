import { supabase, hasSupabaseConfig } from './supabaseClient';
import { dummyPgs, ownerInfo } from '../data/dummyPgs';

// Mock storage helper to persist mock data changes when Supabase is not connected
const getMockData = (key, initialData) => {
  if (typeof window === 'undefined') return initialData;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return initialData;
    }
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
};

const saveMockData = (key, data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const initialComplaints = [
  { id: "DH123456", pg_id: "3", pg_name: "Dream Homes PG - Civil Lines", room_number: "204", student_name: "Arjun Mehra", student_phone: "+91 9988776655", category: "electrical", categoryIcon: "💡", categoryLabel: "Electrical", priority: "high", status: "in_progress", assigned_to: "Ramesh Electrician", assigned_to_phone: "+91 99887 76655", description: "AC in room 204 is not cooling properly since 2 days.", created_at: "2024-07-10T10:30:00", updated_at: "2024-07-11T09:00:00" },
  { id: "DH789012", pg_id: "1", pg_name: "Dream Homes PG - Shastri Nagar", room_number: "101", student_name: "Priya Sharma", student_phone: "+91 9876543210", category: "plumbing", categoryIcon: "🚿", categoryLabel: "Plumbing", priority: "medium", status: "resolved", assigned_to: "Suresh Plumber", assigned_to_phone: "+91 98876 54321", description: "Water pressure is very low in morning hours.", created_at: "2024-07-08T08:00:00", updated_at: "2024-07-09T16:00:00" },
  { id: "DH445566", pg_id: "4", pg_name: "Dream Homes PG - Ratanada", room_number: "305", student_name: "Rahul Verma", student_phone: "+91 9123456789", category: "cleaning", categoryIcon: "🧹", categoryLabel: "Cleaning", priority: "low", status: "pending", assigned_to: "", assigned_to_phone: "", description: "Room cleaning not done properly.", created_at: "2024-07-12T11:00:00", updated_at: "2024-07-12T11:00:00" },
  { id: "DH334455", pg_id: "6", pg_name: "Dream Homes PG - Sardarpura", room_number: "107", student_name: "Sneha Patel", student_phone: "+91 9000001111", category: "wifi", categoryIcon: "📶", categoryLabel: "WiFi / Internet", priority: "medium", status: "assigned", assigned_to: "IT Team", assigned_to_phone: "", description: "WiFi is very slow.", created_at: "2024-07-11T12:00:00", updated_at: "2024-07-11T12:00:00" },
];

const initialEnquiries = [
  { id: "1", pg_id: "3", pg_name: "Dream Homes PG - Civil Lines", visitor_name: "Vikram Singh", visitor_phone: "+91 9988001122", visitor_email: "vikram@gmail.com", room_type: "Single", move_in_date: "2024-08-01", message: "Looking for single room", status: "new", created_at: "2024-07-10T10:30:00" },
  { id: "2", pg_id: "2", pg_name: "Dream Homes PG - Residency Road", visitor_name: "Aishwarya Rao", visitor_phone: "+91 9812345678", visitor_email: "aishwarya@gmail.com", room_type: "Double", move_in_date: "2024-07-20", message: "Interested in double sharing", status: "contacted", created_at: "2024-07-08T08:00:00" },
  { id: "3", pg_id: "6", pg_name: "Dream Homes PG - Sardarpura", visitor_name: "Mohit Jain", visitor_phone: "+91 9001234567", visitor_email: "mohit@gmail.com", room_type: "Single", move_in_date: "2024-08-15", message: "Working professional", status: "new", created_at: "2024-07-12T11:00:00" },
];

const initialAlerts = [
  { id: "1", pg_id: "3", pg_name: "Dream Homes PG - Civil Lines", name: "Deepak Verma", phone: "+91 9123000001", room_type: "Single", message: "", created_at: "2024-07-09T10:30:00" },
  { id: "2", pg_id: "5", pg_name: "Dream Homes PG - Paota", name: "Kavya Sharma", phone: "+91 9345000002", room_type: "Double", message: "", created_at: "2024-07-10T08:00:00" },
];

if (typeof global !== 'undefined') {
  if (!global._mockComplaints) global._mockComplaints = [...initialComplaints];
  if (!global._mockEnquiries) global._mockEnquiries = [...initialEnquiries];
  if (!global._mockAlerts) global._mockAlerts = [...initialAlerts];
}

const getComplaintsList = () => {
  if (typeof window !== 'undefined') {
    return getMockData('mock_complaints', initialComplaints);
  }
  return global._mockComplaints || initialComplaints;
};

const saveComplaintsList = (list) => {
  if (typeof window !== 'undefined') {
    saveMockData('mock_complaints', list);
  } else if (typeof global !== 'undefined') {
    global._mockComplaints = list;
  }
};

const getEnquiriesList = () => {
  if (typeof window !== 'undefined') {
    return getMockData('mock_enquiries', initialEnquiries);
  }
  return global._mockEnquiries || initialEnquiries;
};

const saveEnquiriesList = (list) => {
  if (typeof window !== 'undefined') {
    saveMockData('mock_enquiries', list);
  } else if (typeof global !== 'undefined') {
    global._mockEnquiries = list;
  }
};

const getAlertsList = () => {
  if (typeof window !== 'undefined') {
    return getMockData('mock_alerts', initialAlerts);
  }
  return global._mockAlerts || initialAlerts;
};

const saveAlertsList = (list) => {
  if (typeof window !== 'undefined') {
    saveMockData('mock_alerts', list);
  } else if (typeof global !== 'undefined') {
    global._mockAlerts = list;
  }
};

function getCategoryDetails(category) {
  const categories = {
    electrical: { icon: "💡", label: "Electrical" },
    plumbing: { icon: "🚿", label: "Plumbing" },
    cleaning: { icon: "🧹", label: "Cleaning" },
    wifi: { icon: "📶", label: "WiFi / Internet" },
    furniture: { icon: "🛋️", label: "Furniture" },
    other: { icon: "🔧", label: "Other" }
  };
  return categories[category?.toLowerCase()] || { icon: "🔧", label: category || "Other" };
}

function mapPg(dbPg) {
  const images = dbPg.pg_images
    ? dbPg.pg_images
        .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        .map(img => img.image_url)
    : [];

  if (dbPg.cover_image_url && !images.includes(dbPg.cover_image_url)) {
    images.unshift(dbPg.cover_image_url);
  }

  const roomTypes = dbPg.room_types
    ? dbPg.room_types.map(r => ({
        type: r.type,
        rent: r.rent_per_month,
        deposit: r.security_deposit,
        ac: r.ac,
        attached_bathroom: r.attached_bathroom,
        available: r.available_units
      }))
    : [];

  const amenities = dbPg.pg_amenities
    ? dbPg.pg_amenities.map(pa => pa.amenities?.name).filter(Boolean)
    : [];

  return {
    id: dbPg.id,
    slug: dbPg.slug,
    name: dbPg.name,
    pg_type: dbPg.pg_type,
    address: dbPg.address,
    city: dbPg.city,
    locality: dbPg.locality,
    landmarks: dbPg.landmarks || [],
    description: dbPg.description,
    total_rooms: dbPg.total_rooms,
    available_rooms: dbPg.available_rooms,
    food_included: dbPg.food_included,
    food_type: dbPg.food_type,
    electricity_included: dbPg.electricity_included,
    notice_period_days: dbPg.notice_period_days,
    curfew_time: dbPg.curfew_time,
    cover_image_url: dbPg.cover_image_url,
    images: images.length > 0 ? images : [dbPg.cover_image_url],
    amenities: amenities,
    room_types: roomTypes,
    rating: dbPg.rating || 4.5,
    reviews: dbPg.reviews || 15
  };
}

export async function getPGs() {
  if (!hasSupabaseConfig) {
    console.warn("Supabase URL or Key not set. Using local mock fallback data for PGs.");
    return dummyPgs;
  }

  try {
    const { data, error } = await supabase
      .from('pgs')
      .select(`
        *,
        room_types (*),
        pg_images (*),
        pg_amenities (
          amenities (name)
        )
      `)
      .eq('is_active', true);

    if (error) throw error;
    if (!data || data.length === 0) {
      console.warn("No active PGs returned from database. Falling back to dummyPgs.");
      return dummyPgs;
    }
    return data.map(mapPg);
  } catch (err) {
    console.error("Failed to fetch PGs from Supabase. Falling back to mock data:", err);
    return dummyPgs;
  }
}

export async function getPGBySlug(slug) {
  if (!hasSupabaseConfig) {
    return dummyPgs.find(p => p.slug === slug);
  }

  try {
    const { data, error } = await supabase
      .from('pgs')
      .select(`
        *,
        room_types (*),
        pg_images (*),
        pg_amenities (
          amenities (name)
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return mapPg(data);
  } catch (err) {
    console.error(`Failed to fetch PG by slug "${slug}" from Supabase. Falling back to mock data:`, err);
    return dummyPgs.find(p => p.slug === slug);
  }
}

export async function createComplaint(complaint) {
  const id = complaint.id || "DH" + Date.now().toString().slice(-6);

  if (!hasSupabaseConfig) {
    const list = getComplaintsList();
    const pg = dummyPgs.find(p => p.id === complaint.pg_id);
    const newComplaint = {
      id,
      pg_id: complaint.pg_id,
      pg_name: pg ? pg.name : "Unknown PG",
      room_number: complaint.room_number,
      student_name: complaint.student_name,
      student_phone: complaint.student_phone,
      category: complaint.category,
      categoryIcon: getCategoryDetails(complaint.category).icon,
      categoryLabel: getCategoryDetails(complaint.category).label,
      priority: complaint.priority || "medium",
      status: "pending",
      assigned_to: "",
      assigned_to_phone: "",
      description: complaint.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    list.unshift(newComplaint);
    saveComplaintsList(list);
    return { data: newComplaint, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert([{
        id,
        pg_id: complaint.pg_id,
        room_number: complaint.room_number,
        student_name: complaint.student_name,
        student_phone: complaint.student_phone,
        category: complaint.category,
        description: complaint.description,
        priority: complaint.priority || 'medium',
        status: 'pending'
      }])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (err) {
    console.error("Failed to insert complaint in Supabase:", err);
    return { data: null, error: err };
  }
}

export async function getComplaintById(id) {
  const upperId = id.toUpperCase();

  if (!hasSupabaseConfig) {
    const list = getComplaintsList();
    const found = list.find(c => c.id.toUpperCase() === upperId);
    return { data: found || null, error: found ? null : new Error("Complaint not found") };
  }

  try {
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        pgs (name)
      `)
      .eq('id', upperId)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { data: null, error: new Error("Complaint not found") };

    const cat = getCategoryDetails(data.category);
    const formatted = {
      ...data,
      pg_name: data.pgs?.name || "Unknown PG",
      categoryIcon: cat.icon,
      categoryLabel: cat.label,
      updated_at: data.resolved_at || data.created_at
    };
    return { data: formatted, error: null };
  } catch (err) {
    console.error(`Failed to load complaint with ID ${id} from Supabase:`, err);
    return { data: null, error: err };
  }
}

export async function createEnquiry(enquiry) {
  if (!hasSupabaseConfig) {
    const list = getEnquiriesList();
    const pg = dummyPgs.find(p => p.id === enquiry.pg_id) || dummyPgs.find(p => p.name === enquiry.pg_name);
    const newEnquiry = {
      id: String(Date.now()),
      pg_id: pg ? pg.id : enquiry.pg_id,
      pg_name: pg ? pg.name : enquiry.pg_name,
      visitor_name: enquiry.visitor_name || enquiry.name,
      visitor_phone: enquiry.visitor_phone || enquiry.phone,
      visitor_email: enquiry.visitor_email || enquiry.email,
      room_type: enquiry.room_type,
      move_in_date: enquiry.move_in_date,
      message: enquiry.message,
      status: "new",
      created_at: new Date().toISOString()
    };
    list.unshift(newEnquiry);
    saveEnquiriesList(list);
    return { data: newEnquiry, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('enquiries')
      .insert([{
        pg_id: enquiry.pg_id,
        visitor_name: enquiry.visitor_name || enquiry.name,
        visitor_phone: enquiry.visitor_phone || enquiry.phone,
        visitor_email: enquiry.visitor_email || enquiry.email,
        room_type: enquiry.room_type,
        move_in_date: enquiry.move_in_date,
        message: enquiry.message,
        status: 'new'
      }])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (err) {
    console.error("Failed to submit enquiry in Supabase:", err);
    return { data: null, error: err };
  }
}

export async function createAvailabilityAlert(alert) {
  if (!hasSupabaseConfig) {
    const list = getAlertsList();
    const pg = dummyPgs.find(p => p.id === alert.pg_id);
    const newAlert = {
      id: String(Date.now()),
      pg_id: alert.pg_id,
      pg_name: pg ? pg.name : "Unknown PG",
      name: alert.name,
      phone: alert.phone,
      room_type: alert.room_type,
      message: alert.message,
      created_at: new Date().toISOString()
    };
    list.unshift(newAlert);
    saveAlertsList(list);
    return { data: newAlert, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('availability_alerts')
      .insert([{
        pg_id: alert.pg_id,
        name: alert.name,
        phone: alert.phone,
        room_type: alert.room_type,
        message: alert.message
      }])
      .select();

    if (error) throw error;
    return { data: data[0], error: null };
  } catch (err) {
    console.error("Failed to save room alert in Supabase:", err);
    return { data: null, error: err };
  }
}

export async function getAdminDashboardData() {
  if (!hasSupabaseConfig) {
    return {
      pgs: dummyPgs,
      complaints: getComplaintsList(),
      enquiries: getEnquiriesList(),
      alerts: getAlertsList(),
      ownerInfo
    };
  }

  try {
    const pgs = await getPGs();

    const { data: complaintsData, error: cErr } = await supabase
      .from('complaints')
      .select(`
        *,
        pgs (name)
      `)
      .order('created_at', { ascending: false });
    if (cErr) throw cErr;

    const complaints = (complaintsData || []).map(c => {
      const cat = getCategoryDetails(c.category);
      return {
        id: c.id,
        pg_id: c.pg_id,
        pg: c.pgs?.name || "Unknown PG",
        room: c.room_number,
        student: c.student_name,
        phone: c.student_phone,
        category: cat.label,
        icon: cat.icon,
        priority: c.priority,
        status: c.status,
        assigned_to: c.assigned_to || "",
        assigned_to_phone: c.assigned_to_phone || "",
        created_at: c.created_at ? c.created_at.split('T')[0] : ""
      };
    });

    const { data: enquiriesData, error: eErr } = await supabase
      .from('enquiries')
      .select(`
        *,
        pgs (name)
      `)
      .order('created_at', { ascending: false });
    if (eErr) throw eErr;

    const enquiries = (enquiriesData || []).map(e => ({
      id: e.id,
      name: e.visitor_name,
      phone: e.visitor_phone,
      pg: e.pgs?.name || "Unknown PG",
      room_type: e.room_type,
      move_in: e.move_in_date,
      status: e.status
    }));

    const { data: alertsData, error: aErr } = await supabase
      .from('availability_alerts')
      .select(`
        *,
        pgs (name)
      `)
      .order('created_at', { ascending: false });
    if (aErr) throw aErr;

    const alerts = (alertsData || []).map(a => ({
      id: a.id,
      name: a.name,
      phone: a.phone,
      pg: a.pgs?.name || "Unknown PG",
      room_type: a.room_type,
      date: a.created_at ? a.created_at.split('T')[0] : ""
    }));

    return {
      pgs,
      complaints,
      enquiries,
      alerts,
      ownerInfo
    };
  } catch (err) {
    console.error("Failed to load admin dashboard data from Supabase. Falling back:", err);
    return {
      pgs: dummyPgs,
      complaints: getComplaintsList(),
      enquiries: getEnquiriesList(),
      alerts: getAlertsList(),
      ownerInfo
    };
  }
}

export async function updateComplaintStatus(id, status) {
  if (!hasSupabaseConfig) {
    const list = getComplaintsList();
    const updated = list.map(c => c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c);
    saveComplaintsList(updated);
    return { success: true };
  }

  try {
    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolved_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error(`Failed to update status for complaint ${id}:`, err);
    return { success: false, error: err };
  }
}

export async function updateEnquiryStatus(id, status) {
  if (!hasSupabaseConfig) {
    const list = getEnquiriesList();
    const updated = list.map(e => e.id === id ? { ...e, status } : e);
    saveEnquiriesList(updated);
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('enquiries')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error(`Failed to update status for enquiry ${id}:`, err);
    return { success: false, error: err };
  }
}

export const demoTenants = [
  {
    id: "TEN001",
    email: "arjun@tenant.com",
    phone: "+91 9988776655",
    name: "Arjun Mehra",
    room_number: "204",
    pg_id: "3",
    pg_name: "Dream Homes PG - Civil Lines",
    rent_amount: "₹8,500/month",
    rent_status: "Paid",
    rent_due_date: "05th Sep 2026",
    move_in_date: "15th Jan 2024",
    bed_type: "Single Occupancy (AC)",
    warden_name: "Ramesh Sharma",
    warden_phone: "+91 98765 11223",
    wifi_ssid: "DreamHomes_Civil_204",
    wifi_pass: "DH#Civil2026",
    mess_timing: "Breakfast: 7:30 - 9:30 AM | Dinner: 8:00 - 10:00 PM"
  },
  {
    id: "TEN002",
    email: "priya@tenant.com",
    phone: "+91 9876543210",
    name: "Priya Sharma",
    room_number: "101",
    pg_id: "1",
    pg_name: "Dream Homes PG - Shastri Nagar",
    rent_amount: "₹6,000/month",
    rent_status: "Paid",
    rent_due_date: "10th Sep 2026",
    move_in_date: "01st Mar 2024",
    bed_type: "Double Sharing (AC)",
    warden_name: "Sunita Devi",
    warden_phone: "+91 98765 44332",
    wifi_ssid: "DreamHomes_Shastri_101",
    wifi_pass: "DH#Shastri2026",
    mess_timing: "Breakfast: 7:30 - 9:30 AM | Dinner: 8:00 - 10:00 PM"
  }
];

export const demoStudents = demoTenants;

export async function getTenantComplaints(phone) {
  if (!hasSupabaseConfig) {
    const list = getComplaintsList();
    if (!phone) return list;
    const clean = phone.replace(/\s+/g, "");
    return list.filter(c => (c.student_phone || "").replace(/\s+/g, "").includes(clean));
  }

  try {
    const cleanPhone = (phone || "").replace(/\+/g, '').replace(/\s+/g, '');
    const { data, error } = await supabase
      .from('complaints')
      .select(`
        *,
        pgs (name)
      `)
      .ilike('student_phone', `%${cleanPhone}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) {
      const list = getComplaintsList();
      return list.filter(c => (c.student_phone || "").replace(/\s+/g, "").includes(cleanPhone));
    }

    return (data || []).map(c => {
      const cat = getCategoryDetails(c.category);
      return {
        ...c,
        pg_name: c.pgs?.name || "Dream Homes PG",
        categoryIcon: cat.icon,
        categoryLabel: cat.label,
        updated_at: c.resolved_at || c.created_at
      };
    });
  } catch (err) {
    console.error("Failed to fetch tenant complaints from Supabase:", err);
    const list = getComplaintsList();
    const clean = (phone || "").replace(/\s+/g, "");
    return list.filter(c => (c.student_phone || "").replace(/\s+/g, "").includes(clean));
  }
}

export const getStudentComplaints = getTenantComplaints;


