"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/tenant/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-bold text-sm">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Redirecting to Tenant Portal...</span>
      </div>
    </div>
  );
}
