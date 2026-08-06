"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tenant/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
      <span>Redirecting to Tenant Portal...</span>
    </div>
  );
}
