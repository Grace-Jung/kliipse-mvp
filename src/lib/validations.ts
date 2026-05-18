import { z } from "zod";

export const quoteRequestSchema = z.object({
  serviceType: z.enum(["DJ_BOOKING", "EQUIPMENT_RENTAL", "SOUND_INSTALLATION"], {
    error: "서비스 유형을 선택해 주세요.",
  }),
  eventDate: z
    .string()
    .min(1, "행사 날짜를 입력해 주세요.")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 아닙니다."),
  eventLocation: z
    .string()
    .min(1, "행사 장소를 입력해 주세요.")
    .max(200, "행사 장소는 200자 이내로 입력해 주세요."),
  eventType: z.enum(
    ["기업 행사", "웨딩", "파티", "페스티벌", "클럽", "기타"],
    { error: "행사 유형을 선택해 주세요." },
  ),
  budget: z.enum(
    ["50만원 미만", "50-100만원", "100-200만원", "200-500만원", "500만원 이상"],
    { error: "예산 범위를 선택해 주세요." },
  ),
  customerName: z
    .string()
    .min(1, "이름을 입력해 주세요.")
    .max(50, "이름은 50자 이내로 입력해 주세요."),
  phone: z
    .string()
    .min(1, "연락처를 입력해 주세요.")
    .regex(
      /^01[016789]-?\d{3,4}-?\d{4}$/,
      "올바른 휴대폰 번호를 입력해 주세요. (예: 010-1234-5678)",
    ),
  email: z
    .string()
    .min(1, "이메일을 입력해 주세요.")
    .email("올바른 이메일 주소를 입력해 주세요."),
  message: z
    .string()
    .max(1000, "상세 요청은 1000자 이내로 입력해 주세요.")
    .optional()
    .or(z.literal("")),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;
