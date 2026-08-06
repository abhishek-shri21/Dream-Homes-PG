"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, hasSupabaseConfig } from "../../lib/supabaseClient";
import { demoTenants } from "../../lib/db";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "owner" ? "owner" : "tenant";

  const [role, setRole] = useState(initialRole); // 'tenant' | 'owner'

  // Tenant state
  const [tenantAuthMethod, setTenantAuthMethod] = useState("email"); // 'email' | 'phone'
  const [tenantEmail, setTenantEmail] = useState("");
  const [tenantPassword, setTenantPassword] = useState("");
  const [tenantPhone, setTenantPhone] = useState("");
  const [tenantPin, setTenantPin] = useState("");
  const [showTenantPassword, setShowTenantPassword] = useState(false);

  // Owner state
  const [ownerEmail, setOwnerEmail] = useState("owner@dreamhomespg.com");
  const [ownerPassword, setOwnerPassword] = useState("admin123");
  const [showOwnerPassword, setShowOwnerPassword] = useState(false);

  // General state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "owner" || roleParam === "tenant" || roleParam === "student") {
      setRole(roleParam === "owner" ? "owner" : "tenant");
    }
  }, [searchParams]);

  // Autofill Demo Credentials for Tenant
  const handleQuickTenantSelect = (tenant) => {
    setRole("tenant");
    if (tenantAuthMethod === "email") {
      setTenantEmail(tenant.email);
      setTenantPassword("tenant123");
    } else {
      setTenantPhone(tenant.phone);
      setTenantPin("1234");
    }
    setError("");
  };

  // Autofill Demo Credentials for Owner
  const handleQuickOwnerSelect = () => {
    setRole("owner");
    setOwnerEmail("owner@dreamhomespg.com");
    setOwnerPassword("admin123");
    setError("");
  };

  // Handle Smart Tenant Login Submit
  const handleTenantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    // Auto-detect if owner email entered in tenant tab
    if (tenantEmail.toLowerCase().includes("owner")) {
      setRole("owner");
      setOwnerEmail(tenantEmail);
      setOwnerPassword(tenantPassword || "admin123");
      setLoading(false);
      return;
    }

    try {
      if (hasSupabaseConfig && tenantAuthMethod === "email" && tenantEmail && tenantPassword) {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: tenantEmail,
          password: tenantPassword,
        });

        if (!authErr && data?.user) {
          const tenantProfile = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || tenantEmail.split("@")[0],
            phone: data.user.user_metadata?.phone || "+91 9988776655",
            room_number: data.user.user_metadata?.room_number || "204",
            pg_name: data.user.user_metadata?.pg_name || "Dream Homes PG - Civil Lines",
            role: "tenant",
          };
          localStorage.setItem("pg_tenant_user", JSON.stringify(tenantProfile));
          setSuccessMsg("Login successful! Redirecting to Tenant Portal...");
          setTimeout(() => router.push("/tenant/dashboard"), 600);
          return;
        }
      }

      // Demo fallback check
      await new Promise((r) => setTimeout(r, 600));

      let matchedTenant = null;
      if (tenantAuthMethod === "email") {
        matchedTenant = demoTenants.find(
          (s) => s.email.toLowerCase() === tenantEmail.trim().toLowerCase()
        );
      } else {
        const cleanInputPhone = tenantPhone.replace(/\s+/g, "");
        matchedTenant = demoTenants.find((s) =>
          s.phone.replace(/\s+/g, "").includes(cleanInputPhone)
        );
      }

      if (
        matchedTenant ||
        (tenantEmail.includes("@") && (tenantPassword === "tenant123" || tenantPassword === "student123")) ||
        (tenantPhone.length >= 8 && tenantPin === "1234")
      ) {
        const profile = matchedTenant || {
          id: "TEN-DEMO",
          email: tenantEmail || "arjun@tenant.com",
          phone: tenantPhone || "+91 9988776655",
          name: "Arjun Mehra",
          room_number: "204",
          pg_name: "Dream Homes PG - Civil Lines",
          role: "tenant",
        };

        localStorage.setItem("pg_tenant_user", JSON.stringify(profile));
        setSuccessMsg("Welcome back! Redirecting to Tenant Dashboard...");
        setTimeout(() => router.push("/tenant/dashboard"), 600);
      } else {
        setError("Invalid credentials. Try using demo tenant buttons below.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Owner Login Submit
  const handleOwnerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (hasSupabaseConfig && ownerEmail && ownerPassword) {
        const { data, error: authErr } = await supabase.auth.signInWithPassword({
          email: ownerEmail,
          password: ownerPassword,
        });

        if (!authErr && data?.user) {
          localStorage.setItem("pg_owner_logged_in", "true");
          localStorage.setItem("pg_owner_email", ownerEmail);
          setSuccessMsg("Owner authentication verified! Redirecting to Owner Dashboard...");
          setTimeout(() => router.push("/admin/dashboard"), 600);
          return;
        }
      }

      // Demo fallback check
      await new Promise((r) => setTimeout(r, 600));

      if (ownerEmail.toLowerCase().includes("owner") && ownerPassword === "admin123") {
        localStorage.setItem("pg_owner_logged_in", "true");
        localStorage.setItem("pg_owner_email", ownerEmail);
        setSuccessMsg("Welcome Owner! Redirecting to Owner Management Dashboard...");
        setTimeout(() => router.push("/admin/dashboard"), 600);
      } else {
        setError("Invalid Owner credentials. Use demo: owner@dreamhomespg.com / admin123");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header & Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-400 p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <span className="text-white font-extrabold text-2xl tracking-tighter">D</span>
              </div>
            </div>
            <div className="text-left">
              <span className="text-2xl font-bold tracking-tight text-white block">
                Dream Homes
              </span>
              <span className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                PG Jodhpur Portal
              </span>
            </div>
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Portal Access
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to access your Tenant or Owner Dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-slate-800/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-700/60 flex gap-1 mb-6 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setRole("tenant");
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "tenant"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            <span className="text-base">🏠</span> PG Tenant
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("owner");
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              role === "owner"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-900/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
            }`}
          >
            <span className="text-base">🏢</span> Owner / Admin
          </button>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-3.5 text-sm mb-6 flex items-start gap-2.5 animate-fadeIn">
              <span className="text-base mt-0.5">⚠️</span>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 text-sm mb-6 flex items-center gap-2.5 animate-fadeIn">
              <span className="text-base">✅</span>
              <div>{successMsg}</div>
            </div>
          )}

          {/* TENANT LOGIN FORM */}
          {role === "tenant" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white">Tenant Login</h2>
                  <p className="text-xs text-slate-400">Access complaints, rent status & PG details</p>
                </div>

                {/* Sub auth method toggle */}
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setTenantAuthMethod("email")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      tenantAuthMethod === "email"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenantAuthMethod("phone")}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      tenantAuthMethod === "phone"
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Phone
                  </button>
                </div>
              </div>

              <form onSubmit={handleTenantSubmit} className="space-y-4">
                {tenantAuthMethod === "email" ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Tenant Registered Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={tenantEmail}
                          onChange={(e) => setTenantEmail(e.target.value)}
                          placeholder="e.g. arjun@tenant.com"
                          className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showTenantPassword ? "text" : "password"}
                          required
                          value={tenantPassword}
                          onChange={(e) => setTenantPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTenantPassword(!showTenantPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
                        >
                          {showTenantPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Registered Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        placeholder="+91 9988776655"
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                        Access PIN / OTP
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={6}
                        value={tenantPin}
                        onChange={(e) => setTenantPin(e.target.value)}
                        placeholder="Default PIN: 1234"
                        className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>Login to Tenant Dashboard →</>
                  )}
                </button>
              </form>

              {/* Demo Tenant Quick Fill */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  ⚡ Quick Demo Tenant Accounts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {demoTenants.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleQuickTenantSelect(st)}
                      className="text-left bg-slate-800/60 hover:bg-purple-950/50 border border-slate-700/80 hover:border-purple-500/50 p-2.5 rounded-xl transition-all group"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-purple-300">
                        🏠 {st.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {st.pg_name.replace("Dream Homes PG - ", "")} • Room {st.room_number}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OWNER LOGIN FORM */}
          {role === "owner" && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-bold text-white">Owner / Admin Sign In</h2>
                <p className="text-xs text-slate-400">Manage PG properties, rooms, complaints & enquiries</p>
              </div>

              <form onSubmit={handleOwnerSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Owner Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@dreamhomespg.com"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOwnerPassword ? "text" : "password"}
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs font-semibold"
                    >
                      {showOwnerPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-amber-900/30 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>Access Owner Dashboard →</>
                  )}
                </button>
              </form>

              {/* Demo Owner Quick Fill */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  🔑 Quick Demo Owner Credentials:
                </p>
                <button
                  type="button"
                  onClick={handleQuickOwnerSelect}
                  className="w-full text-left bg-slate-800/60 hover:bg-amber-950/50 border border-slate-700/80 hover:border-amber-500/50 p-3 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-300">
                      🏢 Owner Account
                    </div>
                    <div className="text-[11px] text-slate-400">
                      owner@dreamhomespg.com / admin123
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
                    Autofill
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-slate-400 text-sm hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Return to Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          Loading portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
