"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ArtistForm {
  name: string;
  stageName: string;
  genres: string;
  careerYears: number;
  location: string;
  bio: string;
  profileImage: string;
  rating: number;
  basePrice: number;
  isActive: boolean;
}

const initialForm: ArtistForm = {
  name: "",
  stageName: "",
  genres: "",
  careerYears: 0,
  location: "",
  bio: "",
  profileImage: "",
  rating: 0,
  basePrice: 0,
  isActive: true,
};

function ArtistFormPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEdit = !!editId;

  const [form, setForm] = useState<ArtistForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editId) {
      fetch(`/api/admin/artists/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            setForm({
              name: data.name,
              stageName: data.stageName,
              genres: data.genres,
              careerYears: data.careerYears,
              location: data.location,
              bio: data.bio,
              profileImage: data.profileImage || "",
              rating: data.rating,
              basePrice: data.basePrice,
              isActive: data.isActive,
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
        ? `/api/admin/artists/${editId}`
        : "/api/admin/artists";
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

      router.push("/admin/artists");
    } catch {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">
        {isEdit ? "아티스트 수정" : "아티스트 추가"}
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
              <label className="block text-sm font-medium text-gray-300 mb-1">본명</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">활동명</label>
              <input
                name="stageName"
                required
                value={form.stageName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">장르 (JSON 배열)</label>
              <input
                name="genres"
                required
                value={form.genres}
                onChange={handleChange}
                placeholder='["힙합", "EDM"]'
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">경력 (년)</label>
              <input
                name="careerYears"
                type="number"
                required
                min={0}
                value={form.careerYears}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">지역</label>
            <input
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">소개</label>
            <textarea
              name="bio"
              required
              rows={3}
              value={form.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">프로필 이미지 URL</label>
            <input
              name="profileImage"
              value={form.profileImage}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">평점</label>
              <input
                name="rating"
                type="number"
                step={0.1}
                min={0}
                max={5}
                value={form.rating}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">기본 가격 (원)</label>
              <input
                name="basePrice"
                type="number"
                required
                min={0}
                value={form.basePrice}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:outline-none focus:border-[#ADFF2F] transition text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              name="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="w-4 h-4 accent-[#ADFF2F]"
            />
            <label className="text-sm text-gray-300">활성 상태</label>
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
              onClick={() => router.push("/admin/artists")}
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

export default function ArtistFormPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">로딩중...</div>}>
      <ArtistFormPageContent />
    </Suspense>
  );
}
