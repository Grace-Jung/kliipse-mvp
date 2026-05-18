"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  { value: "NEW", label: "신규", style: "bg-green-500/10 text-green-400 border-green-500/30" },
  { value: "CONTACTED", label: "연락완료", style: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { value: "QUOTED", label: "견적전달", style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30" },
  { value: "CONFIRMED", label: "확정", style: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { value: "CANCELLED", label: "취소", style: "bg-red-500/10 text-red-400 border-red-500/30" },
];

export function StatusUpdater({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleChange(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  const current = statuses.find((s) => s.value === status);

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={loading}
      className={`text-xs font-medium rounded-full px-2 py-1 border cursor-pointer focus:outline-none ${
        current?.style || "bg-gray-500/10 text-gray-400 border-gray-500/30"
      } bg-transparent`}
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value} className="bg-[#1a1a1a] text-white">
          {s.label}
        </option>
      ))}
    </select>
  );
}
