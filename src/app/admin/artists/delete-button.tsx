"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteButton({ id, type }: { id: string; type: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${type}/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("삭제에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400 hover:text-red-300 transition disabled:opacity-50"
    >
      {loading ? "삭제중..." : "삭제"}
    </button>
  );
}
