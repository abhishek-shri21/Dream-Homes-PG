"use client";

import { Suspense } from "react";
import { LoginFormComponent } from "./login/page";

export default function RootPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface flex items-center justify-center text-primary font-bold">
          Loading portal...
        </div>
      }
    >
      <LoginFormComponent />
    </Suspense>
  );
}
