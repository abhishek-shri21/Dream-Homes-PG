"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase, hasSupabaseConfig } from "../lib/supabaseClient";
import { demoTenants } from "../lib/db";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "owner" ? "owner" : "tenant";

  const [role, setRole] = useState(initialRole);

  // Tenant state
  const [tenantAuthMethod, setTenantAuthMethod] = useState("email");
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

  // Quick Demo Autofill for Tenant
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

  // Quick Demo Autofill for Owner
  const handleQuickOwnerSelect = () => {
    setRole("owner");
    setOwnerEmail("owner@dreamhomespg.com");
    setOwnerPassword("admin123");
    setError("");
  };

  // Handle Smart Tenant Submit
  const handleTenantSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

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
          if (typeof window !== "undefined") {
            localStorage.setItem("pg_tenant_user", JSON.stringify(tenantProfile));
          }
          setSuccessMsg("Login successful! Redirecting to Tenant Portal...");
          setTimeout(() => router.push("/tenant/dashboard"), 400);
          return;
        }
      }

      await new Promise((r) => setTimeout(r, 300));

      let matchedTenant = null;
      if (tenantAuthMethod === "email") {
        matchedTenant = (demoTenants || []).find(
          (s) => s.email.toLowerCase() === tenantEmail.trim().toLowerCase()
        );
      } else {
        const cleanInputPhone = tenantPhone.replace(/\s+/g, "");
        matchedTenant = (demoTenants || []).find((s) =>
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

        if (typeof window !== "undefined") {
          localStorage.setItem("pg_tenant_user", JSON.stringify(profile));
        }
        setSuccessMsg("Welcome back! Redirecting to Tenant Dashboard...");
        setTimeout(() => router.push("/tenant/dashboard"), 400);
      } else {
        setError("Invalid credentials. Please use demo tenant accounts below.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Owner Submit
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
          if (typeof window !== "undefined") {
            localStorage.setItem("pg_owner_logged_in", "true");
            localStorage.setItem("pg_owner_email", ownerEmail);
          }
          setSuccessMsg("Owner verified! Redirecting to Owner Dashboard...");
          setTimeout(() => router.push("/admin/dashboard"), 400);
          return;
        }
      }

      await new Promise((r) => setTimeout(r, 300));

      if (ownerEmail.toLowerCase().includes("owner") && ownerPassword === "admin123") {
        if (typeof window !== "undefined") {
          localStorage.setItem("pg_owner_logged_in", "true");
          localStorage.setItem("pg_owner_email", ownerEmail);
        }
        setSuccessMsg("Welcome Owner! Redirecting to Management Dashboard...");
        setTimeout(() => router.push("/admin/dashboard"), 400);
      } else {
        setError("Invalid Owner credentials. Demo: owner@dreamhomespg.com / admin123");
      }
    } catch (err) {
      console.error(err);
      setError("Authentication error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between p-4 py-10 relative overflow-hidden">
      {/* Background Decor Shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full mx-auto relative z-10 my-auto space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-display font-extrabold text-2xl">D</span>
            </div>
            <div className="text-left">
              <span className="text-2xl font-display font-extrabold text-primary block leading-none">
                Dream Homes
              </span>
              <span className="text-[11px] font-bold tracking-widest text-secondary uppercase">
                PG Jodhpur Portal
              </span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-primary tracking-tight">
            Welcome Back
          </h1>
          <p className="text-onSurface-variant text-xs sm:text-sm mt-1">
            Sign in to access your Tenant Portal or Owner Dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="bg-surface-container-high/60 p-1.5 rounded-full border border-outline-variant/40 flex gap-1 shadow-sm">
          <button
            type="button"
            onClick={() => {
              setRole("tenant");
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-display font-bold transition-all flex items-center justify-center gap-2 ${
              role === "tenant"
                ? "bg-primary text-white shadow-md shadow-primary/25"
                : "text-onSurface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span className="text-sm">🏠</span> PG Tenant Login
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("owner");
              setError("");
              setSuccessMsg("");
            }}
            className={`flex-1 py-3 px-4 rounded-full text-xs font-display font-bold transition-all flex items-center justify-center gap-2 ${
              role === "owner"
                ? "bg-secondary-container text-white shadow-md shadow-secondary-container/25"
                : "text-onSurface-variant hover:text-primary hover:bg-surface-container"
            }`}
          >
            <span className="text-sm">🏢</span> Owner / Admin
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[24px] border border-outline-variant/40 ambient-shadow p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-error/10 border border-error/30 text-error rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span className="text-base">⚠️</span>
              <div>{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 rounded-2xl p-3.5 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span className="text-base">✅</span>
              <div>{successMsg}</div>
            </div>
          )}

          {/* TENANT LOGIN FORM */}
          {role === "tenant" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-primary">Tenant Sign In</h2>
                  <p className="text-[11px] text-onSurface-variant">Access room info, WiFi & maintenance complaints</p>
                </div>

                <div className="flex bg-surface-container p-1 rounded-xl border border-outline-variant/40 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setTenantAuthMethod("email")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      tenantAuthMethod === "email"
                        ? "bg-primary text-white"
                        : "text-onSurface-variant"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setTenantAuthMethod("phone")}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                      tenantAuthMethod === "phone"
                        ? "bg-primary text-white"
                        : "text-onSurface-variant"
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
                      <label className="block text-[11px] font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                        Registered Tenant Email
                      </label>
                      <input
                        type="email"
                        required
                        value={tenantEmail}
                        onChange={(e) => setTenantEmail(e.target.value)}
                        placeholder="e.g. arjun@tenant.com"
                        className="w-full h-12 bg-surface border border-outline-variant/60 rounded-xl px-4 text-sm text-primary font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showTenantPassword ? "text" : "password"}
                          required
                          value={tenantPassword}
                          onChange={(e) => setTenantPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-12 bg-surface border border-outline-variant/60 rounded-xl px-4 pr-12 text-sm text-primary font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTenantPassword(!showTenantPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-primary"
                        >
                          {showTenantPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                        Registered Mobile Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={tenantPhone}
                        onChange={(e) => setTenantPhone(e.target.value)}
                        placeholder="+91 9988776655"
                        className="w-full h-12 bg-surface border border-outline-variant/60 rounded-xl px-4 text-sm text-primary font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                        Access PIN / OTP
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={6}
                        value={tenantPin}
                        onChange={(e) => setTenantPin(e.target.value)}
                        placeholder="Default PIN: 1234"
                        className="w-full h-12 bg-surface border border-outline-variant/60 rounded-xl px-4 text-sm text-primary font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-primary hover:bg-primary-container text-white font-display font-bold text-sm rounded-xl shadow-lg shadow-primary/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
              <div className="pt-4 border-t border-surface-container">
                <p className="text-[11px] font-bold text-onSurface-variant uppercase tracking-wider mb-2">
                  ⚡ Quick Demo Tenant Accounts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(demoTenants || []).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleQuickTenantSelect(st)}
                      className="text-left bg-surface-container/60 hover:bg-primary/5 border border-outline-variant/40 hover:border-primary/40 p-2.5 rounded-xl transition-all group"
                    >
                      <div className="text-xs font-bold text-primary group-hover:text-primary-container">
                        🏠 {st.name}
                      </div>
                      <div className="text-[10px] text-onSurface-variant">
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
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-display font-bold text-primary">Owner / Admin Sign In</h2>
                <p className="text-[11px] text-onSurface-variant">Manage PG properties, rooms & tenant complaints</p>
              </div>

              <form onSubmit={handleOwnerSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                    Owner Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="owner@dreamhomespg.com"
                    className="w-full h-12 bg-surface border border-outline-variant/60 rounded-xl px-4 text-sm text-primary font-medium focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-onSurface-variant mb-1.5 uppercase tracking-wider">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOwnerPassword ? "text" : "password"}
                      required
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-12 bg-surface border border-outline-variant/60 rounded-xl px-4 pr-12 text-sm text-primary font-medium focus:outline-none focus:border-secondary-container focus:ring-2 focus:ring-secondary-container/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOwnerPassword(!showOwnerPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary-container"
                    >
                      {showOwnerPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-secondary-container hover:bg-secondary text-white font-display font-bold text-sm rounded-xl shadow-lg shadow-secondary-container/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
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
              <div className="pt-4 border-t border-surface-container">
                <p className="text-[11px] font-bold text-onSurface-variant uppercase tracking-wider mb-2">
                  🔑 Quick Demo Owner Account:
                </p>
                <button
                  type="button"
                  onClick={handleQuickOwnerSelect}
                  className="w-full text-left bg-surface-container/60 hover:bg-secondary/5 border border-outline-variant/40 hover:border-secondary/40 p-3 rounded-xl transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-primary group-hover:text-secondary">
                      🏢 Owner / Property Manager
                    </div>
                    <div className="text-[10px] text-onSurface-variant">
                      owner@dreamhomespg.com / admin123
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-white bg-secondary-container px-2.5 py-1 rounded-md">
                    Autofill
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="text-center pt-2">
          <Link
            href="/pgs"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            Browse All PG Properties Without Logging In →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-bold text-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading Login Portal...</span>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
