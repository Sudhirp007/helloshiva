"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContentIntelligenceIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/content-intelligence/clusters");
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-slate-500 text-sm">
      Loading Content Intelligence Engine...
    </div>
  );
}
