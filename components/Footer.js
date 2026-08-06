import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg hero-gradient flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-white font-bold text-lg">Dream Homes PG</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Comfortable, safe, and affordable PG accommodation in Jodhpur. Your home away from home.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-purple-400 transition-colors">Home</Link></li>
            <li><Link href="/pgs" className="hover:text-purple-400 transition-colors">All PGs</Link></li>
            <li><Link href="/complaints" className="hover:text-purple-400 transition-colors">Raise Complaint</Link></li>
            <li><Link href="/track" className="hover:text-purple-400 transition-colors">Track Complaint</Link></li>
            <li><Link href="/availability" className="hover:text-purple-400 transition-colors">Room Availability Alert</Link></li>
          </ul>
        </div>

        {/* PG Locations */}
        <div>
          <h4 className="text-white font-semibold mb-3">Our PGs</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-purple-400 cursor-pointer">Shastri Nagar</li>
            <li className="hover:text-purple-400 cursor-pointer">Residency Road</li>
            <li className="hover:text-purple-400 cursor-pointer">Civil Lines</li>
            <li className="hover:text-purple-400 cursor-pointer">Ratanada</li>
            <li className="hover:text-purple-400 cursor-pointer">Sardarpura</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span>📞</span>
              <a href="tel:+919876543210" className="hover:text-purple-400">+91 98765 43210</a>
            </li>
            <li className="flex items-center gap-2">
              <span>📧</span>
              <a href="mailto:owner@dreamhomespg.com" className="hover:text-purple-400">owner@dreamhomespg.com</a>
            </li>
            <li className="flex items-center gap-2">
              <span>📍</span>
              <span>Jodhpur, Rajasthan</span>
            </li>
            <li className="mt-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center gap-2 transition-colors"
              >
                <span>💬</span> WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Dream Homes PG. All rights reserved. | Jodhpur, Rajasthan
      </div>
    </footer>
  );
}
