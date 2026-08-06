import { NextResponse } from "next/server";
import { dummyPgs, ownerInfo } from "../../../data/dummyPgs";

// System prompt with rich knowledge about Dream Homes PG
const SYSTEM_PROMPT = `You are "DreamBot", an ultra-helpful AI Assistant for "Dream Homes PG Jodhpur".
Your job is to assist tenants, students, working professionals, and visitors with accurate, polite, and detailed answers about Dream Homes PG accommodations in Jodhpur, India.

--- KNOWLEDGE BASE ---

1. ABOUT DREAM HOMES PG:
- Premium, safe, and comfortable PG accommodations in Jodhpur for Boys, Girls, and Co-living.
- Owner / Contact Person: ${ownerInfo.name}
- Phone / WhatsApp: ${ownerInfo.phone} (${ownerInfo.whatsapp})
- Email: ${ownerInfo.email}

2. PG PROPERTIES LISTINGS:
${dummyPgs
  .map(
    (pg) => `
- ${pg.name} (${pg.pg_type.toUpperCase()} PG)
  * Locality: ${pg.locality}, Address: ${pg.address}
  * Nearby Landmarks: ${pg.landmarks.join(", ")}
  * Description: ${pg.description}
  * Curfew Time: ${pg.curfew_time} | Food: ${pg.food_included ? `Included (${pg.food_type})` : "Not included"}
  * Electricity: ${pg.electricity_included ? "Included" : "Excluded"} | Notice Period: ${pg.notice_period_days} days
  * Amenities: ${pg.amenities.join(", ")}
  * Available Rooms (${pg.available_rooms}/${pg.total_rooms}):
    ${pg.room_types
      .map(
        (r) =>
          `${r.type} Sharing: ₹${r.rent}/month (Deposit: ₹${r.deposit}, AC: ${r.ac ? "Yes" : "No"}, Bath: ${r.attached_bathroom ? "Attached" : "Shared"})`
      )
      .join("\n    ")}
  * Rating: ${pg.rating} ⭐ (${pg.reviews} reviews)
`
  )
  .join("\n")}

3. WEBSITE FEATURES & HELPFUL LINKS:
- Browse all PGs: Navigate to "/pgs" or use the search bar to filter by locality, type (boys/girls/co-living), or budget.
- Student & Owner Login: Go to "/login" to access student portal or owner dashboard.
- Raise Complaint: Go to "/complaints" page to submit maintenance, WiFi, food, cleanliness or security complaints.
- Track Complaint Status: Go to "/track" page and enter your Complaint Ticket ID.
- Room Availability Alerts: Go to "/availability" page to get notified when a room opens up.

4. GUIDELINES:
- Keep answers warm, friendly, concise, and informative. Use emojis and markdown formatting (*, **) appropriately.
- Highlight specific PG options when asked for budget (e.g. cheapest option is Ratanada PG at ₹3,500/mo, single occupancy starts from ₹7,500/mo).
- If asked about booking or visiting, direct them to call ${ownerInfo.phone} or submit an enquiry on the website.`;

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, userApiKey } = body;

    const apiKey =
      userApiKey ||
      process.env.GROQ_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (apiKey && apiKey.trim() !== "") {
      const modelsToTry = [
        "llama-3.3-70b-versatile",
        "llama3-70b-8192",
        "mixtral-8x7b-32768",
        "llama3-8b-8192",
      ];

      for (const model of modelsToTry) {
        try {
          const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey.trim()}`,
            },
            body: JSON.stringify({
              model: model,
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
              temperature: 0.7,
              max_tokens: 800,
            }),
          });

          if (groqResponse.ok) {
            const data = await groqResponse.json();
            const reply = data?.choices?.[0]?.message?.content;
            if (reply) {
              return NextResponse.json({
                reply,
                mode: "groq",
                model: model,
              });
            }
          } else {
            const errText = await groqResponse.text();
            console.warn(`Groq API model ${model} failed:`, groqResponse.status, errText);
          }
        } catch (err) {
          console.error(`Groq API fetch error for ${model}:`, err);
        }
      }
    }

    // Fallback response generator if API calls fail
    const lastUserMsg =
      messages?.[messages.length - 1]?.content?.toLowerCase() || "";

    const fallbackReply = generateFallbackResponse(lastUserMsg);

    return NextResponse.json({
      reply: fallbackReply,
      mode: "local_fallback",
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

// Smart local fallback answering engine
function generateFallbackResponse(query) {
  if (
    query.includes("complaint") ||
    query.includes("issue") ||
    query.includes("broken") ||
    query.includes("problem")
  ) {
    return "🛠️ **Complaints & Support:**\n\nYou can easily raise a complaint for repairs, WiFi, cleaning, or food quality on our **Raise Complaint** page (`/complaints`).\nOnce submitted, you'll receive a Ticket ID which you can track anytime on the **Track Complaint** page (`/track`).";
  }

  if (query.includes("girl") || query.includes("female") || query.includes("women")) {
    const girlsPgs = dummyPgs.filter((p) => p.pg_type === "girls");
    return `👧 **Girls PGs in Jodhpur:**\n\nWe have ${girlsPgs.length} top-rated Girls PGs with 24/7 security & homely meals:\n\n${girlsPgs
      .map(
        (p) =>
          `• **${p.name}** (${p.locality}) - Rent from ₹${Math.min(...p.room_types.map((r) => r.rent))}/mo. Curfew: ${p.curfew_time}.`
      )
      .join("\n")}\n\nVisit **/pgs** to filter and view full details!`;
  }

  if (query.includes("boy") || query.includes("male") || query.includes("men")) {
    const boysPgs = dummyPgs.filter((p) => p.pg_type === "boys");
    return `👦 **Boys PGs in Jodhpur:**\n\nWe have ${boysPgs.length} excellent Boys PGs close to colleges & transportation:\n\n${boysPgs
      .map(
        (p) =>
          `• **${p.name}** (${p.locality}) - Rent from ₹${Math.min(...p.room_types.map((r) => r.rent))}/mo. Amenities: ${p.amenities.slice(0, 4).join(", ")}.`
      )
      .join("\n")}\n\nVisit **/pgs** for complete room options.`;
  }

  if (
    query.includes("co-living") ||
    query.includes("coliving") ||
    query.includes("couple") ||
    query.includes("both")
  ) {
    const colivingPgs = dummyPgs.filter((p) => p.pg_type === "co-living");
    return `🏢 **Co-Living PGs in Jodhpur:**\n\nPerfect for professionals & students who want modern freedom:\n\n${colivingPgs
      .map(
        (p) =>
          `• **${p.name}** (${p.locality}) - Rent from ₹${Math.min(...p.room_types.map((r) => r.rent))}/mo. Curfew: ${p.curfew_time}. Features: Gym, High-speed WiFi.`
      )
      .join("\n")}`;
  }

  if (
    query.includes("cheap") ||
    query.includes("budget") ||
    query.includes("low price") ||
    query.includes("4000") ||
    query.includes("3500")
  ) {
    return "💰 **Budget Friendly PGs:**\n\n• **Dream Homes PG - Ratanada**: Triple sharing starting at **₹3,500/mo** & Double sharing at **₹4,500/mo** (includes meals!).\n• **Dream Homes PG - Shastri Nagar**: Triple sharing starting at **₹4,000/mo**.\n• **Dream Homes PG - Paota**: Double sharing starting at **₹5,000/mo**.";
  }

  if (
    query.includes("food") ||
    query.includes("meal") ||
    query.includes("breakfast") ||
    query.includes("dinner") ||
    query.includes("lunch")
  ) {
    return "🍲 **Food & Dining Info:**\n\n• Most of our PGs (Shastri Nagar, Residency Road, Ratanada, Paota) include **3 home-cooked meals daily** (pure veg or veg/non-veg options).\n• Fresh RO drinking water is provided 24/7 in all PG locations.";
  }

  if (
    query.includes("contact") ||
    query.includes("phone") ||
    query.includes("owner") ||
    query.includes("call") ||
    query.includes("number")
  ) {
    return `📞 **Contact & Booking Information:**\n\n• **Owner:** ${ownerInfo.name}\n• **Phone:** ${ownerInfo.phone}\n• **WhatsApp:** ${ownerInfo.phone}\n• **Email:** ${ownerInfo.email}\n\nYou can also submit an enquiry form directly on any PG property page!`;
  }

  return `🏠 **Welcome to Dream Homes PG Jodhpur!**\n\nI can help you with:\n• Finding Boys, Girls, or Co-living PGs across Jodhpur (Shastri Nagar, Ratanada, Sardarpura, etc.)\n• Checking rent rates & room amenities\n• Raising and tracking maintenance complaints\n• Subscribing to room availability alerts\n\nHow can I help you today? Feel free to ask or click one of the quick suggestions below!`;
}
