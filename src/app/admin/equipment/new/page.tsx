"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface EquipmentForm {
  name: string;
  category: string;
  description: string;
  image: string;
  rentalPrice: number;
  specs: string;
  isAvailable: boolean;
}

const initialForm: EquipmentForm = {
  name: "",
  category: "스피커",
  description: "",
  image: "",
  rentalPrice: 0,
  specs: "",
  isAvailable: true,
};

const categories = ["스피커", "DJ 세트", "조명", "기타"];

function EquipmentFormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [form, setForm] = useState<EquipmentForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editId) {
      fetch(`/api/admin/equipment/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setForm({
              name: data.name,
              category: data.category,
              description: data.description,
              image: data.image || "",
              rentalPrice: data.rentalPrice,
              specs: data.specs,
              isAvailable: data.isAvailable,
            });
          }
        });
    }
  }, [editId]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/equipment/${editId}`
        : "/api/admin/equipment";
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

      router.push("/admin/equipment");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        {isEdit ? "장비 수정" : "장비 추가"}
      </h1>

      <div className="max-w-2xl bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">장비명</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">카테고리</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">설명</label>
            <textarea
              name="description"
              required
              rows={3}
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
            <label className="block text-sm font-medium text-gray-300 mb-1">
              대여 가격 (원)
            </label>
            <input
              name="rentalPrice"
              type="number"
              required
              min={0}
              value={form.rentalPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              스펙 (JSON)
            </label>
            <textarea
              name="specs"
              required
              rows={2}
              value={form.specs}
              onChange={handleChange}
              placeholder='{"출력": "500W", "드라이버": "15인치"}'
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isAvailable: e.target.checked }))
              }
              className="w-4 h-4 accent-[#ADFF2F]"
            />
            <label className="text-sm text-gray-300">대여 가능</label>
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
              onClick={() => router.push("/admin/equipment")}
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

export default function EquipmentFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">로딩중...</div>}>
      <EquipmentFormPageContent />
    </Suspense>
  );
}
