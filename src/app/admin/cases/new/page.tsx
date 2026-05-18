"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CaseForm {
  title: string;
  serviceType: string;
  description: string;
  image: string;
  resultSummary: string;
}

const initialForm: CaseForm = {
  title: "",
  serviceType: "기업 행사",
  description: "",
  image: "",
  resultSummary: "",
};

const serviceTypes = ["기업 행사", "음향 시공", "페스티벌"];

function CaseFormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [form, setForm] = useState<CaseForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editId) {
      fetch(`/api/admin/cases/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setForm({
              title: data.title,
              serviceType: data.serviceType,
              description: data.description,
              image: data.image || "",
              resultSummary: data.resultSummary,
            });
          }
        });
    }
  }, [editId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEdit ? `/api/admin/cases/${editId}` : "/api/admin/cases";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "저장에 실패했습니다.");
        return;
      }

      router.push("/admin/cases");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        {isEdit ? "사례 수정" : "사례 추가"}
      </h1>

      <div className="max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">제목</label>
            <input
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">서비스 유형</label>
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
            >
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">설명</label>
            <textarea
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">이미지 URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">결과 요약</label>
            <textarea
              name="resultSummary"
              required
              rows={3}
              value={form.resultSummary}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#ADFF2F] text-black font-semibold rounded-lg hover:bg-[#9aec20] disabled:opacity-50 transition text-sm"
            >
              {loading ? "저장 중..." : isEdit ? "수정" : "등록"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/cases")}
              className="px-6 py-2 bg-[#2a2a2a] text-gray-300 rounded-lg hover:bg-[#333] transition text-sm"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CaseFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">로딩중...</div>}>
      <CaseFormPageContent />
    </Suspense>
  );
}
