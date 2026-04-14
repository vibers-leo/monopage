# Vibers Admin API Schema

각 프로젝트가 `/api/vibers-admin` 엔드포인트를 구현하면 `vibers.co.kr/admin`에서 자동으로 통계를 수집합니다.

## 인증
모든 요청에 `x-vibers-admin-secret` 헤더 필수.
환경변수 `VIBERS_ADMIN_SECRET`과 비교.

## GET /api/vibers-admin (기본 응답 — 대시보드용)

### Response
{
  "projectId": "your-project-id",
  "projectName": "프로젝트 이름",
  "stats": {
    "totalUsers": 0,      // 전체 사용자 수
    "contentCount": 0,    // 콘텐츠/사이트/상품 수 (프로젝트별 주요 엔티티)
    "mau": 0,             // 월간 활성 사용자 (없으면 0)
    "recentSignups": 0    // 최근 7일 신규 가입/생성
  },
  "recentActivity": [     // 최근 5건
    {
      "id": "unique-id",
      "type": "signup" | "inquiry" | "project_created" | "order" | "review",
      "label": "표시할 한글 메시지",
      "timestamp": "2026-04-09T12:00:00.000Z"
    }
  ],
  "health": "healthy" | "error" | "warning"
}

## GET /api/vibers-admin?resource=xxx (리소스별 상세 데이터)

### 공통 파라미터
- `resource`: 리소스 종류 (아래 목록)
- 추가 파라미터는 프로젝트별 자유롭게 확장

### 표준 리소스 목록
| resource | 설명 | 권장 필드 |
|----------|------|----------|
| users | 사용자 목록 | id, name, email, role, status, createdAt |
| inquiries | 문의/요청 목록 | id, name, phone, email, message, status, createdAt |
| orders | 주문/신청 목록 | id, customerName, amount, status, createdAt |
| content | 콘텐츠 목록 | id, title, type, status, createdAt |
| stats | 집계 통계 | 프로젝트별 자유 정의 |

### Response
{
  "resource": "users",
  "data": [ ...항목 배열 ]
}

## 구현 예시 (Next.js)

```ts
// app/api/vibers-admin/route.ts
export async function GET(request: Request) {
  const secret = process.env.VIBERS_ADMIN_SECRET;
  if (request.headers.get("x-vibers-admin-secret") !== secret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... 구현
}
```

## 환경변수
VIBERS_ADMIN_SECRET=vibers-admin-secret-2026  (Vercel/서버에 추가)
