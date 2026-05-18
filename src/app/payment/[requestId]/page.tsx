"use client";

import { useState, useEffect, Suspense, use } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Building2,
  Smartphone,
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  User,
  Music,
  Speaker,
  Wrench,
} from "lucide-react";

/* ────────────────────────── Types ────────────────────────────────── */

type PaymentMethod = "CARD" | "BANK_TRANSFER" | "KAKAO_PAY";

interface ServiceRequest {
  id: string;
  customerName: string;
  serviceType: string;
  eventDate: string;
  eventLocation: string;
  eventType: string;
  budget: string;
  status: string;
}

/* ────────────────────── Helpers ──────────────────────────────────── */

const serviceLabels: Record<string, { label: string; icon: typeof Music }> = {
  DJ_BOOKING: { label: "DJ 섭외", icon: Music },
  EQUIPMENT_RENTAL: { label: "장비 렌탈", icon: Speaker },
  SOUND_INSTALLATION: { label: "음향 시공", icon: Wrench },
};

const budgetToAmount: Record<string, number> = {
  "50만원 미만": 300000,
  "50-100만원": 750000,
  "100-200만원": 1500000,
  "200-500만원": 3500000,
  "500만원 이상": 5000000,
};

const banks = ["국민", "신한", "우리", "하나", "농협"] as const;

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(amount);
}

/* ────────────────────── Payment Method Cards ────────────────────── */

const paymentMethods: { type: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { type: "CARD", label: "신용/체크카드", icon: CreditCard, desc: "VISA, Mastercard, 국내카드" },
  { type: "BANK_TRANSFER", label: "계좌이체", icon: Building2, desc: "실시간 계좌이체" },
  { type: "KAKAO_PAY", label: "카카오페이", icon: Smartphone, desc: "간편결제" },
];

/* ────────────────────── Main Content ─────────────────────────────── */

function PaymentPageContent({ requestId }: { requestId: string }) {
  const router = useRouter();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Payment form state
  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [amount, setAmount] = useState(0);

  // Card fields
  const [card1, setCard1] = useState("");
  const [card2, setCard2] = useState("");
  const [card3, setCard3] = useState("");
  const [card4, setCard4] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  // Bank transfer fields
  const [bankName, setBankName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  // Submit state
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    async function fetchRequest() {
      try {
        const res = await fetch(`/api/admin/requests/${requestId}`);
        if (!res.ok) throw new Error("요청을 찾을 수 없습니다.");
        const data = await res.json();
        setRequest(data);
        setAmount(budgetToAmount[data.budget] || 500000);
      } catch {
        setError("견적 요청 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    }
    fetchRequest();
  }, [requestId]);

  /* ── Validation ── */

  function validate(): boolean {
    if (amount <= 0) {
      setFormError("결제 금액을 입력해 주세요.");
      return false;
    }

    if (method === "CARD") {
      if (!card1 || !card2 || !card3 || !card4 || card1.length !== 4 || card2.length !== 4 || card3.length !== 4 || card4.length !== 4) {
        setFormError("카드 번호 16자리를 모두 입력해 주세요.");
        return false;
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        setFormError("유효기간을 MM/YY 형식으로 입력해 주세요.");
        return false;
      }
      if (!cvc || cvc.length < 3) {
        setFormError("CVC 3자리를 입력해 주세요.");
        return false;
      }
    }

    if (method === "BANK_TRANSFER") {
      if (!bankName) {
        setFormError("은행을 선택해 주세요.");
        return false;
      }
      if (!accountHolder) {
        setFormError("예금주명을 입력해 주세요.");
        return false;
      }
    }

    setFormError("");
    return true;
  }

  /* ── Submit ── */

  async function handleSubmit() {
    if (!validate()) return;

    setIsProcessing(true);
    setFormError("");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const body: Record<string, unknown> = {
        serviceRequestId: requestId,
        amount,
        method,
      };

      if (method === "CARD") {
        body.cardNumber = `${card1}-${card2}-${card3}-${card4}`;
      }
      if (method === "BANK_TRANSFER") {
        body.bankName = bankName;
      }

      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setFormError(json.error || "결제 처리 중 오류가 발생했습니다.");
        return;
      }

      router.push(`/payment/complete/${json.paymentId}`);
    } catch {
      setFormError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsProcessing(false);
    }
  }

  /* ── Shared styles ── */

  const inputBase =
    "w-full rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white placeholder-[#555] outline-none transition-colors focus:border-[#ADFF2F] focus:ring-1 focus:ring-[#ADFF2F]/30";

  const selectBase =
    "w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-4 py-3 text-white outline-none transition-colors focus:border-[#ADFF2F] focus:ring-1 focus:ring-[#ADFF2F]/30";

  /* ── Card number input helper ── */

  function handleCardInput(
    value: string,
    setter: (v: string) => void,
    nextRef?: HTMLInputElement | null
  ) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setter(digits);
    if (digits.length === 4 && nextRef) {
      nextRef.focus();
    }
  }

  /* ── Loading / Error states ── */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#ADFF2F]" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-red-400">{error || "요청을 찾을 수 없습니다."}</p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] px-6 py-3 text-[#ccc] hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
        >
          <ArrowLeft className="size-4" />
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  const ServiceIcon = serviceLabels[request.serviceType]?.icon || Music;

  /* ── Processing overlay ── */

  if (isProcessing) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="size-20 animate-spin rounded-full border-4 border-[#2a2a2a] border-t-[#ADFF2F]" />
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-white">결제 처리 중...</p>
          <p className="mt-2 text-sm text-[#888]">잠시만 기다려 주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-3xl font-extrabold sm:text-4xl">
            <span className="text-[#ADFF2F]">결제</span>하기
          </h1>
          <p className="text-[#888]">주문 내용을 확인하고 결제를 진행해 주세요.</p>
        </div>

        {/* Order Summary */}
        <div className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#111] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">주문 내역</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#ADFF2F]/10">
                <ServiceIcon className="size-5 text-[#ADFF2F]" />
              </div>
              <div>
                <p className="text-sm text-[#888]">서비스</p>
                <p className="font-medium text-white">
                  {serviceLabels[request.serviceType]?.label || request.serviceType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#ADFF2F]/10">
                <Calendar className="size-5 text-[#ADFF2F]" />
              </div>
              <div>
                <p className="text-sm text-[#888]">행사 날짜</p>
                <p className="font-medium text-white">{request.eventDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#ADFF2F]/10">
                <MapPin className="size-5 text-[#ADFF2F]" />
              </div>
              <div>
                <p className="text-sm text-[#888]">행사 장소</p>
                <p className="font-medium text-white">{request.eventLocation}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#ADFF2F]/10">
                <User className="size-5 text-[#ADFF2F]" />
              </div>
              <div>
                <p className="text-sm text-[#888]">고객명</p>
                <p className="font-medium text-white">{request.customerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Amount */}
        <div className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#111] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">결제 금액</h2>
          <div className="relative">
            <input
              type="text"
              value={formatAmount(amount)}
              onChange={(e) => {
                const num = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                setAmount(isNaN(num) ? 0 : num);
              }}
              className={`${inputBase} pr-8 text-right text-2xl font-bold`}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-medium text-[#888]">
              원
            </span>
          </div>
          <p className="mt-2 text-sm text-[#555]">예산 범위({request.budget})를 기준으로 산정된 금액입니다.</p>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#111] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">결제 수단</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((pm) => {
              const isSelected = method === pm.type;
              return (
                <button
                  key={pm.type}
                  type="button"
                  onClick={() => {
                    setMethod(pm.type);
                    setFormError("");
                  }}
                  className={`group rounded-2xl border-2 p-5 text-left transition-all ${
                    isSelected
                      ? "border-[#ADFF2F] bg-[#ADFF2F]/5 shadow-[0_0_20px_rgba(173,255,47,0.1)]"
                      : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#ADFF2F]/30"
                  }`}
                >
                  <div
                    className={`mb-3 flex size-12 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-[#ADFF2F]/20 text-[#ADFF2F]"
                        : "bg-[#ADFF2F]/10 text-[#ADFF2F]/60 group-hover:text-[#ADFF2F]"
                    }`}
                  >
                    <pm.icon className="size-6" />
                  </div>
                  <p
                    className={`font-bold transition-colors ${
                      isSelected ? "text-[#ADFF2F]" : "text-white"
                    }`}
                  >
                    {pm.label}
                  </p>
                  <p className="mt-1 text-xs text-[#888]">{pm.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Details */}
        <div className="mb-8 rounded-2xl border border-[#2a2a2a] bg-[#111] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">결제 정보 입력</h2>

          {/* Card Input */}
          {method === "CARD" && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#ccc]">카드 번호</label>
                <div className="flex items-center gap-2">
                  <input
                    id="card1"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={card1}
                    onChange={(e) =>
                      handleCardInput(e.target.value, setCard1, document.getElementById("card2") as HTMLInputElement)
                    }
                    placeholder="0000"
                    className={`${inputBase} text-center font-mono text-lg tracking-widest`}
                  />
                  <span className="text-[#555]">-</span>
                  <input
                    id="card2"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={card2}
                    onChange={(e) =>
                      handleCardInput(e.target.value, setCard2, document.getElementById("card3") as HTMLInputElement)
                    }
                    placeholder="0000"
                    className={`${inputBase} text-center font-mono text-lg tracking-widest`}
                  />
                  <span className="text-[#555]">-</span>
                  <input
                    id="card3"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={card3}
                    onChange={(e) =>
                      handleCardInput(e.target.value, setCard3, document.getElementById("card4") as HTMLInputElement)
                    }
                    placeholder="0000"
                    className={`${inputBase} text-center font-mono text-lg tracking-widest`}
                  />
                  <span className="text-[#555]">-</span>
                  <input
                    id="card4"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    value={card4}
                    onChange={(e) => handleCardInput(e.target.value, setCard4)}
                    placeholder="0000"
                    className={`${inputBase} text-center font-mono text-lg tracking-widest`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#ccc]">유효기간</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/[^0-9]/g, "");
                      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4);
                      setExpiry(v);
                    }}
                    placeholder="MM/YY"
                    className={`${inputBase} font-mono text-center tracking-widest`}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#ccc]">CVC</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={3}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    placeholder="000"
                    className={`${inputBase} font-mono text-center tracking-widest`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Input */}
          {method === "BANK_TRANSFER" && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#ccc]">은행 선택</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className={selectBase}
                >
                  <option value="" disabled>
                    은행을 선택해 주세요
                  </option>
                  {banks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}은행
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#ccc]">예금주명</label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  placeholder="홍길동"
                  className={inputBase}
                />
              </div>
            </div>
          )}

          {/* Kakao Pay */}
          {method === "KAKAO_PAY" && (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#FEE500]">
                <span className="text-2xl font-black text-[#391B1B]">K</span>
              </div>
              <p className="text-[#888]">카카오페이로 간편하게 결제합니다.</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {formError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {formError}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a2a2a] px-6 py-3.5 font-medium text-[#ccc] transition-colors hover:border-[#ADFF2F] hover:text-[#ADFF2F]"
          >
            <ArrowLeft className="size-4" />
            뒤로
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-[#ADFF2F] px-8 py-3.5 text-lg font-bold text-[#0a0a0a] transition-all hover:bg-[#c4ff5a] hover:shadow-[0_0_30px_rgba(173,255,47,0.3)]"
          >
            <CreditCard className="size-5" />
            {formatAmount(amount)}원 결제하기
          </button>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────── Page Export ──────────────────────────────── */

export default function PaymentPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const { requestId } = use(params);

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-white">
          <Loader2 className="size-8 animate-spin text-[#ADFF2F]" />
        </div>
      }
    >
      <PaymentPageContent requestId={requestId} />
    </Suspense>
  );
}
