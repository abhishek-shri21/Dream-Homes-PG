"use client";

import { Suspense } from "react";
import LoginForm from "../../components/LoginForm";

export default function LoginPage() {
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
      <LoginForm />
    </Suspense>
  );
}
