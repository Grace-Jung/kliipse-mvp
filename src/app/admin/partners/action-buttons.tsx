"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PartnerActionButtons({
  applicationId,
  userId,
  stageName,
}: {
  applicationId: string;
  userId: string;
  stageName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState("");

  async function handleAction(action: "APPROVED" | "REJECTED") {
    const label = action === "APPROVED" ? "승인" : "거절";
    if (!confirm(`${stageName}의 파트너 신청을 ${label}하시겠습니까?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/partners/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, adminMemo: memo || undefined, userId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("처리 중 오류가 발생했습니다.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-t border-[#2a2a2a] pt-4 mt-4">
      <div className="mb-3">
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="관리자 메모 (선택)"
          className="w-full rounded-lg border border-[#333] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#555] focus:border-[#ADFF2F] focus:outline-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => handleAction("APPROVED")}
          disabled={loading}
          className="rounded-lg bg-[#ADFF2F] px-6 py-2 text-sm font-bold text-[#0a0a0a] transition hover:bg-[#c4ff5a] disabled:opacity-50"
        >
          승인
        </button>
        <button
          onClick={() => handleAction("REJECTED")}
          disabled={loading}
          className="rounded-lg border border-red-500/50 px-6 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
        >
          거절
        </button>
      </div>
    </div>
  );
}
