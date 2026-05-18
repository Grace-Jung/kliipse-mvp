import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Clear all tables
    await prisma.partnerApplication.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.serviceRequest.deleteMany();
    await prisma.successCase.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.artist.deleteMany();
    await prisma.user.deleteMany();

    // Admin user
    const passwordHash = await bcrypt.hash("admin1234", 10);
    await prisma.user.create({
      data: { name: "관리자", email: "admin@kliipse.com", passwordHash, role: "ADMIN" },
    });

    // Customer users
    const customerPasswordHash = await bcrypt.hash("user1234", 10);
    const customers = await Promise.all([
      prisma.user.create({
        data: { name: "김민수", email: "minsu@example.com", phone: "010-1234-5678", passwordHash: customerPasswordHash, role: "CUSTOMER" },
      }),
      prisma.user.create({
        data: { name: "이서연", email: "seoyeon@example.com", phone: "010-9876-5432", passwordHash: customerPasswordHash, role: "CUSTOMER" },
      }),
      prisma.user.create({
        data: { name: "박준호", email: "junho@example.com", phone: "010-5555-1234", passwordHash: customerPasswordHash, role: "CUSTOMER" },
      }),
    ]);

    // Artists
    const artists = await Promise.all([
      prisma.artist.create({ data: { name: "김서울", stageName: "DJ SEOUL", genres: JSON.stringify(["House", "Deep House"]), careerYears: 5, location: "서울", bio: "서울 주요 클럽에서 활동 중인 하우스 전문 DJ. 분위기를 읽는 감각과 세련된 사운드로 파티를 이끕니다.", rating: 5.0, basePrice: 500000 } }),
      prisma.artist.create({ data: { name: "박메트로", stageName: "DJ METRO", genres: JSON.stringify(["Techno", "Progressive"]), careerYears: 7, location: "서울", bio: "국내외 페스티벌 무대 경험이 풍부한 테크노 DJ. 강렬한 비트와 몰입감 있는 세트로 유명합니다.", rating: 4.8, basePrice: 800000 } }),
      prisma.artist.create({ data: { name: "이바이브", stageName: "DJ VIBE", genres: JSON.stringify(["Hip-Hop", "R&B"]), careerYears: 6, location: "서울", bio: "기업 행사와 브랜드 파티 전문 DJ. 힙합과 R&B 기반의 세련된 선곡으로 고급스러운 분위기를 연출합니다.", rating: 5.0, basePrice: 600000 } }),
      prisma.artist.create({ data: { name: "최루나", stageName: "DJ LUNA", genres: JSON.stringify(["EDM", "Future Bass"]), careerYears: 4, location: "부산", bio: "웨딩과 프라이빗 파티 전문 DJ. 감성적인 EDM과 팝 리믹스로 특별한 순간을 만들어 드립니다.", rating: 4.9, basePrice: 450000 } }),
      prisma.artist.create({ data: { name: "정펄스", stageName: "DJ PULSE", genres: JSON.stringify(["Deep House", "Lounge"]), careerYears: 8, location: "서울", bio: "프리미엄 라운지와 바에서 활동하는 딥하우스 전문 DJ. 공간의 무드를 완성하는 정교한 사운드를 제공합니다.", rating: 4.7, basePrice: 550000 } }),
      prisma.artist.create({ data: { name: "한블레이즈", stageName: "DJ BLAZE", genres: JSON.stringify(["K-Pop", "Top 40"]), careerYears: 3, location: "인천", bio: "K-Pop과 Top 40 전문의 에너지 넘치는 DJ. 파티와 이벤트에서 모든 세대를 즐겁게 합니다.", rating: 4.6, basePrice: 400000 } }),
    ]);

    // Equipment
    const equipments = await Promise.all([
      prisma.equipment.create({ data: { name: "프리미엄 사운드 시스템", category: "스피커", description: "100명 규모 행사에 적합한 프리미엄 사운드 시스템. 전문가 세팅 포함.", rentalPrice: 300000, specs: JSON.stringify({ capacity: "100명", wattage: "2000W", brand: "JBL PRX", includes: "스피커 2대 + 서브우퍼 1대 + 믹서" }) } }),
      prisma.equipment.create({ data: { name: "프로페셔널 DJ 부스", category: "DJ 세트", description: "CDJ-3000 기반 프로페셔널 DJ 부스 풀세트.", rentalPrice: 500000, specs: JSON.stringify({ includes: "CDJ-3000 x2 + DJM-900NXS2 + 헤드폰", brand: "Pioneer DJ", level: "프로페셔널" }) } }),
      prisma.equipment.create({ data: { name: "무빙 라이트 패키지", category: "조명", description: "LED 무빙 라이트 패키지. DMX 컨트롤러 포함.", rentalPrice: 200000, specs: JSON.stringify({ includes: "무빙헤드 4대 + DMX 컨트롤러", type: "LED", control: "DMX512" }) } }),
      prisma.equipment.create({ data: { name: "서브우퍼 시스템", category: "스피커", description: "강력한 저음을 위한 서브우퍼 시스템.", rentalPrice: 250000, specs: JSON.stringify({ capacity: "200명", wattage: "3000W", brand: "QSC KS", includes: "서브우퍼 2대" }) } }),
      prisma.equipment.create({ data: { name: "LED 월 패널", category: "조명", description: "대형 LED 월 패널. 영상 송출과 조명 효과 동시 제공.", rentalPrice: 350000, specs: JSON.stringify({ size: "3m x 2m", resolution: "P3", includes: "LED 패널 + 컨트롤러 + 프레임" }) } }),
      prisma.equipment.create({ data: { name: "올인원 PA 시스템", category: "스피커", description: "소규모 행사에 적합한 올인원 PA 시스템.", rentalPrice: 400000, specs: JSON.stringify({ capacity: "300명", wattage: "4000W", brand: "Bose", includes: "컬럼 스피커 2대 + 서브우퍼 2대 + 무선마이크" }) } }),
    ]);

    // Success Cases
    await Promise.all([
      prisma.successCase.create({ data: { title: "스타트업 런칭 파티", serviceType: "기업 행사", description: "200명 규모의 런칭 파티에 DJ 섭외와 프리미엄 음향 장비를 매칭하여 성공적인 행사를 진행했습니다.", resultSummary: "DJ VIBE 섭외 + 프리미엄 사운드 시스템 + 무빙 라이트 패키지. 참석자 만족도 98%." } }),
      prisma.successCase.create({ data: { title: "강남 프리미엄 클럽", serviceType: "음향 시공", description: "500평 규모의 클럽 음향 설계부터 시공까지 토탈 솔루션을 제공하여 최상의 사운드를 구현했습니다.", resultSummary: "L-Acoustics 시스템 설계 및 시공. 개장 후 6개월 무상 유지보수 포함." } }),
      prisma.successCase.create({ data: { title: "야외 음악 페스티벌", serviceType: "페스티벌", description: "1000명 규모의 야외 페스티벌에 5명의 DJ와 대형 음향 장비를 매칭하여 완벽한 무대를 완성했습니다.", resultSummary: "DJ 5명 섭외 + 대형 PA 시스템 + LED 월. 행사 종료 후 재계약 확정." } }),
    ]);

    // Reviews
    await Promise.all([
      prisma.review.create({ data: { rating: 5.0, content: "DJ SEOUL 선곡 센스가 정말 좋았어요!", authorName: "김민수", artistId: artists[0].id } }),
      prisma.review.create({ data: { rating: 5.0, content: "프로페셔널한 진행에 감탄했습니다.", authorName: "이정화", artistId: artists[0].id } }),
      prisma.review.create({ data: { rating: 4.8, content: "DJ METRO의 테크노 셋은 정말 압도적이었어요.", authorName: "박준호", artistId: artists[1].id } }),
      prisma.review.create({ data: { rating: 5.0, content: "DJ VIBE 덕분에 회사 행사가 격이 달라졌어요.", authorName: "최서연", artistId: artists[2].id } }),
      prisma.review.create({ data: { rating: 4.9, content: "웨딩에 DJ LUNA 감성적인 선곡이 너무 좋았어요.", authorName: "정다은", artistId: artists[3].id } }),
      prisma.review.create({ data: { rating: 4.5, content: "라운지 오프닝에 DJ PULSE 공간 분위기와 완벽.", authorName: "한지민", artistId: artists[4].id } }),
      prisma.review.create({ data: { rating: 4.8, content: "사운드 시스템 퀄리티가 기대 이상이었어요.", authorName: "송태현", equipmentId: equipments[0].id } }),
      prisma.review.create({ data: { rating: 5.0, content: "CDJ-3000 풀세트 상태가 완벽했습니다.", authorName: "윤재혁", equipmentId: equipments[1].id } }),
      prisma.review.create({ data: { rating: 4.7, content: "무빙 라이트 효과가 정말 멋졌어요.", authorName: "임수정", equipmentId: equipments[2].id } }),
      prisma.review.create({ data: { rating: 4.9, content: "PA 시스템 음질이 놀랍습니다.", authorName: "강현우", equipmentId: equipments[5].id } }),
    ]);

    // Service Requests with CONFIRMED status (for payments)
    const serviceRequests = await Promise.all([
      prisma.serviceRequest.create({
        data: {
          customerName: "김민수",
          phone: "010-1234-5678",
          email: "minsu@example.com",
          userId: customers[0].id,
          serviceType: "DJ_BOOKING",
          eventDate: "2026-05-20",
          eventLocation: "서울 강남 이벤트홀",
          eventType: "기업 행사",
          budget: "200만원 이상",
          message: "런칭 파티 DJ 섭외 요청",
          status: "CONFIRMED",
        },
      }),
      prisma.serviceRequest.create({
        data: {
          customerName: "이서연",
          phone: "010-9876-5432",
          email: "seoyeon@example.com",
          userId: customers[1].id,
          serviceType: "EQUIPMENT_RENTAL",
          eventDate: "2026-04-15",
          eventLocation: "부산 해운대 비치클럽",
          eventType: "프라이빗 파티",
          budget: "100만원 ~ 200만원",
          message: "사운드 시스템 대여",
          status: "CONFIRMED",
        },
      }),
      prisma.serviceRequest.create({
        data: {
          customerName: "박준호",
          phone: "010-5555-1234",
          email: "junho@example.com",
          userId: customers[2].id,
          serviceType: "SOUND_INSTALLATION",
          eventDate: "2026-03-10",
          eventLocation: "서울 홍대 라운지바",
          eventType: "음향 시공",
          budget: "500만원 이상",
          message: "라운지바 음향 시공 의뢰",
          status: "CONFIRMED",
        },
      }),
    ]);

    // Payment records
    await Promise.all([
      prisma.payment.create({
        data: {
          serviceRequestId: serviceRequests[0].id,
          amount: 1500000,
          method: "CARD",
          status: "COMPLETED",
          cardNumber: "****-****-****-1234",
          transactionId: "TXN-2026-0501",
          paidAt: new Date("2026-05-01T10:00:00"),
        },
      }),
      prisma.payment.create({
        data: {
          serviceRequestId: serviceRequests[1].id,
          amount: 800000,
          method: "KAKAO_PAY",
          status: "COMPLETED",
          transactionId: "TXN-2026-0415",
          paidAt: new Date("2026-04-15T14:30:00"),
        },
      }),
      prisma.payment.create({
        data: {
          serviceRequestId: serviceRequests[2].id,
          amount: 5500000,
          method: "BANK_TRANSFER",
          status: "COMPLETED",
          bankName: "국민은행",
          transactionId: "TXN-2026-0310",
          paidAt: new Date("2026-03-10T09:00:00"),
        },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Seed completed!" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
