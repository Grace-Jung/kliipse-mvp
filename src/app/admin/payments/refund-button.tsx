"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefundButton({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleRefund() {
    if (!confirm("정말 환불 처리하시겠습니까?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REFUNDED" }),
      });

      if (!res.ok) {
        alert("환불 처리에 실패했습니다.");
        return;
      }

      router.refresh();
    } catch {
      alert("환불 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRefund}
      disabled={loading}
      className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition disabled:opacity-50"
    >
      {loading ? "처리중..." : "환불"}
    </button>
  );
}
