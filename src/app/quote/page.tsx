"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Music, Speaker, Wrench, CheckCircle, ArrowLeft, ArrowRight, Loader2, CreditCard } from "lucide-react";
import { getUserFromClientCookie } from "@/lib/auth";
import { quoteRequestSchema, type QuoteRequestInput } from "@/lib/validations";

/* ────────────────────────── Types ────────────────────────────────── */

type ServiceType = "DJ_BOOKING" | "EQUIPMENT_RENTAL" | "SOUND_INSTALLATION";

interface FieldErrors {
  [key: string]: string;
}

/* ────────────────────── Service Card Data ────────────────────────── */

const serviceOptions = [
  {
    type: "DJ_BOOKING" as ServiceType,
    icon: Music,
    title: "DJ 섭외",
    description: "파티, 웨딩, 기업 행사 등 공간과 무드에 맞는 프로페셔널 DJ를 매칭해 드립니다.",
  },
  {
    type: "EQUIPMENT_RENTAL" as ServiceType,
    icon: Speaker,
    title: "장비 렌탈",
    description: "스피커, DJ 세트, 조명 등 행사에 필요한 모든 음향 장비를 합리적인 가격에 렌탈하세요.",
  },
  {
    type: "SOUND_INSTALLATION" as ServiceType,
    icon: Wrench,
    title: "음향 시공",
    description: "카페, 라운지, 클럽 등 공간 특성에 맞는 맞춤 음향 시스템을 설계하고 시공합니다.",
  },
];

const eventTypes = ["기업 행사", "웨딩", "파티", "페스티벌", "클럽", "기타"] as const;
const budgetRanges = ["50만원 미만", "50-100만원", "100-200만원", "200-500만원", "500만원 이상"] as const;

const stepLabels = ["서비스 선택", "행사 정보", "연락처", "완료"];

/* ────────────────────── Step Indicator ───────────────────────────── */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-12 flex items-center justify-center gap-2">
      {stepLabels.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={`hidden h-px w-8 sm:block ${
                  isCompleted ? "bg-[#ADFF2F]" : "bg-[#333]"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-[#ADFF2F] text-[#0a0a0a]"
                    : isCompleted
                      ? "bg-[#ADFF2F]/20 text-[#ADFF2F]"
                      : "bg-[#1a1a1a] text-[#555]"
                }`}
              >
                {isCompleted ? <CheckCircle className="size-4" /> : stepNum}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  isActive ? "font-semibold text-[#ADFF2F]" : "text-[#555]"
                }`}
              >
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────── Main Page Component ─────────────────────── */

function QuotePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

  // Form state
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventType, setEventType] = useState("");
  const [budget, setBudget] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Auto-fill from logged-in user
  useEffect(() => {
    const authUser = getUserFromClientCookie();
    if (authUser) {
      setCustomerName(authUser.name);
      setEmail(authUser.email);
      setUserId(authUser.id);
      // Phone is not stored in cookie, but user can fill it manually
    }
  }, []);

  // Pre-select service type from URL params
  useEffect(() => {
    const service = searchParams.get("service");
    const artistId = searchParams.get("artistId");
    const equipmentId = searchParams.get("equipmentId");

    if (service && ["DJ_BOOKING", "EQUIPMENT_RENTAL", "SOUND_INSTALLATION"].includes(service)) {
      setServiceType(service as ServiceType);
      setStep(2);
    } else if (artistId) {
      setServiceType("DJ_BOOKING");
      setStep(2);
    } else if (equipmentId) {
      setServiceType("EQUIPMENT_RENTAL");
      setStep(2);
    }
  }, [searchParams]);

  /* ── Validation helpers ── */

  function validateStep(stepNumber: number): boolean {
    const newErrors: FieldErrors = {};

    if (stepNumber === 1) {
      if (!serviceType) {
        newErrors.serviceType = "서비스 유형을 선택해 주세요.";
      }
    }

    if (stepNumber === 2) {
      if (!eventDate) newErrors.eventDate = "행사 날짜를 입력해 주세요.";
      if (!eventLocation) newErrors.eventLocation = "행사 장소를 입력해 주세요.";
      if (!eventType) newErrors.eventType = "행사 유형을 선택해 주세요.";
      if (!budget) newErrors.budget = "예산 범위를 선택해 주세요.";
    }

    if (stepNumber === 3) {
      if (!customerName) newErrors.customerName = "이름을 입력해 주세요.";
      if (!phone) newErrors.phone = "연락처를 입력해 주세요.";
      else if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test(phone)) {
        newErrors.phone = "올바른 휴대폰 번호를 입력해 주세요.";
      }
      if (!email) newErrors.email = "이메일을 입력해 주세요.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = "올바른 이메일 주소를 입력해 주세요.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setErrors({});
    setStep((prev) => prev - 1);
  }

  /* ── Submit ── */

  async function handleSubmit() {
    if (!validateStep(3)) return;

    const formData: QuoteRequestInput = {
      serviceType: serviceType as ServiceType,
      eventDate,
      eventLocation,
      eventType: eventType as QuoteRequestInput["eventType"],
      budget: budget as QuoteRequestInput["budget"],
      customerName,
      phone,
      email,
      message: message || undefined,
    };

    // Full Zod validation
    const result = quoteRequestSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: userId || undefined }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const serverErrors: FieldErrors = {};
        if (json.errors) {
          json.errors.forEach((err: { field: string; message: string }) => {
            serverErrors[err.field] = err.message;
          });
        } else {
          serverErrors.server = "요청 처리 중 오류가 발생했습니다.";
        }
        setErrors(serverErrors);
        return;
      }

      setCreatedRequestId(json.id);
      setStep(4);
    } catch {
      setErrors({ server: "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." });
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Shared input styles ── */

  const inputBase =
    "w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white placeholder-[#555] outline-none transition-colors focus:border-[#ADFF2F] focus:ring-1 focus:ring-[#ADFF2F]/30";

  const selectBase =
    "w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white outline-none transition-colors focus:border-[#ADFF2F] focus:ring-1 focus:ring-[#ADFF2F]/30";

  function ErrorMsg({ field }: { field: string }) {
    if (!errors[field]) return null;
    return <p className="mt-1.5 text-sm text-red-400">{errors[field]}</p>;
  }

  /* ────────────────── Step 1: 서비스 선택 ────────────────────────── */

  function renderStep1() {
    return (
      <div>
        <h2 className="mb-2 text-2xl font-bold">서비스 선택</h2>
        <p className="mb-8 text-[#888]">원하시는 서비스를 선택해 주세요.</p>

        <div className="grid gap-4 sm:grid-cols-3">
          {serviceOptions.map((option) => {
            const isSelected = serviceType === option.type;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => {
                  setServiceType(option.type);
                  setErrors({});
                }}
                className={`group rounded-2xl border-2 p-6 text-left transition-all ${
                  isSelected
                    ? "border-[#ADFF2F] bg-[#ADFF2F]/5 shadow-[0_0_20px_rgba(173,255,47,0.1)]"
                    : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#ADFF2F]/30 hover:bg-[#1a1a1a]/80"
                }`}
              >
                <div
                  className={`mb-4 flex size-12 items-center justify-center rounded-xl transition-colors ${
                    isSelected
                      ? "bg-[#ADFF2F]/20 text-[#ADFF2F]"
                      : "bg-[#ADFF2F]/10 text-[#ADFF2F]/60 group-hover:text-[#ADFF2F]"
                  }`}
                >
                  <option.icon className="size-6" />
                </div>
                <h3
                  className={`mb-2 text-lg font-bold transition-colors ${
                    isSelected ? "text-[#ADFF2F]" : "text-white"
                  }`}
                >
                  {option.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#888]">{option.description}</p>
              </button>
            );
          })}
        </div>
        <ErrorMsg field="serviceType" />
      </div>
    );
  }

  /* ────────────────── Step 2: 행사 정보 입력 ─────────────────────── */

  function renderStep2() {
    return (
      <div>
        <h2 className="mb-2 text-2xl font-bold">행사 정보 입력</h2>
        <p className="mb-8 text-[#888]">행사에 대한 기본 정보를 입력해 주세요.</p>

        <div className="space-y-6">
          {/* 행사 날짜 */}
          <div>
            <label htmlFor="eventDate" className="mb-2 block text-sm font-medium text-[#ccc]">
              행사 날짜
            </label>
            <input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={inputBase}
            />
            <ErrorMsg field="eventDate" />
          </div>

          {/* 행사 장소 */}
          <div>
            <label htmlFor="eventLocation" className="mb-2 block text-sm font-medium text-[#ccc]">
              행사 장소
            </label>
            <input
              id="eventLocation"
              type="text"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              placeholder="예: 서울 강남구 OO호텔 그랜드볼룸"
              className={inputBase}
            />
            <ErrorMsg field="eventLocation" />
          </div>

          {/* 행사 유형 */}
          <div>
            <label htmlFor="eventType" className="mb-2 block text-sm font-medium text-[#ccc]">
              행사 유형
            </label>
            <select
              id="eventType"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className={selectBase}
            >
              <option value="" disabled>
                행사 유형을 선택해 주세요
              </option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ErrorMsg field="eventType" />
          </div>

          {/* 예산 */}
          <div>
            <label htmlFor="budget" className="mb-2 block text-sm font-medium text-[#ccc]">
              예산 범위
            </label>
            <select
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={selectBase}
            >
              <option value="" disabled>
                예산 범위를 선택해 주세요
              </option>
              {budgetRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <ErrorMsg field="budget" />
          </div>
        </div>
      </div>
    );
  }

  /* ────────────────── Step 3: 연락처 & 상세 요청 ────────────────── */

  function renderStep3() {
    return (
      <div>
        <h2 className="mb-2 text-2xl font-bold">연락처 & 상세 요청</h2>
        <p className="mb-8 text-[#888]">연락받으실 정보와 추가 요청사항을 입력해 주세요.</p>

        <div className="space-y-6">
          {/* 이름 */}
          <div>
            <label htmlFor="customerName" className="mb-2 block text-sm font-medium text-[#ccc]">
              이름
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="홍길동"
              className={inputBase}
            />
            <ErrorMsg field="customerName" />
          </div>

          {/* 연락처 */}
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#ccc]">
              연락처
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="010-1234-5678"
              className={inputBase}
            />
            <ErrorMsg field="phone" />
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#ccc]">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={inputBase}
            />
            <ErrorMsg field="email" />
          </div>

          {/* 상세 요청 */}
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#ccc]">
              상세 요청사항 <span className="text-[#555]">(선택)</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="추가로 전달하고 싶은 내용이 있으면 자유롭게 작성해 주세요."
              className={`${inputBase} resize-none`}
            />
            <ErrorMsg field="message" />
          </div>
        </div>

        {errors.server && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {errors.server}
          </div>
        )}
      </div>
    );
  }

  /* ────────────────── Step 4: 완료 ──────────────────────────────── */

  function renderStep4() {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#ADFF2F]/10">
          <CheckCircle className="size-10 text-[#ADFF2F]" />
        </div>
        <h2 className="mb-3 text-2xl font-bold">견적 요청이 완료되었습니다!</h2>
        <p className="mb-2 text-[#888]">
          입력해 주신 연락처로 빠른 시일 내에 연락드리겠습니다.
        </p>
        <p className="mb-10 text-sm text-[#555]">
          보통 영업일 기준 1~2일 이내에 답변을 드립니다.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {createdRequestId && (
            <button
              type="button"
              onClick={() => router.push(`/payment/${createdRequestId}`)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-8 py-3.5 font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_30px_rgba(173,255,47,0.3)]"
            >
              <CreditCard className="size-4" />
              결제하기
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] px-8 py-3.5 font-medium text-[#ccc] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
          >
            <ArrowLeft className="size-4" />
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ────────────────── Render ─────────────────────────────────────── */

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            <span className="text-[#ADFF2F]">견적</span> 요청
          </h1>
          <p className="text-[#888]">
            간단한 정보를 입력하시면 맞춤 견적을 보내드립니다.
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* Step Content */}
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#111] p-6 sm:p-10">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="mt-10 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] px-6 py-3 font-medium text-[#ccc] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
                >
                  <ArrowLeft className="size-4" />
                  이전
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-6 py-3 font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_20px_rgba(173,255,47,0.2)]"
                >
                  다음
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-8 py-3 font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_20px_rgba(173,255,47,0.2)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      제출 중...
                    </>
                  ) : (
                    "견적 요청하기"
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">로딩중...</div>}>
      <QuotePageContent />
    </Suspense>
  );
}
